import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRides } from '../context/RideContext';
import { COLORS } from '../constants/colors';

const MyRidesScreen = ({ navigation }) => {
    const { myBookings, myPostedRides } = useRides();
    const [activeTab, setActiveTab] = useState('booked'); // 'booked' or 'posted'

    const data = activeTab === 'booked' ? myBookings : myPostedRides;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RideDetails', { rideId: item.id })}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.route}>{item.origin} ➝ {item.destination}</Text>
                <Text style={styles.status}>{activeTab === 'booked' ? 'Booked' : 'Posted'}</Text>
            </View>
            <Text style={styles.date}>{item.date} at {item.time}</Text>
            <Text style={styles.details}>Price: ${item.price} • Seats: {item.seats}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Rides</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'booked' && styles.activeTab]}
                    onPress={() => setActiveTab('booked')}
                >
                    <Text style={[styles.tabText, activeTab === 'booked' && styles.activeTabText]}>Booked</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'posted' && styles.activeTab]}
                    onPress={() => setActiveTab('posted')}
                >
                    <Text style={[styles.tabText, activeTab === 'posted' && styles.activeTabText]}>Posted</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No rides found.</Text>
                    </View>
                }
            />
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
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    tabs: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 16,
        color: COLORS.gray,
        fontWeight: '600',
    },
    activeTabText: {
        color: COLORS.primary,
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    route: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    status: {
        fontSize: 14,
        color: COLORS.success,
        fontWeight: '600',
    },
    date: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 4,
    },
    details: {
        fontSize: 14,
        color: COLORS.gray,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray,
    },
});

export default MyRidesScreen;
