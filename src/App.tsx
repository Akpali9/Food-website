import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/queryClient';
import RootNavigator from './navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import './global.css'; // NativeWind global styles

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
