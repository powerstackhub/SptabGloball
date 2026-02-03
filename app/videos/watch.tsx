import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, Pause, Volume2, Maximize, Heart } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import YouTubePlayer from '../../components/YouTubePlayer';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { useEffect } from 'react';

type Video = Database['public']['Tables']['videos']['Row'];

const { width, height } = Dimensions.get('window');

export default function VideoWatchScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isWeb = Platform.OS === 'web';
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVideo();
    }
  }, [id]);

  const fetchVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setVideo(data);
    } catch (error) {
      console.error('Failed to fetch video:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <WebHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      </View>
    );
  }

  if (!video) {
    return (
      <View style={styles.container}>
        <WebHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Video not found</Text>
        </View>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <WebHeader />
      
      {!isWeb && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video Player</Text>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => setIsLiked(!isLiked)}
          >
            <Heart size={20} color={isLiked ? "#f43f5e" : "#ffffff"} fill={isLiked ? "#f43f5e" : "none"} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.videoContainer}>
        <YouTubePlayer videoId={video.youtube_url} style={styles.videoPlayer} />

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.videoMeta}>{video.duration} • Spiritual Tablets</Text>
          <Text style={styles.videoDescription}>{video.description}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  mobileHeader: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
  },
  videoPlayer: {
    width: '100%',
    height: width * 9 / 16, // 16:9 aspect ratio
  },
  videoInfo: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  videoMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  videoDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});