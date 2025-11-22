import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRides } from '../context/RideContext';
import { COLORS } from '../constants/colors';

const PostRideScreen = ({ navigation }) => {
    const { postRide } = useRides();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [price, setPrice] = useState('');
    const [seats, setSeats] = useState('');
    const [description, setDescription] = useState('');

    const handlePostRide = () => {
        if (!origin || !destination || !date || !time || !price || !seats) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const newRide = {
            origin,
            destination,
            date,
            time,
            price: parseInt(price),
            seats: parseInt(seats),
            description,
        };

        postRide(newRide);
        Alert.alert('Success', 'Ride posted successfully!', [
            { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.headerTitle}>Post a Ride</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>From</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Origin (e.g. Downtown)"
                        value={origin}
                        onChangeText={setOrigin}
                    />

                    <Text style={styles.label}>To</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Destination (e.g. Airport)"
                        value={destination}
                        onChangeText={setDestination}
                    />

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="YYYY-MM-DD"
                                value={date}
                                onChangeText={setDate}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Time</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="HH:MM AM/PM"
                                value={time}
                                onChangeText={setTime}
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Price ($)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="20"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Text style={styles.label}>Seats</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="3"
                                value={seats}
                                onChangeText={setSeats}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Description (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Add details about your ride..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <TouchableOpacity style={styles.button} onPress={handlePostRide}>
                        <Text style={styles.buttonText}>Post Ride</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 24,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 20,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PostRideScreen;
