import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="books" />
      <Stack.Screen name="audios" />
      <Stack.Screen name="videos" />
      <Stack.Screen name="events" />
      <Stack.Screen name="newsletters" />
      <Stack.Screen name="gallery" />
      <Stack.Screen name="counselors" />
      <Stack.Screen name="patient-god" />
      <Stack.Screen name="admission-centers" />
      <Stack.Screen name="users" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="configuration" />
    </Stack>
  );
}