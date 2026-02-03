import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ExternalLink, Building } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

const associations = [
  {
    id: 'pssm',
    name: 'PSSM Academy',
    description: 'Promoting spiritual and social movement through education and awareness',
    websites: [
      { label: 'PSSM Movement', url: 'https://www.pssmovement.org/' },
      { label: 'PSSM Academy', url: 'http://www.pssacademy.org/' },
    ],
  },
  {
    id: 'buddha-ceo',
    name: 'Corporate Meditation: Buddha CEO',
    description: 'Bringing mindfulness and meditation practices to corporate environments',
    websites: [
      { label: 'Buddha CEO', url: 'https://www.buddhaceo.org/' },
    ],
  },
  {
    id: 'sudarshani',
    name: 'Sudarshani Academy',
    description: 'Educational institution focused on holistic learning and spiritual development',
    websites: [
      { label: 'Sudarshani Academy', url: 'https://www.sudarshiniacademy.com/' },
    ],
  },
  {
    id: 'anandho',
    name: 'Anandho Brahma',
    description: 'Exploring the science of enjoyment and spiritual bliss',
    websites: [
      { label: 'Enjoyment Science', url: 'https://www.enjoymentscience.com/' },
    ],
  },
  {
    id: 'pyda',
    name: 'Pyramid Yoga & Dance Academy',
    description: 'Combining ancient pyramid energy with yoga and dance practices',
    websites: [
      { label: 'PYDA Info', url: 'http://www.pyda.info' },
    ],
  },
];

export default function AssociationScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();

  const handleWebsitePress = async (url: string) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Association</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Our Associations</Text>
            <Text style={styles.pageSubtitle}>
              Collaborative partnerships that enhance our spiritual mission
            </Text>
          </View>
        )}

        <View style={styles.introSection}>
          <Text style={styles.introText}>
            In delivering our services, we collaborate with the below organizations to provide 
            comprehensive spiritual guidance and educational resources.
          </Text>
        </View>

        <View style={styles.associationsList}>
          {associations.map((association) => (
            <View key={association.id} style={styles.associationCard}>
              <View style={styles.associationHeader}>
                <Building size={24} color="#22c55e" />
                <Text style={styles.associationName}>{association.name}</Text>
              </View>
              
              <Text style={styles.associationDescription}>{association.description}</Text>
              
              <View style={styles.websitesContainer}>
                {association.websites.map((website, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.websiteButton}
                    onPress={() => handleWebsitePress(website.url)}
                  >
                    <ExternalLink size={16} color="#22c55e" />
                    <Text style={styles.websiteButtonText}>{website.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            These partnerships allow us to offer a wider range of services and resources, 
            ensuring that our community has access to the best spiritual guidance and 
            educational opportunities available.
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
  introSection: {
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
  introText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  associationsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  associationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  associationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  associationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 12,
  },
  associationDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  websitesContainer: {
    gap: 8,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  websiteButtonText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footerSection: {
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
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    textAlign: 'center',
  },
});