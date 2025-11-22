import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import RideDetailsScreen from '../screens/RideDetailsScreen';
import PostRideScreen from '../screens/PostRideScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyRidesScreen from '../screens/MyRidesScreen';

import TrackingScreen from '../screens/TrackingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
);

const HomeStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RideDetails" component={RideDetailsScreen} options={{ title: 'Ride Details' }} />
        <Stack.Screen name="PostRide" component={PostRideScreen} options={{ title: 'Post a Ride' }} />
        <Stack.Screen name="Tracking" component={TrackingScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const AppTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'MyRides') {
                    iconName = focused ? 'car' : 'car-outline';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray,
            headerShown: false,
        })}
    >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="MyRides" component={MyRidesScreen} options={{ title: 'My Rides' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
);

const AppNavigator = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            {user ? <AppTabs /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigator;
