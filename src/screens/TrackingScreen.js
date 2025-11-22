import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRides } from '../context/RideContext';
import { useAuth } from '../context/AuthContext';

const TrackingScreen = ({ route, navigation }) => {
    const { rideId } = route.params;
    const { rides, activeRide, startRide, updateRideLocation, completeRide } = useRides();
    const { userMode } = useAuth();
    const mapRef = useRef(null);

    const ride = rides.find(r => r.id === rideId);

    // Local state for simulation interval
    const simulationRef = useRef(null);
    const [eta, setEta] = useState(15);

    // Determine current driver location
    const currentDriverLocation = activeRide?.id === rideId && activeRide.currentLocation
        ? activeRide.currentLocation
        : ride.originCoords;

    const isDriver = userMode === 'driver';
    const isRideActive = activeRide?.id === rideId && activeRide.status === 'in_progress';
    const isRideCompleted = activeRide?.id === rideId && activeRide.status === 'completed';

    useEffect(() => {
        if (isDriver && isRideActive) {
            // Real-time tracking using device location
            const startTracking = async () => {
                const { getCurrentLocation } = require('../services/LocationService');

                // Initial location
                const location = await getCurrentLocation();
                if (location) {
                    updateRideLocation(location);
                }

                // Poll for updates (simple implementation for demo)
                // In production, use Location.watchPositionAsync
                simulationRef.current = setInterval(async () => {
                    const newLoc = await getCurrentLocation();
                    if (newLoc) {
                        updateRideLocation(newLoc);
                        // Calculate ETA based on distance to destination (mock calculation)
                        // setEta(...) 
                    }
                }, 5000); // Update every 5 seconds
            };

            startTracking();
        }

        return () => {
            if (simulationRef.current) clearInterval(simulationRef.current);
        };
    }, [isDriver, isRideActive]);

    const handleStartRide = () => {
        startRide(ride.id);
        Alert.alert('Ride Started', 'You are now sharing your location.');
    };

    const handleEndRide = () => {
        completeRide();
        if (simulationRef.current) clearInterval(simulationRef.current);
        Alert.alert('Ride Ended', 'You have arrived at the destination.', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    if (!ride) return null;

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: ride.originCoords ? (ride.originCoords.latitude + ride.destinationCoords.latitude) / 2 : 17.3850,
                    longitude: ride.originCoords ? (ride.originCoords.longitude + ride.destinationCoords.longitude) / 2 : 78.4867,
                    latitudeDelta: ride.originCoords ? Math.abs(ride.originCoords.latitude - ride.destinationCoords.latitude) * 1.5 : 0.1,
                    longitudeDelta: ride.originCoords ? Math.abs(ride.originCoords.longitude - ride.destinationCoords.longitude) * 1.5 : 0.1,
                }}
            >
                <Marker coordinate={ride.originCoords} title="Origin" pinColor={COLORS.primary} />
                <Marker coordinate={ride.destinationCoords} title="Destination" pinColor={COLORS.secondary} />

                {/* Driver Marker - Only show if ride is active or it's the driver view */}
                {(isRideActive || isDriver) && (
                    <Marker coordinate={currentDriverLocation} title="Driver">
                        <View style={styles.carMarker}>
                            <Ionicons name="car" size={24} color={COLORS.white} />
                        </View>
                    </Marker>
                )}

                <Polyline
                    coordinates={[ride.originCoords, ride.destinationCoords]}
                    strokeColor={COLORS.primary}
                    strokeWidth={4}
                />
            </MapView>

            <SafeAreaView style={styles.overlay} edges={['top', 'left', 'right']}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>

                <View style={styles.bottomContainer}>
                    {isDriver ? (
                        <View style={styles.controlPanel}>
                            {!isRideActive && !isRideCompleted ? (
                                <TouchableOpacity style={styles.actionButton} onPress={handleStartRide}>
                                    <Text style={styles.actionButtonText}>Start Ride</Text>
                                </TouchableOpacity>
                            ) : isRideActive ? (
                                <TouchableOpacity style={[styles.actionButton, styles.endButton]} onPress={handleEndRide}>
                                    <Text style={styles.actionButtonText}>End Ride</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.statusText}>Ride Completed</Text>
                            )}
                        </View>
                    ) : (
                        <View style={styles.statusCard}>
                            <View style={styles.driverRow}>
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>{ride.driver.name[0]}</Text>
                                </View>
                                <View>
                                    <Text style={styles.driverName}>{ride.driver.name}</Text>
                                    <Text style={styles.statusText}>
                                        {isRideActive
                                            ? (eta > 0 ? `Arriving in ${Math.ceil(eta)} mins` : 'Arriving now')
                                            : (isRideCompleted ? 'Ride Completed' : 'Waiting for driver...')}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <Text style={styles.routeText}>{ride.origin} ➝ {ride.destination}</Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        padding: 20,
        pointerEvents: 'box-none',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        marginTop: 10,
    },
    bottomContainer: {
        width: '100%',
    },
    statusCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    controlPanel: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    endButton: {
        backgroundColor: COLORS.danger,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    driverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statusText: {
        fontSize: 14,
        color: COLORS.success,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.lightGray,
        marginBottom: 12,
    },
    routeText: {
        fontSize: 14,
        color: COLORS.gray,
    },
    carMarker: {
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
});

export default TrackingScreen;
