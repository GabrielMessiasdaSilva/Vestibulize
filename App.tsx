// App.tsx
import AppRoutes from './src/navigation';
import './src/i18n';
import React from 'react';
import { UserProvider } from "./src/services/userContext";
import FlashMessage from "react-native-flash-message";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

export default function App() {

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  return (
    <UserProvider>
      <FlashMessage position="center" />

      <AppRoutes />

    </UserProvider>
  );
}