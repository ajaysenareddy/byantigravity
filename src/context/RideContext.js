import React, { createContext, useState, useContext } from 'react';

const RideContext = createContext();

const MOCK_RIDES = [
    {
        id: '1',
        driver: { name: 'Alice Smith', rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=alice' },
        origin: 'Downtown',
        destination: 'Airport',
        originCoords: { latitude: 37.78825, longitude: -122.4324 },
        destinationCoords: { latitude: 37.6213, longitude: -122.3790 },
        date: '2023-11-25',
        time: '08:00 AM',
        price: 15,
        seats: 3,
        availableSeats: 2,
        description: 'Leaving from Main St. Starbucks. Non-smoking.',
    },
    {
        id: '2',
        driver: { name: 'Bob Jones', rating: 4.5, avatar: 'https://i.pravatar.cc/150?u=bob' },
        origin: 'University',
        destination: 'Tech Park',
        originCoords: { latitude: 37.8715, longitude: -122.2730 },
        destinationCoords: { latitude: 37.4419, longitude: -122.1430 },
        date: '2023-11-25',
        time: '09:30 AM',
        price: 10,
        seats: 4,
        availableSeats: 4,
        description: 'Daily commute. Music lovers welcome.',
    },
    {
        id: '3',
        driver: { name: 'Charlie Brown', rating: 4.9, avatar: 'https://i.pravatar.cc/150?u=charlie' },
        origin: 'Suburbia',
        destination: 'Downtown',
        originCoords: { latitude: 37.7749, longitude: -122.4194 },
        destinationCoords: { latitude: 37.78825, longitude: -122.4324 },
        date: '2023-11-26',
        time: '07:15 AM',
        price: 12,
        seats: 3,
        availableSeats: 1,
        description: 'Quiet ride.',
    },
];

export const RideProvider = ({ children }) => {
    const [rides, setRides] = useState(MOCK_RIDES);
    const [myBookings, setMyBookings] = useState([]);
    const [myPostedRides, setMyPostedRides] = useState([]);

    const searchRides = (query) => {
        if (!query) return rides;
        const lowerQuery = query.toLowerCase();
        return rides.filter(
            (ride) =>
                ride.origin.toLowerCase().includes(lowerQuery) ||
                ride.destination.toLowerCase().includes(lowerQuery)
        );
    };

    const bookRide = (rideId) => {
        const ride = rides.find((r) => r.id === rideId);
        if (ride && ride.availableSeats > 0) {
            // Decrease seats
            const updatedRides = rides.map((r) =>
                r.id === rideId ? { ...r, availableSeats: r.availableSeats - 1 } : r
            );
            setRides(updatedRides);

            // Add to bookings
            setMyBookings([...myBookings, { ...ride, bookingId: Date.now().toString() }]);
            return true;
        }
        return false;
    };

    const postRide = (newRide) => {
        const ride = {
            ...newRide,
            id: Date.now().toString(),
            availableSeats: newRide.seats,
            driver: { name: 'Me', rating: 5.0, avatar: 'https://i.pravatar.cc/150?u=me' }, // Mock current user as driver
            // Default coords for posted rides (mock)
            originCoords: { latitude: 37.7749, longitude: -122.4194 },
            destinationCoords: { latitude: 37.78825, longitude: -122.4324 },
        };
        setRides([ride, ...rides]);
        setMyPostedRides([ride, ...myPostedRides]);
    };

    return (
        <RideContext.Provider value={{ rides, searchRides, bookRide, postRide, myBookings, myPostedRides }}>
            {children}
        </RideContext.Provider>
    );
};

export const useRides = () => useContext(RideContext);
