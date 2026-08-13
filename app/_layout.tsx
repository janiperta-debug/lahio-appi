import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/auth';
import { I18nProvider } from '../lib/i18n';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <I18nProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="create-listing" options={{ presentation: 'modal' }} />
          <Stack.Screen name="create-event" options={{ presentation: 'modal' }} />
          <Stack.Screen name="my-listings" />
          <Stack.Screen name="transit" />
          <Stack.Screen name="event/[id]" />
          <Stack.Screen name="user/[id]" />
        </Stack>
      </I18nProvider>
    </AuthProvider>
  );
}
