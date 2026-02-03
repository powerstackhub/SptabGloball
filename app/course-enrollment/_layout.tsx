import { Stack } from 'expo-router/stack';

export default function CourseEnrollmentLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="form" options={{ headerShown: false }} />
    </Stack>
  );
}
