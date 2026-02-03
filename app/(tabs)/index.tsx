// app/index.tsx
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  AppState,
  AppStateStatus,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  BookOpen,
  Headphones,
  Video,
  Calendar,
  Mail,
  Camera,
  Users,
  MessageCircle,
  Heart,
  MapPin,
  Stethoscope,
  ArrowRight,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import WebHeader from '../../components/WebHeader';
import DonatePopup from '../../components/DonatePopup';
import { isMobileDevice } from '../../utils/deviceDetection';
import { useAuth } from '../../contexts/AuthContext';
import { donatePopupManager } from '../../utils/donatePopupManager';
import { supabase } from '../../lib/supabase';


const { width } = Dimensions.get('window');

const getCardWidth = () => {
  const isMobile = isMobileDevice();

  if (!isMobile && Platform.OS === 'web') {
    if (width > 1200) return (width - 200) / 5;
    if (width > 768) return (width - 120) / 4;
    return (width - 80) / 3;
  }
  return (width - 60) / 2;
};

const menuItems = [
  { id: 'books', title: 'Books', icon: BookOpen, color: '#3b82f6', route: '/books' },
  { id: 'audios', title: 'Audios', icon: Headphones, color: '#8b5cf6', route: '/audios' },
  { id: 'videos', title: 'Videos', icon: Video, color: '#ef4444', route: '/videos' },
  { id: 'events', title: 'Events', icon: Calendar, color: '#f59e0b', route: '/(tabs)/events' },
  { id: 'newsletters', title: 'Newsletters', icon: Mail, color: '#06b6d4', route: '/newsletters' },
  { id: 'gallery', title: 'Gallery', icon: Camera, color: '#ec4899', route: '/gallery' },
  { id: 'volunteer', title: 'Volunteer', icon: Users, color: '#84cc16', route: '/volunteer' },
  { id: 'counselling', title: 'Counselling', icon: MessageCircle, color: '#22c55e', route: '/counselling' },
  { id: 'courses', title: 'Courses', icon: BookOpen, color: '#a855f7', route: '/course-enrollment' },
  { id: 'donate', title: 'Donate', icon: Heart, color: '#f43f5e', route: '/(tabs)/donate-tab' },
  { id: 'admission', title: 'Admission Centers', icon: MapPin, color: '#6366f1', route: '/admission' },
];

