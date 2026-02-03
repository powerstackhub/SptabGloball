import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Play, Headphones } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Audio = Database['public']['Tables']['audios']['Row'];

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const getCardWidth = () => {
  if (isWeb) {
    if (width > 1200) return (width - 200) / 3;
    if (width > 768) return (width - 120) / 2;
    return width - 80;
  }
  return width - 40;
};

export default function AudiosScreen() {
  const router = useRouter();
  const cardWidth = getCardWidth();
  const [audios, setAudios] = useState<Audio[]>([]);
  const [filteredAudios, setFilteredAudios] = useState<Audio[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudios();
  }, []);

  useEffect(() => {
    if (selectedLanguage === 'all') {
      setFilteredAudios(audios);
    } else {
      setFilteredAudios(audios.filter(audio => audio.language === selectedLanguage));
    }
  }, [audios, selectedLanguage]);

  const fetchAudios = async () => {
    try {
      const { data, error } = await supabase
        .from('audios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudios(data || []);
    } catch (error) {
      console.error('Failed to fetch audios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioPress = (audioId: string) => {
    router.push(`/audios/player?id=${audioId}`);
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {!isWeb && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Audios</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Spiritual Audios</Text>
            <Text style={styles.pageSubtitle}>Listen to guided meditations and teachings</Text>
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

        <View style={styles.audiosGrid}>
          {filteredAudios.map((audio) => (
            <TouchableOpacity
              key={audio.id}
              style={[styles.audioCard, { width: cardWidth }]}
              onPress={() => handleAudioPress(audio.id)}
            >
              <View style={styles.thumbnailContainer}>
                <Image 
                  source={{ 
                    uri: audio.thumbnail_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300' 
                  }} 
                  style={styles.audioThumbnail} 
                />
                <TouchableOpacity
                  style={styles.playOverlay}
                  onPress={() => handleAudioPress(audio.id)}
                >
                  <Play size={24} color="#ffffff" />
                </TouchableOpacity>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{audio.duration}</Text>
                </View>
              </View>
              <View style={styles.audioInfo}>
                <Text style={styles.audioTitle}>{audio.title}</Text>
                <Text style={styles.audioArtist}>by {audio.artist}</Text>
                <Text style={styles.audioLanguage}>{audio.language || 'english'}</Text>
                <Text style={styles.audioDescription} numberOfLines={2}>
                  {audio.description}
                </Text>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => handleAudioPress(audio.id)}
                >
                  <Headphones size={16} color="#ffffff" />
                  <Text style={styles.playButtonText}>Listen</Text>
                </TouchableOpacity>
              </View>
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
  audiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  audioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  audioThumbnail: {
    width: '100%',
    height: 160,
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
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
  audioInfo: {
    padding: 16,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  audioArtist: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  audioLanguage: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: 8,
  },
  audioDescription: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
    marginBottom: 12,
  },
  playButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});