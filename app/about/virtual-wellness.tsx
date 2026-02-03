import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, ExternalLink, Phone, Mail } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { isMobileDevice } from '../../utils/deviceDetection';

interface VirtualWellnessCenter {
  id: string;
  name: string;
  description: string | null;
  services: string | null;
  contact_info: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function VirtualWellnessScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [centers, setCenters] = useState<VirtualWellnessCenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('virtual_wellness_centers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCenters(data || []);
    } catch (error) {
      console.error('Failed to fetch virtual wellness centers:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.headerTitle}>Virtual Wellness</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Virtual Wellness Centers</Text>
            <Text style={styles.pageSubtitle}>
              Access spiritual guidance and wellness programs from anywhere
            </Text>
          </View>
        )}

        <View style={styles.centersList}>
          {centers.map((center) => (
            <View key={center.id} style={styles.centerCard}>
              <View style={styles.centerHeader}>
                <Globe size={24} color="#22c55e" />
                <Text style={styles.centerName}>{center.name}</Text>
              </View>
              
              {center.description && (
                <Text style={styles.centerDescription}>{center.description}</Text>
              )}
              
              {center.services && (
                <View style={styles.servicesSection}>
                  <Text style={styles.servicesTitle}>Services Offered:</Text>
                  <Text style={styles.servicesText}>{center.services}</Text>
                </View>
              )}
              
              {center.contact_info && (
                <View style={styles.contactSection}>
                  <Text style={styles.contactTitle}>Contact Information:</Text>
                  <Text style={styles.contactText}>{center.contact_info}</Text>
                </View>
              )}
              
              {center.website_url && (
                <TouchableOpacity 
                  style={styles.websiteButton}
                  onPress={() => handleWebsitePress(center.website_url!)}
                >
                  <ExternalLink size={16} color="#ffffff" />
                  <Text style={styles.websiteButtonText}>Visit Website</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          {centers.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Globe size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No virtual wellness centers available</Text>
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
  centerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  centerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 12,
  },
  centerDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  servicesSection: {
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  servicesText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  contactSection: {
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  websiteButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  websiteButtonText: {
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