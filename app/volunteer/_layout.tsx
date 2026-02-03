import { Stack } from 'expo-router';

export default function VolunteerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
    </Stack>
  );
}