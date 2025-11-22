import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRides } from '../context/RideContext';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    const { searchRides } = useRides();
    const [searchQuery, setSearchQuery] = useState('');
    const rides = searchRides(searchQuery);

    const renderRideItem = ({ item }) => (
        <TouchableOpacity
            style={styles.rideCard}
            onPress={() => navigation.navigate('RideDetails', { rideId: item.id })}
        >
            <View style={styles.rideHeader}>
                <View style={styles.driverInfo}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{item.driver.name[0]}</Text>
                    </View>
                    <View>
                        <Text style={styles.driverName}>{item.driver.name}</Text>
                        <Text style={styles.rating}>⭐ {item.driver.rating}</Text>
                    </View>
                </View>
                <Text style={styles.price}>${item.price}</Text>
            </View>

            <View style={styles.routeContainer}>
                <View style={styles.locationRow}>
                    <Ionicons name="radio-button-on" size={16} color={COLORS.primary} />
                    <Text style={styles.locationText}>{item.origin}</Text>
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={16} color={COLORS.secondary} />
                    <Text style={styles.locationText}>{item.destination}</Text>
                </View>
            </View>

            <View style={styles.rideFooter}>
                <Text style={styles.date}>{item.date} • {item.time}</Text>
                <Text style={[styles.seats, item.availableSeats === 0 && styles.seatsFull]}>
                    {item.availableSeats} seats left
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Find a Ride</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Where to?"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={rides}
                renderItem={renderRideItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No rides found</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('PostRide')}
            >
                <Ionicons name="add" size={30} color={COLORS.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    listContent: {
        padding: 16,
    },
    rideCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rideHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    rating: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 2,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.success,
    },
    routeContainer: {
        marginBottom: 16,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    verticalLine: {
        width: 2,
        height: 16,
        backgroundColor: COLORS.lightGray,
        marginLeft: 7,
    },
    locationText: {
        fontSize: 16,
        color: COLORS.text,
        marginLeft: 12,
    },
    rideFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        paddingTop: 12,
    },
    date: {
        fontSize: 14,
        color: COLORS.gray,
    },
    seats: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    seatsFull: {
        color: COLORS.danger,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: COLORS.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});

export default HomeScreen;
