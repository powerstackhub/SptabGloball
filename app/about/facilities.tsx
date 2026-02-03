import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Building, Globe, ChevronRight } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

const facilityCards = [
  {
    id: 'admission',
    title: 'Admission Centers',
    description: 'Physical locations where you can visit and get admission to our programs',
    icon: MapPin,
    color: '#3b82f6',
    route: '/admission',
  },
  {
    id: 'pyramid',
    title: 'Pyramid Centers',
    description: 'Specialized pyramid meditation centers for enhanced spiritual practice',
    icon: Building,
    color: '#8b5cf6',
    route: '/about/pyramid-centers',
  },
  {
    id: 'virtual',
    title: 'Virtual Wellness Centers',
    description: 'Online wellness programs and virtual spiritual guidance sessions',
    icon: Globe,
    color: '#22c55e',
    route: '/about/virtual-wellness',
  },
];

export default function FacilitiesScreen() {
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
          <Text style={styles.headerTitle}>Facilities</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Our Facilities</Text>
            <Text style={styles.pageSubtitle}>
              Discover our various centers and services designed for your spiritual journey
            </Text>
          </View>
        )}

        <View style={styles.facilitiesContainer}>
          {facilityCards.map((facility) => {
            const Icon = facility.icon;
            return (
              <TouchableOpacity
                key={facility.id}
                style={styles.facilityCard}
                onPress={() => router.push(facility.route as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: facility.color }]}>
                  <Icon size={32} color="#ffffff" />
                </View>
                
                <View style={styles.facilityInfo}>
                  <Text style={styles.facilityTitle}>{facility.title}</Text>
                  <Text style={styles.facilityDescription}>{facility.description}</Text>
                </View>
                
                <ChevronRight size={20} color="#6b7280" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Our Facilities</Text>
          <Text style={styles.infoText}>
            Our comprehensive network of facilities is designed to support your spiritual growth 
            and wellness journey. From physical centers where you can experience guided meditation 
            and spiritual practices, to virtual platforms that bring our teachings to your home, 
            we ensure accessibility and convenience for all seekers.
          </Text>
          <Text style={styles.infoText}>
            Each facility is staffed with experienced spiritual guides and equipped with modern 
            amenities to create the perfect environment for inner transformation and peace.
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
  facilitiesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  facilityCard: {
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
  facilityInfo: {
    flex: 1,
  },
  facilityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  facilityDescription: {
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