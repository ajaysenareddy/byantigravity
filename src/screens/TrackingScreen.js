import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const TrackingScreen = ({ route, navigation }) => {
    const { ride } = route.params;
    const mapRef = useRef(null);

    // Initial driver position (starts at origin)
    const [driverLocation, setDriverLocation] = useState(ride.originCoords);
    const [eta, setEta] = useState(15); // Mock ETA in minutes

    useEffect(() => {
        // Simulate driver movement
        const interval = setInterval(() => {
            setDriverLocation((prev) => {
                const latDiff = (ride.destinationCoords.latitude - ride.originCoords.latitude) / 100;
                const lngDiff = (ride.destinationCoords.longitude - ride.originCoords.longitude) / 100;

                const newLat = prev.latitude + latDiff;
                const newLng = prev.longitude + lngDiff;

                // Stop if reached (rough check)
                if (Math.abs(newLat - ride.destinationCoords.latitude) < 0.001) {
                    clearInterval(interval);
                    setEta(0);
                    return ride.destinationCoords;
                }

                setEta((prevEta) => Math.max(0, prevEta - 0.1)); // Decrease ETA
                return { latitude: newLat, longitude: newLng };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [ride]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: (ride.originCoords.latitude + ride.destinationCoords.latitude) / 2,
                    longitude: (ride.originCoords.longitude + ride.destinationCoords.longitude) / 2,
                    latitudeDelta: Math.abs(ride.originCoords.latitude - ride.destinationCoords.latitude) * 1.5,
                    longitudeDelta: Math.abs(ride.originCoords.longitude - ride.destinationCoords.longitude) * 1.5,
                }}
            >
                {/* Origin Marker */}
                <Marker coordinate={ride.originCoords} title="Origin" pinColor={COLORS.primary} />

                {/* Destination Marker */}
                <Marker coordinate={ride.destinationCoords} title="Destination" pinColor={COLORS.secondary} />

                {/* Driver Marker */}
                <Marker coordinate={driverLocation} title="Driver">
                    <View style={styles.carMarker}>
                        <Ionicons name="car" size={24} color={COLORS.white} />
                    </View>
                </Marker>

                {/* Route Line */}
                <Polyline
                    coordinates={[ride.originCoords, ride.destinationCoords]}
                    strokeColor={COLORS.primary}
                    strokeWidth={4}
                />
            </MapView>

            <SafeAreaView style={styles.overlay}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>

                <View style={styles.statusCard}>
                    <View style={styles.driverRow}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{ride.driver.name[0]}</Text>
                        </View>
                        <View>
                            <Text style={styles.driverName}>{ride.driver.name}</Text>
                            <Text style={styles.statusText}>
                                {eta > 0 ? `Arriving in ${Math.ceil(eta)} mins` : 'Arrived!'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.routeText}>{ride.origin} ➝ {ride.destination}</Text>
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
        pointerEvents: 'box-none', // Allow touches to pass through to map where empty
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
