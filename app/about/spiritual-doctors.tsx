import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star, Clock, MessageCircle } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { isMobileDevice } from '../../utils/deviceDetection';

interface SpiritualDoctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  image_url: string | null;
  available: boolean;
  email: string;
  phone: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export default function SpiritualDoctorsScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [doctors, setDoctors] = useState<SpiritualDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('spiritual_doctors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Failed to fetch spiritual doctors:', error);
    } finally {
      setLoading(false);
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
          <Text style={styles.headerTitle}>Spiritual Doctors</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Spiritual Doctors</Text>
            <Text style={styles.pageSubtitle}>
              Connect with specialized spiritual healers and wellness practitioners
            </Text>
          </View>
        )}

        <View style={styles.doctorsList}>
          {doctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <Image 
                source={{ 
                  uri: doctor.image_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=200' 
                }} 
                style={styles.doctorImage} 
              />
              <View style={styles.doctorInfo}>
                <View style={styles.doctorHeader}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <View style={styles.availabilityBadge}>
                    <View style={[
                      styles.statusDot,
                      { backgroundColor: doctor.available ? '#22c55e' : '#ef4444' }
                    ]} />
                    <Text style={styles.statusText}>
                      {doctor.available ? 'Available' : 'Busy'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.specialization}>{doctor.specialization}</Text>
                <Text style={styles.doctorLanguage}>Language: {doctor.language || 'english'}</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Star size={14} color="#f59e0b" />
                    <Text style={styles.statText}>{doctor.rating}/5</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Clock size={14} color="#6b7280" />
                    <Text style={styles.statText}>{doctor.experience}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.consultButton,
                    !doctor.available && styles.consultButtonDisabled
                  ]}
                  disabled={!doctor.available}
                >
                  <MessageCircle size={16} color="#ffffff" />
                  <Text style={styles.consultButtonText}>
                    {doctor.available ? 'Book Consultation' : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {doctors.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <MessageCircle size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No spiritual doctors available</Text>
            </View>
          )}
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
  doctorsList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  doctorCard: {
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
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  doctorName: {
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
  doctorLanguage: {
    fontSize: 12,
    color: '#3b82f6',
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
  consultButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  consultButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  consultButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
});