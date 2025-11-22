import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRides } from '../context/RideContext';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const RideDetailsScreen = ({ route, navigation }) => {
  const { rideId } = route.params;
  const { rides, bookRide, myBookings } = useRides();
  const ride = rides.find((r) => r.id === rideId);
  const isBooked = myBookings.some(booking => booking.id === rideId);



  if (!ride) {
    return (
      <View style={styles.center}>
        <Text>Ride not found</Text>
      </View>
    );
  }

  const handleBook = () => {
    Alert.alert(
      'Confirm Booking',
      `Book a seat for $${ride.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book',
          onPress: () => {
            const success = bookRide(ride.id);
            if (success) {
              Alert.alert('Success', 'Ride booked successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('MyRides') }
              ]);
            } else {
              Alert.alert('Error', 'Could not book ride. It might be full.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.driverRow}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{ride.driver.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.driverName}>{ride.driver.name}</Text>
                <Text style={styles.rating}>⭐ {ride.driver.rating} Rating</Text>
              </View>
            </View>
            <Text style={styles.price}>${ride.price}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <Ionicons name="radio-button-on" size={20} color={COLORS.primary} />
                <View style={styles.timelineContent}>
                  <Text style={styles.location}>{ride.origin}</Text>
                  <Text style={styles.time}>{ride.time}</Text>
                </View>
              </View>
              <View style={styles.timelineLine} />
              <View style={styles.timelineItem}>
                <Ionicons name="location" size={20} color={COLORS.secondary} />
                <View style={styles.timelineContent}>
                  <Text style={styles.location}>{ride.destination}</Text>
                  {/* Assuming duration or arrival time isn't in mock data yet */}
                </View>
              </View>
            </View>
            <Text style={styles.dateText}>Date: {ride.date}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Ride</Text>
            <Text style={styles.description}>{ride.description}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="people" size={20} color={COLORS.gray} />
              <Text style={styles.infoText}>{ride.availableSeats} seats available</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {isBooked ? (
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => navigation.navigate('LiveTracking', { rideId: ride.id })}
          >
            <Text style={styles.trackButtonText}>Track Ride Live</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.bookButton, ride.availableSeats === 0 && styles.bookButtonDisabled]}
            onPress={handleBook}
            disabled={ride.availableSeats === 0}
          >
            <Text style={styles.bookButtonText}>
              {ride.availableSeats === 0 ? 'Sold Out' : 'Book Seat'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  rating: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeline: {
    marginLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: COLORS.lightGray,
    marginLeft: 9,
    marginVertical: 4,
  },
  timelineContent: {
    marginLeft: 16,
    flex: 1,
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: COLORS.gray,
  },
  dateText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  trackButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RideDetailsScreen;
