import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Video = Database['public']['Tables']['videos']['Row'];


export default function VideosScreen() {
  const router = useRouter();
  const isWeb = Platform.OS === 'web';
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedLanguage === 'all') {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(video => video.language === selectedLanguage));
    }
  }, [videos, selectedLanguage]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchVideo = (videoId: string) => {
    router.push(`/videos/watch?id=${videoId}`);
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {!isWeb && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Videos</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Spiritual Videos</Text>
            <Text style={styles.pageSubtitle}>Watch guided sessions and teachings</Text>
          </View>
        )}

        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter by Language</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageFilter}>
            <TouchableOpacity
              style={[styles.filterChip, selectedLanguage === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedLanguage('all')}
            >
              <Text style={[styles.filterText, selectedLanguage === 'all' && styles.filterTextActive]}>
                All Languages
              </Text>
            </TouchableOpacity>
            {['english', 'tamil', 'hindi', 'telugu', 'kannada', 'malayalam', 'vietnamese'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.filterChip, selectedLanguage === lang && styles.filterChipActive]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text style={[styles.filterText, selectedLanguage === lang && styles.filterTextActive]}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.videosGrid}>
          {filteredVideos.map((video) => (
            <View key={video.id} style={styles.videoCard}>
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: video.thumbnail_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400' }} style={styles.videoThumbnail} />
                <TouchableOpacity
                  style={styles.playOverlay}
                  onPress={() => handleWatchVideo(video.id)}
                >
                  <Play size={32} color="#ffffff" />
                </TouchableOpacity>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoLanguage}>{video.language || 'english'}</Text>
                <Text style={styles.videoDescription}>{video.description}</Text>
                <TouchableOpacity
                  style={styles.watchButton}
                  onPress={() => handleWatchVideo(video.id)}
                >
                  <ExternalLink size={16} color="#ffffff" />
                  <Text style={styles.watchButtonText}>Watch Video</Text>
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  languageFilter: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  videosGrid: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  videoCard: {
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
  thumbnailContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  videoLanguage: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  watchButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  watchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});