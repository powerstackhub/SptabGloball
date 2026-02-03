import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Heart, Stethoscope, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

const benefits = [
  'Personalized spiritual guidance and healing',
  'One-on-one consultation with experienced spiritual doctors',
  'Holistic approach to physical and spiritual wellness',
  'Regular follow-up sessions for continuous support',
  'Access to exclusive spiritual healing practices',
  'Community support from fellow seekers',
];

export default function PatientGodScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={[styles.mobileHeader, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient God</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Patient God Program</Text>
            <Text style={styles.pageSubtitle}>Spiritual healing and wellness consultation</Text>
          </View>
        )}

        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Stethoscope size={48} color="#ffffff" />
          </View>
          <Text style={styles.heroTitle}>Patient God</Text>
          <Text style={styles.heroDescription}>
            Experience divine healing through our specialized spiritual consultation program. 
            Connect with experienced spiritual doctors who combine ancient wisdom with modern 
            healing practices to guide you on your wellness journey.
          </Text>
        </View>

        {/* Register Button at Top - Prominent Orange Design */}
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => router.push('/patient-god/register')}
          activeOpacity={0.8}
        >
          <View style={styles.registerButtonContent}>
            <View style={styles.registerButtonIcon}>
              <Heart size={24} color="#ffffff" />
            </View>
            <View style={styles.registerButtonTextContainer}>
              <Text style={styles.registerButtonText}>Register Now</Text>
              <Text style={styles.registerButtonSubtext}>Start Your Spiritual Healing Journey</Text>
            </View>
            <View style={styles.registerButtonArrow}>
              <Text style={styles.registerButtonArrowText}>→</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Program Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Program Benefits</Text>
          <View style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works Section */}
        <View style={styles.processSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.processSteps}>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepTitle}>Register</Text>
              <Text style={styles.stepDescription}>Fill out the registration form with your details</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepTitle}>Assignment</Text>
              <Text style={styles.stepDescription}>Get assigned to a spiritual doctor in your area</Text>
            </View>
            <View style={styles.processStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepTitle}>Consultation</Text>
              <Text style={styles.stepDescription}>Begin your spiritual healing journey</Text>
            </View>
          </View>
        </View>

        {/* About Patient God Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Patient God</Text>
          <Text style={styles.infoText}>
            The Patient God program is designed to provide comprehensive spiritual healing 
            and wellness consultation. Our experienced spiritual doctors work with you to 
            address both physical and spiritual concerns, offering a holistic approach to 
            health and well-being.
          </Text>
          <Text style={styles.infoText}>
            Through personalized consultations, meditation guidance, and spiritual practices, 
            we help you achieve balance and harmony in all aspects of your life.
          </Text>
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
    backgroundColor: '#ffffff',
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  placeholder: {
    width: 40,
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
  content: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: '#10b981',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  benefitsSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  benefitsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  processSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  processSteps: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  processStep: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  registerButton: {
    backgroundColor: '#f97316',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginTop: 24,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#ea580c',
  },
  registerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  registerButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  registerButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  registerButtonArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonArrowText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
});