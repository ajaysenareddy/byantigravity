import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { RideProvider } from './src/context/RideContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RideProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </RideProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
