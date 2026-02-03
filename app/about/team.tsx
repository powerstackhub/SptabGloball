import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Stethoscope, ChevronRight } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

const teamCards = [
  {
    id: 'counsellors',
    title: 'Counsellors',
    description: 'Experienced spiritual counsellors providing guidance and support',
    icon: Users,
    color: '#22c55e',
    route: '/counselling',
  },
  {
    id: 'spiritual-doctors',
    title: 'Spiritual Doctors',
    description: 'Specialized spiritual healers and wellness practitioners',
    icon: Stethoscope,
    color: '#3b82f6',
    route: '/about/spiritual-doctors',
  },
];

export default function TeamScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Team</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Our Team</Text>
            <Text style={styles.pageSubtitle}>
              Meet our dedicated professionals committed to your spiritual wellness
            </Text>
          </View>
        )}

        <View style={styles.teamContainer}>
          {teamCards.map((team) => {
            const Icon = team.icon;
            return (
              <TouchableOpacity
                key={team.id}
                style={styles.teamCard}
                onPress={() => router.push(team.route as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: team.color }]}>
                  <Icon size={32} color="#ffffff" />
                </View>
                
                <View style={styles.teamInfo}>
                  <Text style={styles.teamTitle}>{team.title}</Text>
                  <Text style={styles.teamDescription}>{team.description}</Text>
                </View>
                
                <ChevronRight size={20} color="#6b7280" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Our Team</Text>
          <Text style={styles.infoText}>
            Our team consists of highly qualified and experienced professionals who are 
            passionate about spiritual wellness and personal growth. Each member brings 
            unique expertise and a deep commitment to helping individuals on their 
            spiritual journey.
          </Text>
          <Text style={styles.infoText}>
            From certified counsellors who provide emotional and spiritual guidance, 
            to specialized spiritual doctors who focus on holistic healing approaches, 
            our team is here to support you every step of the way.
          </Text>
          <Text style={styles.infoText}>
            We believe in a personalized approach to spiritual wellness, ensuring that 
            each individual receives the care and attention they deserve in their quest 
            for inner peace and enlightenment.
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
  teamContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  teamCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  teamInfo: {
    flex: 1,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  teamDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 12,
  },
});