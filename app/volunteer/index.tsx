import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Clock, MapPin, Heart } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';

const volunteerBenefits = [
  'Contribute to spreading spiritual wisdom and inner peace',
  'Develop leadership and organizational skills',
  'Connect with like-minded spiritual seekers',
  'Gain experience in community service and social work',
  'Participate in exclusive volunteer training programs',
  'Make a meaningful impact in people\'s spiritual journey',
];

export default function VolunteerScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {!isWeb && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Volunteer</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Volunteer Opportunities</Text>
            <Text style={styles.pageSubtitle}>Join our mission to spread spiritual wisdom</Text>
          </View>
        )}

        <View style={styles.volunteerContent}>
          <TouchableOpacity 
            style={styles.registerCard}
            onPress={() => router.push('/volunteer/register')}
          >
            <View style={styles.registerIcon}>
              <Heart size={24} color="#ffffff" />
            </View>
            <View style={styles.registerInfo}>
              <Text style={styles.registerTitle}>Register as Volunteer</Text>
              <Text style={styles.registerDescription}>
                Join our mission and make a difference in the community
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.guidanceSection}>
            <Text style={styles.guidanceTitle}>Why Volunteer with Us?</Text>
            <Text style={styles.guidanceDescription}>
              Volunteering in spiritual service is one of the most fulfilling ways to contribute 
              to society while growing personally. When you serve others on their spiritual journey, 
              you also deepen your own understanding and connection to higher consciousness.
            </Text>
            
            <View style={styles.benefitsList}>
              {volunteerBenefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.quoteSection}>
              <Text style={styles.quote}>
                "The best way to find yourself is to lose yourself in the service of others."
              </Text>
              <Text style={styles.quoteAuthor}>- Mahatma Gandhi</Text>
            </View>
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
    backgroundColor: '#ffffff',
    paddingTop: 50,
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
  registerCard: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  registerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  registerInfo: {
    flex: 1,
  },
  registerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  registerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  volunteerContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  guidanceSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  guidanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  guidanceDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitsList: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  quoteSection: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
    marginBottom: 16,
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#22c55e',
    lineHeight: 20,
    marginBottom: 4,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    textAlign: 'right',
  },
});