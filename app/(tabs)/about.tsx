import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building,
  Wrench,
  Users,
  Link as LinkIcon,
  BookOpen,
  ChevronRight,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';

const aboutSections = [
  { id: 'trusts', title: 'Trusts', icon: Building, route: '/about/trusts' },
  { id: 'facilities', title: 'Facilities', icon: Wrench, route: '/about/facilities' },
  { id: 'team', title: 'Team', icon: Users, route: '/about/team' },
  { id: 'association', title: 'Association', icon: LinkIcon, route: '/about/association' },
  { id: 'resources', title: 'Resources', icon: BookOpen, route: '/about/resources' },
];

const socialLinks = [
  { id: 'website', icon: Globe, color: '#22c55e', url: 'https://spiritualtablets.com/' },
  { id: 'facebook', icon: Facebook, color: '#1877f2', url: 'https://facebook.com/spiritualtablets' },
  { id: 'twitter', icon: Twitter, color: '#1da1f2', url: 'https://twitter.com/spiritualtablets' },
  { id: 'instagram', icon: Instagram, color: '#e4405f', url: 'https://instagram.com/spiritualtablets' },
  { id: 'youtube', icon: Youtube, color: '#ff0000', url: 'https://youtube.com/spiritualtablets' },
];

export default function AboutScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  //const isMobile = isMobileDevice();
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';



  const handleSocialPress = async (url: string) => {
    try {
      if (isWeb && typeof window !== 'undefined') {
        window.open(url, '_blank');
        return;
      }

      // Native (iOS/Android)
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // fallback: try open anyway
        await Linking.openURL(url);
      }
    } catch (err) {
      console.error('Failed to open URL:', url, err);
    }
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <Text style={styles.headerTitle}>About Us</Text>
          <Text style={styles.headerSubtitle}>Learn more about our mission</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>About Spiritual Tablets</Text>
            <Text style={styles.pageSubtitle}>Learn more about our mission and values</Text>
          </View>
        )}

        {/* Hero: logo first, then description badge (prevents overlap on small screens) */}
        <View style={styles.heroSection}>
          <View style={styles.heroImageWrapper}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Spiritual Tablets</Text>
            <Text style={styles.heroDescription}>
              Dedicated to spreading spiritual wisdom and fostering inner peace through 
              meditation, teachings, and community support.
            </Text>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionTitle}>Explore</Text>
          {aboutSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionCard}
              onPress={() => router.push(section.route as any)}
            >
              <View style={styles.sectionIcon}>
                <section.icon size={24} color="#22c55e" />
              </View>
              <Text style={styles.sectionText}>{section.title}</Text>
              <ChevronRight size={20} color="#6b7280" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialGrid}>
            {socialLinks.map((social) => (
              <TouchableOpacity 
                key={social.id} 
                style={styles.socialButton}
                onPress={() => handleSocialPress(social.url)}
              >
                <social.icon size={24} color={social.color} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactText}>
              Visit our website: spiritualtablets.com
            </Text>
            <Text style={styles.contactText}>
              Join our community for spiritual growth and enlightenment.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  mobileHeader: {
    backgroundColor: '#22c55e',
    paddingTop: Platform.OS === 'web' ? 16 : 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  webHeader: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },

  /* Hero styles (logo above badge) */
  heroSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  heroImageWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: Platform.OS === 'web' ? 180 : 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  heroImage: {
    width: '60%',
    height: '80%',
    alignSelf: 'center',
  },
  heroOverlay: {
    backgroundColor: 'rgba(34, 197, 94, 0.95)',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 18,
  },

  sectionsContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  socialSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  socialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
});
