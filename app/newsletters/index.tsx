import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Download, Eye } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { useState, useEffect } from 'react';

type Newsletter = Database['public']['Tables']['newsletters']['Row'];


export default function NewslettersScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
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
          <Text style={styles.headerTitle}>Newsletters</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Newsletters</Text>
            <Text style={styles.pageSubtitle}>Stay updated with our latest insights</Text>
          </View>
        )}

        <View style={styles.newslettersList}>
          {newsletters.map((newsletter) => (
            <View key={newsletter.id} style={styles.newsletterCard}>
              <Image source={{ uri: newsletter.thumbnail_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300' }} style={styles.newsletterThumbnail} />
              <View style={styles.newsletterInfo}>
                <Text style={styles.newsletterTitle}>{newsletter.title}</Text>
                <View style={styles.dateContainer}>
                  <Calendar size={14} color="#6b7280" />
                  <Text style={styles.newsletterDate}>{newsletter.published_date}</Text>
                </View>
                <Text style={styles.newsletterDescription}>{newsletter.description}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.readButton}>
                    <Eye size={16} color="#ffffff" />
                    <Text style={styles.buttonText}>Read</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Download size={16} color="#22c55e" />
                    <Text style={styles.downloadButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
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
  newslettersList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  newsletterCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newsletterThumbnail: {
    width: '100%',
    height: 160,
  },
  newsletterInfo: {
    padding: 16,
  },
  newsletterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsletterDate: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  newsletterDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  readButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  downloadButtonText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
});