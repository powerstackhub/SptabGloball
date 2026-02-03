import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle, Clock, Star, Phone } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { useState, useEffect } from 'react';

type Counselor = Database['public']['Tables']['counselors']['Row'];


export default function CounsellingScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const { data, error } = await supabase
        .from('counselors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCounselors(data || []);
    } catch (error) {
      console.error('Failed to fetch counselors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {!isWeb && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Counselling</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Spiritual Counselling</Text>
            <Text style={styles.pageSubtitle}>Connect with experienced spiritual guides</Text>
          </View>
        )}

        <View style={styles.counselorsList}>
          {counselors.map((counselor) => (
            <View key={counselor.id} style={styles.counselorCard}>
              <Image source={{ uri: counselor.image_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=200' }} style={styles.counselorImage} />
              <View style={styles.counselorInfo}>
                <View style={styles.counselorHeader}>
                  <Text style={styles.counselorName}>{counselor.name}</Text>
                  <View style={styles.availabilityBadge}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: counselor.available ? '#22c55e' : '#ef4444' }
                    ]} />
                    <Text style={styles.statusText}>
                      {counselor.available ? 'Available' : 'Busy'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.specialization}>{counselor.specialization}</Text>
                <Text style={styles.counselorLanguage}>Language: {counselor.language || 'english'}</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Star size={14} color="#f59e0b" />
                    <Text style={styles.statText}>{counselor.rating}/5</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Clock size={14} color="#6b7280" />
                    <Text style={styles.statText}>{counselor.experience}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.bookButton,
                    !counselor.available && styles.bookButtonDisabled
                  ]}
                  disabled={!counselor.available}
                >
                  <MessageCircle size={16} color="#ffffff" />
                  <Text style={styles.bookButtonText}>
                    {counselor.available ? 'Book Session' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  },
  content: {
    flex: 1,
  },
  counselorsList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  counselorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  counselorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  counselorInfo: {
    flex: 1,
  },
  counselorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  counselorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  specialization: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  counselorLanguage: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  bookButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});