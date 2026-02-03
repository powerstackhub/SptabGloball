import { Stack } from 'expo-router';

export default function AboutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="trusts" />
      <Stack.Screen name="facilities" />
      <Stack.Screen name="pyramid-centers" />
      <Stack.Screen name="virtual-wellness" />
      <Stack.Screen name="team" />
      <Stack.Screen name="spiritual-doctors" />
      <Stack.Screen name="association" />
      <Stack.Screen name="resources" />
    </Stack>
  );
}