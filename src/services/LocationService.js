import * as Location from 'expo-location';

// Curated list of Hyderabad IT hubs and popular locations
const HYDERABAD_PLACES = [
    { name: 'Hitech City', coords: { latitude: 17.4435, longitude: 78.3772 } },
    { name: 'Gachibowli', coords: { latitude: 17.4401, longitude: 78.3489 } },
    { name: 'Madhapur', coords: { latitude: 17.4483, longitude: 78.3915 } },
    { name: 'Kondapur', coords: { latitude: 17.4622, longitude: 78.3568 } },
    { name: 'Financial District', coords: { latitude: 17.4105, longitude: 78.3378 } },
    { name: 'Jubilee Hills', coords: { latitude: 17.4326, longitude: 78.4071 } },
    { name: 'Banjara Hills', coords: { latitude: 17.4138, longitude: 78.4398 } },
    { name: 'KPHB Colony', coords: { latitude: 17.4933, longitude: 78.3995 } },
    { name: 'Miyapur', coords: { latitude: 17.4968, longitude: 78.3614 } },
    { name: 'Kukatpally', coords: { latitude: 17.4875, longitude: 78.4080 } },
    { name: 'Manikonda', coords: { latitude: 17.4013, longitude: 78.3937 } },
    { name: 'Nanakramguda', coords: { latitude: 17.4145, longitude: 78.3463 } },
    { name: 'Secunderabad', coords: { latitude: 17.4399, longitude: 78.4983 } },
    { name: 'Uppal', coords: { latitude: 17.3984, longitude: 78.5583 } },
    { name: 'L.B. Nagar', coords: { latitude: 17.3457, longitude: 78.5522 } },
    { name: 'Shamshabad (Airport)', coords: { latitude: 17.2403, longitude: 78.4294 } },
    { name: 'Ameerpet', coords: { latitude: 17.4375, longitude: 78.4482 } },
    { name: 'Begumpet', coords: { latitude: 17.4447, longitude: 78.4664 } },
];

export const getCurrentLocation = async () => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Permission to access location was denied');
            return null;
        }

        let location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        console.error('Error getting current location:', error);
        return null;
    }
};

export const getPlaceSuggestions = async (query) => {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    return HYDERABAD_PLACES.filter(place =>
        place.name.toLowerCase().includes(lowerQuery)
    );
};

export const getPlaceDetails = async (placeName) => {
    const place = HYDERABAD_PLACES.find(p => p.name === placeName);
    return place ? place.coords : null;
};
