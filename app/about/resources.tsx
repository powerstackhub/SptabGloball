import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Headphones, Video, BookOpen, ChevronRight } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

const resourceCards = [
  {
    id: 'audios',
    title: 'Audios',
    description: 'Listen to guided meditations, spiritual teachings, and calming music',
    icon: Headphones,
    color: '#8b5cf6',
    route: '/audios',
  },
  {
    id: 'videos',
    title: 'Videos',
    description: 'Watch spiritual sessions, teachings, and guided practices',
    icon: Video,
    color: '#ef4444',
    route: '/videos',
  },
  {
    id: 'books',
    title: 'Books',
    description: 'Read spiritual texts, guides, and wisdom literature',
    icon: BookOpen,
    color: '#3b82f6',
    route: '/books',
  },
];

export default function ResourcesScreen() {
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
          <Text style={styles.headerTitle}>Resources</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Spiritual Resources</Text>
            <Text style={styles.pageSubtitle}>
              Access our comprehensive collection of spiritual content
            </Text>
          </View>
        )}

        <View style={styles.resourcesContainer}>
          {resourceCards.map((resource) => {
            const Icon = resource.icon;
            return (
              <TouchableOpacity
                key={resource.id}
                style={styles.resourceCard}
                onPress={() => router.push(resource.route as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: resource.color }]}>
                  <Icon size={32} color="#ffffff" />
                </View>
                
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <Text style={styles.resourceDescription}>{resource.description}</Text>
                </View>
                
                <ChevronRight size={20} color="#6b7280" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Our Resources</Text>
          <Text style={styles.infoText}>
            Our spiritual resources are carefully curated to support your journey of 
            self-discovery and inner growth. Whether you prefer listening to guided 
            meditations, watching instructional videos, or reading profound spiritual 
            texts, we have something for every learning style.
          </Text>
          <Text style={styles.infoText}>
            All our content is created by experienced spiritual teachers and practitioners, 
            ensuring authenticity and depth in every piece. We regularly update our 
            collection to provide fresh insights and perspectives on spiritual practice.
          </Text>
          <Text style={styles.infoText}>
            These resources are available in multiple languages to serve our diverse 
            global community, making spiritual wisdom accessible to seekers from all 
            cultural backgrounds.
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
  resourcesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resourceCard: {
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
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  resourceDescription: {
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