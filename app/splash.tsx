import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#065f46', '#059669', '#10b981']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>ST</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Spiritual Tablets</Text>
        <Text style={styles.subtitle}>Enlighten Your Journey</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#065f46',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
    width: 200,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});