const quotes = [
  "The mind is everything. What you think you become.",
  "Peace comes from within. Do not seek it without.",
  "In the midst of winter, I found there was, within me, an invincible summer.",
  "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
  "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile, user, dataLoaded ,loading} = useAuth();
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showDonatePopup, setShowDonatePopup] = useState(false);
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const isMobile = isMobileDevice();
  const insets = useSafeAreaInsets();

  // Example local data state (books etc.)
  const [books, setBooks] = useState<any[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  useEffect(() => {
    (async () => {
      const shouldShow = await donatePopupManager.shouldShowDonatePopup();
      if (shouldShow) {
        await donatePopupManager.markDonatePopupShown();
        setShowDonatePopup(true);
      }
    })();
  }, []);

  useEffect(() => {
    const handleAppState = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        (async () => {
          const shouldShow = await donatePopupManager.shouldShowDonatePopup();
          if (shouldShow) {
            await donatePopupManager.markDonatePopupShown();
            setShowDonatePopup(true);
          }
        })();
      }
    };

    const subscription = AppState.addEventListener?.('change', handleAppState);

    return () => {
      try {
        if (subscription && typeof (subscription as any).remove === 'function') {
          (subscription as any).remove();
        }
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // -----------------------
  // Data loading functions
  // -----------------------
  const loadBooks = async () => {
    try {
      setLoadingBooks(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setBooks(data || []);
    } catch (err) {
      console.error('Error loading books:', err);
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  const loadData = async () => {
    // any initial loads for home
    await loadBooks();
  };

  const getCurrentLocation = async () => {
    // placeholder for actual location logic
    setUserLocation({ city: 'Unknown' });
  };

  // -----------------------
  // Key effect: run on mount and whenever user/profile/dataLoaded changes
  // This ensures that when AuthContext finishes loading profile after Google OAuth,
  // the Home screen will re-run its loads automatically.
  // -----------------------

  useEffect(() => {
    if (!loading && profile) {
      loadData();
    }
  }, [loading, profile]);


  // if (loading) {
  //   return <ActivityIndicator style={{marginTop: 100}} />;
  // }


  //************************ *
  //commented for testing purpose
  /*useEffect(() => {
    const run = async () => {
      // WAIT for AuthContext to finish session/profile work.
      // dataLoaded === true means auth/profile state is stable (signed in or signed out).
      if (!dataLoaded) {
        // don't fetch anything until auth/profile settled
        return;
      }
  
      // small extra delay only when user just arrived to let server side upsert settle
      if (user && !profile) {
        await new Promise((r) => setTimeout(r, 300));
      }
  
      await loadData();
  
      if (!userLocation) getCurrentLocation();
    };
  
    run();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, dataLoaded]);*/
  

  // keep focus effect too
  useFocusEffect(
    useCallback(() => {
      if (!dataLoaded) return;
      loadData();
    }, [user, profile, dataLoaded])
  );
  

  const handleMenuPress = (route: string) => {
    router.push(route as any);
  };

  const handleProfilePress = () => {
    if (profile) {
      router.push('/(tabs)/profile');
    } else {
      router.push('/login');
    }
  };

  const cardWidth = getCardWidth();
  const primaryColor = '#22c55e';

  return (
    <View style={styles.container}>
      <WebHeader />

      {(!isMobile && Platform.OS === 'web') && (
        <View style={styles.webHeader}>
          <Text style={styles.pageTitle}>Welcome to Spiritual Tablets</Text>
          <Text style={styles.pageSubtitle}>Your journey to spiritual enlightenment begins here</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(Platform.OS !== 'web' || isMobile) && (
          <View style={[styles.mobileHeader, { backgroundColor: primaryColor, paddingTop: Math.max(insets.top, 12) + 12 }]}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoGlow, { shadowColor: primaryColor }]}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
              {profile ? (
                <Image
                  source={{
                    uri: profile.avatar_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=100',
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hello Spiritual Seeker</Text>
          <Text style={[styles.quote, { color: primaryColor }]}>"{quotes[currentQuote]}"</Text>
        </View>

        <TouchableOpacity
          style={styles.patientGodCard}
          onPress={() => router.push('/patient-god')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#10b981', '#059669', '#047857']}
            style={styles.patientGodGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.patientGodContent}>
              <View style={styles.patientGodIconContainer}>
                <Stethoscope size={32} color="#ffffff" />
              </View>
              <View style={styles.patientGodTextContainer}>
                <Text style={styles.patientGodTitle}>Patient God Program</Text>
                <Text style={styles.patientGodDescription}>
                  Experience divine healing through personalized spiritual consultation
                </Text>
              </View>
              <ArrowRight size={24} color="#ffffff" style={styles.patientGodArrow} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuCard, { width: cardWidth }]}
                onPress={() => handleMenuPress(item.route)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <item.icon size={24} color="#ffffff" />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Example books list */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Latest Books</Text>
          {loadingBooks ? (
            <Text>Loading books...</Text>
          ) : (
            books.slice(0, 4).map((b) => (
              <View key={b.id} style={{ paddingVertical: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: '600' }}>{b.title}</Text>
                <Text style={{ color: '#6b7280', marginTop: 4 }}>{b.description || ''}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <DonatePopup
        visible={showDonatePopup}
        onClose={() => setShowDonatePopup(false)}
        onDonate={() => {
          setShowDonatePopup(false);
          router.push('/(tabs)/donate-tab');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  mobileHeader: {
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoContainer: { justifyContent: 'center', alignItems: 'center' },
  logo: { width: 120, height: 40 },
  logoGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 12,
    borderRadius: 12,
    padding: 4,
    backgroundColor: 'transparent',
  },
  profileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  profileImage: { width: 32, height: 32, borderRadius: 16 },
  loginText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },

  content: { flex: 1 },
  webHeader: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  pageSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center' },

  welcomeSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  quote: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },

  patientGodCard: { marginHorizontal: 20, marginTop: 24, borderRadius: 20, overflow: 'hidden', shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  patientGodGradient: { padding: 20 },
  patientGodContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  patientGodIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  patientGodTextContainer: { flex: 1, gap: 4 },
  patientGodTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  patientGodDescription: { fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 18 },
  patientGodArrow: { opacity: 0.9 },

  menuContainer: { marginTop: 32, paddingHorizontal: 20, marginBottom: 100 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },

  menuCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, minHeight: 120 },
  iconContainer: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  menuTitle: { fontSize: 14, fontWeight: '600', color: '#374151', textAlign: 'center' },
});
