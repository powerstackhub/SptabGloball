import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { isMobileDevice } from '../../utils/deviceDetection';

interface PyramidCenter {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  hours: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function PyramidCentersScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [centers, setCenters] = useState<PyramidCenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('pyramid_centers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCenters(data || []);
    } catch (error) {
      console.error('Failed to fetch pyramid centers:', error);
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
          <Text style={styles.headerTitle}>Pyramid Centers</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Pyramid Centers</Text>
            <Text style={styles.pageSubtitle}>
              Experience enhanced meditation in our specialized pyramid structures
            </Text>
          </View>
        )}

        <View style={styles.centersList}>
          {centers.map((center) => (
            <View key={center.id} style={styles.centerCard}>
              <Text style={styles.centerName}>{center.name}</Text>
              
              {center.description && (
                <Text style={styles.centerDescription}>{center.description}</Text>
              )}
              
              <View style={styles.centerDetail}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.centerDetailText}>{center.address}</Text>
              </View>
              
              {center.phone && (
                <View style={styles.centerDetail}>
                  <Phone size={16} color="#6b7280" />
                  <Text style={styles.centerDetailText}>{center.phone}</Text>
                </View>
              )}
              
              {center.email && (
                <View style={styles.centerDetail}>
                  <Mail size={16} color="#6b7280" />
                  <Text style={styles.centerDetailText}>{center.email}</Text>
                </View>
              )}
              
              <View style={styles.centerDetail}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.centerDetailText}>{center.hours}</Text>
              </View>
              
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact Center</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          {centers.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <MapPin size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No pyramid centers available</Text>
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
    marginBottom: 8,
  },
  centerDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
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
    backgroundColor: '#8b5cf6',
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