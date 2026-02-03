import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import YouTubePlayer from '../../components/YouTubePlayer';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { useEffect } from 'react';

type Audio = Database['public']['Tables']['audios']['Row'];

const { width, height } = Dimensions.get('window');

export default function AudioPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isWeb = Platform.OS === 'web';
  const [audio, setAudio] = useState<Audio | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAudio();
    }
  }, [id]);

  const fetchAudio = async () => {
    try {
      const { data, error } = await supabase
        .from('audios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setAudio(data);
    } catch (error) {
      console.error('Failed to fetch audio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <WebHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading audio...</Text>
        </View>
      </View>
    );
  }

  if (!audio) {
    return (
      <View style={styles.container}>
        <WebHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Audio not found</Text>
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
          <Text style={styles.headerTitle}>Audio Player</Text>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => setIsLiked(!isLiked)}
          >
            <Heart size={20} color={isLiked ? "#f43f5e" : "#ffffff"} fill={isLiked ? "#f43f5e" : "none"} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.audioContainer}>
        <YouTubePlayer videoId={audio.youtube_url || audio.url || ''} style={styles.audioPlayer} />

        <View style={styles.audioInfo}>
          <Text style={styles.audioTitle}>{audio.title}</Text>
          <Text style={styles.audioMeta}>{audio.duration || 'N/A'} • Spiritual Tablets</Text>
          <Text style={styles.audioDescription}>{audio.description}</Text>
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
  audioContainer: {
    flex: 1,
  },
  audioPlayer: {
    width: '100%',
    height: width * 9 / 16, // 16:9 aspect ratio
  },
  audioInfo: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  audioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  audioMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  audioDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});