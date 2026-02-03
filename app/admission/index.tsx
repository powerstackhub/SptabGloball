import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { useState, useEffect } from 'react';

type AdmissionCenter = Database['public']['Tables']['admission_centers']['Row'];


export default function AdmissionScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const [admissionCenters, setAdmissionCenters] = useState<AdmissionCenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmissionCenters();
  }, []);

  const fetchAdmissionCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('admission_centers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmissionCenters(data || []);
    } catch (error) {
      console.error('Failed to fetch admission centers:', error);
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
          <Text style={styles.headerTitle}>Admission Centers</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Admission Centers</Text>
            <Text style={styles.pageSubtitle}>Find a center near you</Text>
          </View>
        )}

        <View style={styles.centersList}>
          {admissionCenters.map((center) => (
            <View key={center.id} style={styles.centerCard}>
              <Text style={styles.centerName}>{center.name}</Text>
              
              <View style={styles.centerDetail}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.centerDetailText}>{center.address}</Text>
              </View>
              
              <View style={styles.centerDetail}>
                <Phone size={16} color="#6b7280" />
                <Text style={styles.centerDetailText}>{center.phone}</Text>
              </View>
              
              <View style={styles.centerDetail}>
                <Mail size={16} color="#6b7280" />
                <Text style={styles.centerDetailText}>{center.email}</Text>
              </View>
              
              <View style={styles.centerDetail}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.centerDetailText}>{center.hours}</Text>
              </View>
              
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Center</Text>
              </TouchableOpacity>
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
  centersList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  centerCard: {
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
  centerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  centerDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  centerDetailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});