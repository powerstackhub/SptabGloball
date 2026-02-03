// app/login.tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    setIsLoading(false);
    // Root layout / AuthContext will react to session change and navigate
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        // On web, ask Supabase to redirect back to your callback path
        const redirectTo = `${window.location.origin}/auth/callback`;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        });
        if (error) {
          Alert.alert('Error', error.message);
        }
        setIsLoading(false);
        return;
      }

      // Native (iOS/Android): construct app deep link redirect URI
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'spiritualtablets', // ensure your app has this scheme configured
        path: 'auth/callback',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          // skipBrowserRedirect lets us open system browser and handle return in app
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        setIsLoading(false);
        return;
      }

      if (!data?.url) {
        Alert.alert('Error', 'No URL returned from Supabase');
        setIsLoading(false);
        return;
      }

      // Open system browser - callback will be handled by auth/callback route
      await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
    } catch (err) {
      console.error('Google sign-in error:', err);
      Alert.alert('Error', 'Unexpected sign-in error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => router.replace('/(tabs)');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#065f46', '#059669', '#10b981']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>ST</Text>
          </View>
        </View>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subtitleText}>
          Sign in to continue
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Mail size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          <Text style={styles.loginButtonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={isLoading}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestButton} onPress={handleGuestAccess}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#065f46" },
  header: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  logoContainer: { width: 80, height: 40, marginBottom: 24, justifyContent: "center", alignItems: "center" },
  logoPlaceholder: { width: 80, height: 40, backgroundColor: "#ffffff", borderRadius: 8, justifyContent: "center", alignItems: "center" },
  logoText: { fontSize: 16, fontWeight: "bold", color: "#22c55e" },
  welcomeText: { fontSize: 28, fontWeight: "bold", color: "#ffffff", marginBottom: 8 },
  subtitleText: { fontSize: 16, color: "rgba(255, 255, 255, 0.8)", textAlign: "center" },

  formContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    minHeight: 400
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },

  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#111827" },
  eyeIcon: { padding: 4 },

  loginButton: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24
  },
  loginButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },

  divider: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { marginHorizontal: 16, color: "#6b7280", fontSize: 14 },

  googleButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb"
  },
  googleButtonText: { color: "#374151", fontSize: 16, fontWeight: "600" },

  guestButton: { backgroundColor: "transparent", borderRadius: 12, height: 56, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  guestButtonText: { color: "#22c55e", fontSize: 16, fontWeight: "600" },

  forgotPassword: { alignItems: "center" },
  forgotPasswordText: { color: "#6b7280", fontSize: 14 },
});
