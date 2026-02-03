import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Book, Headphones, Video, Calendar, Mail, Camera, Users, MapPin, Building, UserCheck, BookOpen } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

const adminSections = [
  { id: 'books', title: 'Books', icon: Book, color: '#3b82f6', route: '/admin/books' },
  { id: 'audios', title: 'Audios', icon: Headphones, color: '#8b5cf6', route: '/admin/audios' },
  { id: 'videos', title: 'Videos', icon: Video, color: '#ef4444', route: '/admin/videos' },
  { id: 'events', title: 'Events', icon: Calendar, color: '#f59e0b', route: '/admin/events' },
  { id: 'newsletters', title: 'Newsletters', icon: Mail, color: '#06b6d4', route: '/admin/newsletters' },
  { id: 'gallery', title: 'Gallery', icon: Camera, color: '#ec4899', route: '/admin/gallery' },
  { id: 'counselors', title: 'Counselors', icon: Users, color: '#22c55e', route: '/admin/counselors' },
  { id: 'patient-god', title: 'Patient God', icon: Users, color: '#10b981', route: '/admin/patient-god' },
  { id: 'courses', title: 'Courses', icon: BookOpen, color: '#a855f7', route: '/admin/courses' },
  { id: 'admission', title: 'Admission Centers', icon: MapPin, color: '#6366f1', route: '/admin/admission-centers' },
  { id: 'users', title: 'Manage Users', icon: UserCheck, color: '#8b5cf6', route: '/admin/users' },
  { id: 'payments', title: 'Payment Analytics', icon: Building, color: '#f43f5e', route: '/admin/payments' },
  { id: 'configuration', title: 'App Configuration', icon: Building, color: '#8b5cf6', route: '/admin/configuration' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const isMobile = isMobileDevice();
  const [stats, setStats] = useState({
    books: 0,
    audios: 0,
    videos: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksResult, audiosResult, videosResult, eventsResult] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('audios').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        books: booksResult.count || 0,
        audios: audiosResult.count || 0,
        videos: videosResult.count || 0,
        events: eventsResult.count || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not admin
  if (!profile || profile.role !== 'admin') {
    router.replace('/(tabs)');
    return null;
  }

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Admin Dashboard</Text>
            <Text style={styles.pageSubtitle}>Manage your content and settings</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.books}</Text>
            <Text style={styles.statLabel}>Books</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.audios}</Text>
            <Text style={styles.statLabel}>Audios</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.videos}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.events}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
        </View>

        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionTitle}>Content Management</Text>
          <View style={styles.sectionsGrid}>
            {adminSections.map((section) => (
              <TouchableOpacity
                key={section.id}
                style={styles.sectionCard}
                onPress={() => router.push(section.route as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: section.color }]}>
                  <section.icon size={24} color="#ffffff" />
                </View>
                <Text style={styles.sectionText}>{section.title}</Text>
              </TouchableOpacity>
            ))}
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
    backgroundColor: '#6366f1',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
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
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionsContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 120,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});