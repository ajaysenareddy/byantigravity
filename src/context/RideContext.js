import React, { createContext, useState, useContext } from 'react';

const RideContext = createContext();

const MOCK_RIDES = [
    {
        id: '1',
        driver: { name: 'Alice Smith', rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=alice' },
        origin: 'Hitech City',
        destination: 'Gachibowli',
        originCoords: { latitude: 17.4435, longitude: 78.3772 },
        destinationCoords: { latitude: 17.4401, longitude: 78.3489 },
        date: '2023-11-25',
        time: '08:00 AM',
        price: 15,
        seats: 3,
        availableSeats: 2,
        description: 'Leaving from Cyber Towers. Non-smoking.',
    },
    {
        id: '2',
        driver: { name: 'Bob Jones', rating: 4.5, avatar: 'https://i.pravatar.cc/150?u=bob' },
        origin: 'Kondapur',
        destination: 'Financial District',
        originCoords: { latitude: 17.4622, longitude: 78.3568 },
        destinationCoords: { latitude: 17.4105, longitude: 78.3378 },
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
        origin: 'Jubilee Hills',
        destination: 'Banjara Hills',
        originCoords: { latitude: 17.4326, longitude: 78.4071 },
        destinationCoords: { latitude: 17.4138, longitude: 78.4398 },
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

    const [activeRide, setActiveRide] = useState(null); // { id, status: 'scheduled' | 'in_progress' | 'completed', currentLocation }

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
            // Default coords for posted rides (mock) - Hyderabad Center
            originCoords: newRide.originCoords || { latitude: 17.3850, longitude: 78.4867 },
            destinationCoords: newRide.destinationCoords || { latitude: 17.4401, longitude: 78.3489 },
        };
        setRides([ride, ...rides]);
        setMyPostedRides([ride, ...myPostedRides]);
    };

    const startRide = (rideId) => {
        const ride = rides.find(r => r.id === rideId);
        if (ride) {
            setActiveRide({
                id: rideId,
                status: 'in_progress',
                currentLocation: ride.originCoords,
            });
        }
    };

    const updateRideLocation = (location) => {
        if (activeRide) {
            setActiveRide(prev => ({ ...prev, currentLocation: location }));
        }
    };

    const completeRide = () => {
        if (activeRide) {
            setActiveRide(prev => ({ ...prev, status: 'completed' }));
            // Optional: Clear active ride after some time or immediately
            setTimeout(() => setActiveRide(null), 3000);
        }
    };

    return (
        <RideContext.Provider value={{
            rides,
            searchRides,
            bookRide,
            postRide,
            myBookings,
            myPostedRides,
            activeRide,
            startRide,
            updateRideLocation,
            completeRide
        }}>
            {children}
        </RideContext.Provider>
    );
};

export const useRides = () => useContext(RideContext);
