import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ZoomIn } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { useState, useEffect } from 'react';

type GalleryItem = Database['public']['Tables']['gallery']['Row'];

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const getImageWidth = () => {
  if (isWeb) {
    if (width > 1200) return (width - 200) / 4;
    if (width > 768) return (width - 120) / 3;
    return (width - 80) / 2;
  }
  return (width - 60) / 2;
};


export default function GalleryScreen() {
  const router = useRouter();
  const imageWidth = getImageWidth();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGallery(data || []);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
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
          <Text style={styles.headerTitle}>Gallery</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Photo Gallery</Text>
            <Text style={styles.pageSubtitle}>Moments from our spiritual community</Text>
          </View>
        )}

        <View style={styles.galleryGrid}>
          {gallery.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.galleryItem, { width: imageWidth }]}
            >
              <Image source={{ uri: item.image_url }} style={styles.galleryImage} />
              <View style={styles.imageOverlay}>
                <ZoomIn size={20} color="#ffffff" />
              </View>
              <Text style={styles.imageTitle}>{item.title}</Text>
            </TouchableOpacity>
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
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  galleryItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  galleryImage: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    padding: 8,
    textAlign: 'center',
  },
});