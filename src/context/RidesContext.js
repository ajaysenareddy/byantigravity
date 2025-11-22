import React, { createContext, useState, useContext } from 'react';

const RidesContext = createContext();

const INITIAL_RIDES = [
    { id: '1', driver: 'John Doe', origin: 'Downtown', destination: 'Airport', price: 25, date: 'Today, 5:00 PM', seats: 3 },
    { id: '2', driver: 'Jane Smith', origin: 'Suburb A', destination: 'City Center', price: 15, date: 'Tomorrow, 9:00 AM', seats: 2 },
    { id: '3', driver: 'Mike Johnson', origin: 'University', destination: 'Mall', price: 10, date: 'Sat, 2:00 PM', seats: 4 },
];

export const RidesProvider = ({ children }) => {
    const [rides, setRides] = useState(INITIAL_RIDES);
    const [bookings, setBookings] = useState([]);

    const addRide = (ride) => {
        const newRide = { ...ride, id: Math.random().toString() };
        setRides([...rides, newRide]);
    };

    const bookRide = (rideId) => {
        const ride = rides.find(r => r.id === rideId);
        if (ride && ride.seats > 0) {
            setBookings([...bookings, ride]);
            // Optional: Decrement seats
            setRides(rides.map(r => r.id === rideId ? { ...r, seats: r.seats - 1 } : r));
            return true;
        }
        return false;
    };

    return (
        <RidesContext.Provider value={{ rides, bookings, addRide, bookRide }}>
            {children}
        </RidesContext.Provider>
    );
};

export const useRides = () => useContext(RidesContext);
