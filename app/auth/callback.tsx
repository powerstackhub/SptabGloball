// app/auth/callback.tsx
import { useEffect } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { sleep } from '../../utils/sleep'; 
export default function AuthCallback() {
  const router = useRouter();
  const { triggerRefresh } = useAuth();

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      try {
        if (!url) return;

        // Web: prefer getSessionFromUrl which stores session in client
        if (Platform.OS === 'web') {
          try {
            // @ts-ignore - newer supabase-js exposes getSessionFromUrl
            const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
            if (error) {
              console.warn('[Callback] getSessionFromUrl error', error);
            } else if (data?.session) {
              // ensure profile sync/upsert runs
              try { await triggerRefresh(); } catch (e) { console.warn(e); }
              router.replace('/(tabs)');
              return;
            }
          } catch (e) {
            console.warn('[Callback] getSessionFromUrl threw', e);
            // fallthrough to manual parse
          }
        }

        // Fallback for native or if getSessionFromUrl didn't work:
        const hashIndex = url.indexOf('#');
        const fragment = hashIndex !== -1 ? url.substring(hashIndex + 1) : '';
        const params = new URLSearchParams(fragment);
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          // Set session explicitly so supabase client stores auth state
          // @ts-ignore
        
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          
          if (error) {
            console.warn('[Callback] setSession error', error);
            throw error;
          }

          // Trigger profile sync / upsert in AuthContext
          try { await triggerRefresh(); } catch (e) { console.warn('[Callback] triggerRefresh failed', e); }
          
          router.replace('/(tabs)');
          return;
        }

        console.warn('[Callback] No tokens found in callback URL');
        router.replace('/login');
      } catch (e) {
        console.error('[Callback] Error handling callback', e);
        router.replace('/login');
      }
    };

    (async () => {
      const initial = await Linking.getInitialURL();
      if (initial) {
        await handleUrl(initial);
      }
    })();

    const sub = Linking.addEventListener('url', (e) => handleUrl(e.url));
    return () => sub.remove();
  }, [router, triggerRefresh]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#065f46' }}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={{ color: 'white', marginTop: 20 }}>Finalizing login...</Text>
    </View>
  );
}
