import { useEffect } from 'react';
import { registerForPushNotificationsAsync, scheduleDailyNotification } from '../lib/notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function InitialLayout() {
  // destructure triggerRefresh from auth
  const { session, loading, triggerRefresh } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // --- Deep link handler that awaits setSession and triggers a full provider refresh ---
  const handleDeepLink = async (url?: string | null) => {
    try {
      if (!url) return;
      console.log('[DeepLink] URL:', url);

      const hash = url.split('#')[1] ?? '';
      if (!hash) {
        console.log('[DeepLink] No fragment in URL');
        return;
      }

      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (!access_token || !refresh_token) {
        console.log('[DeepLink] Missing tokens in URL');
        return;
      }
      console.log('[DeepLink] Missing tokens in URL');
     // console.log('[DeepLink] Setting session from deep link...');
       //supabase.auth.setSession({ access_token, refresh_token })
      //await supabase.auth.setSession({ access_token, refresh_token });
   
  
      
      
      // Confirm session is active before routing
      const { data } = await supabase.auth.getSession();
      console.log('[DeepLink] Confirm session:', !!data?.session);

      if (data?.session) {
        // Ask provider to fetch DB profile & bump authVersion
        try {
          await triggerRefresh();
          console.log('[DeepLink] triggerRefresh completed');
        } catch (err) {
          console.warn('[DeepLink] triggerRefresh failed', err);
        }

        console.log('[DeepLink] Routing to /(tabs)');
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('[DeepLink] Error handling deep link:', err);
    }
  };

  // Subscribe to linking events and handle initial URL
  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      // call async handler but don't await here
      handleDeepLink(event.url);
    });

    (async () => {
      const initial = await Linking.getInitialURL();
      console.log('[DeepLink] InitialURL:', initial);
      if (initial) {
        await handleDeepLink(initial);
      }
    })();

    return () => {
      try {
        subscription.remove();
      } catch {}
    };
  }, []);

  // Initialize notifications when the app starts
  useEffect(() => {
    const initNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            await scheduleDailyNotification();
          }
        } catch (err) {
          console.error('Failed to initialize notifications:', err);
        }
      }
    };

    initNotifications();
  }, []);

  // route guard logic
  useEffect(() => {
    if (loading) return;

    const inTabs = segments[0] === '(tabs)';

    if (session && !inTabs) {
      router.replace('/(tabs)');
    } else if (!session && inTabs) {
      router.replace('/login');
    }
  }, [session, loading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'none' }} />
      <Stack.Screen name="auth/callback" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="books" />
      <Stack.Screen name="audios" />
      <Stack.Screen name="videos" />
      <Stack.Screen name="newsletters" />
      <Stack.Screen name="gallery" />
      <Stack.Screen name="patient-god" />
      <Stack.Screen name="counselor" />
      <Stack.Screen name="counselling" />
      <Stack.Screen name="admission" />
      <Stack.Screen name="volunteer" />
      <Stack.Screen name="course-enrollment" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <InitialLayout />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}