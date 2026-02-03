import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import {
  Chrome as Home,
  Calendar,
  Info,
  Heart,
} from 'lucide-react-native';

import { isMobileDevice } from '../../utils/deviceDetection';

export default function TabLayout() {
  const isWeb = Platform.OS === 'web';
  const isMobile = isMobileDevice();

  // Web desktop → hide bottom tab bar
  if (
    isWeb &&
    !isMobile &&
    typeof window !== 'undefined' &&
    window.innerWidth > 1024
  ) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="events" />
        <Tabs.Screen name="about" />
        <Tabs.Screen name="donate-tab" />
      </Tabs>
    );
  }

  // Mobile / Tablet / Web mobile
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ size, color }) => (
            <Info size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="donate-tab"
        options={{
          title: 'Donate',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />

      {/* Hidden route */}
      <Tabs.Screen
        name="profile"
        options={{ href: null }}
      />
    </Tabs>
  );
}
