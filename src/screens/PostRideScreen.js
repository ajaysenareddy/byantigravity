import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRides } from '../context/RideContext';
import { COLORS } from '../constants/colors';
import { getPlaceSuggestions } from '../services/LocationService';

const PostRideScreen = ({ navigation }) => {
    const { postRide } = useRides();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [originCoords, setOriginCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);

    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destSuggestions, setDestSuggestions] = useState([]);

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [price, setPrice] = useState('');
    const [seats, setSeats] = useState('');
    const [description, setDescription] = useState('');

    const handleSearch = async (text, type) => {
        if (type === 'origin') {
            setOrigin(text);
            const suggestions = await getPlaceSuggestions(text);
            setOriginSuggestions(suggestions);
        } else {
            setDestination(text);
            const suggestions = await getPlaceSuggestions(text);
            setDestSuggestions(suggestions);
        }
    };

    const handleSelectPlace = async (place, type) => {
        if (type === 'origin') {
            setOrigin(place.name);
            setOriginCoords(place.coords);
            setOriginSuggestions([]);
        } else {
            setDestination(place.name);
            setDestinationCoords(place.coords);
            setDestSuggestions([]);
        }
    };

    const handlePostRide = () => {
        if (!origin || !destination || !date || !time || !price || !seats) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Use selected coords or default if not selected (fallback for manual entry)
        // In a real app, we'd force selection or geocode the manual entry.
        // For this demo, we'll use a default if coords are missing but warn the user?
        // Or just use a default Hyderabad location.
        const defaultCoords = { latitude: 17.3850, longitude: 78.4867 }; // Hyderabad center

        const newRide = {
            origin,
            destination,
            originCoords: originCoords || defaultCoords,
            destinationCoords: destinationCoords || defaultCoords,
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

    const renderSuggestions = (suggestions, type) => {
        if (suggestions.length === 0) return null;

        return (
            <View style={styles.suggestionsContainer}>
                {suggestions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => handleSelectPlace(item, type)}
                    >
                        <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Text style={styles.headerTitle}>Post a Ride</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>From</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Origin (e.g. Hitech City)"
                            value={origin}
                            onChangeText={(text) => handleSearch(text, 'origin')}
                        />
                        {renderSuggestions(originSuggestions, 'origin')}
                    </View>

                    <Text style={styles.label}>To</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Destination (e.g. Gachibowli)"
                            value={destination}
                            onChangeText={(text) => handleSearch(text, 'destination')}
                        />
                        {renderSuggestions(destSuggestions, 'destination')}
                    </View>

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
    inputContainer: {
        marginBottom: 20,
        zIndex: 1, // Ensure suggestions appear on top
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        maxHeight: 150,
        zIndex: 1000,
        elevation: 5,
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    suggestionText: {
        fontSize: 14,
        color: COLORS.text,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: -1,
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
        zIndex: -1,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PostRideScreen;
