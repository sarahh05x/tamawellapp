import React from 'react';
import { Stack } from 'expo-router';
import { PetProvider } from '../context/PetContext';

export default function RootLayout() {
  return (
    <PetProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PetProvider>
  );
}
