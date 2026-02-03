import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type Video = Database['public']['Tables']['videos']['Row'];

export default function AdminVideosScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    thumbnail_url: '',
    duration: '',
    language: 'english',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.youtube_url || !formData.duration || !formData.language) {
      Alert.alert('Error', 'Please fill in all required fields (Title, YouTube URL, Duration, Language)');
      return;
    }

    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingVideo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('videos')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingVideo(null);
      setFormData({ title: '', description: '', youtube_url: '', thumbnail_url: '', duration: '', language: 'english' });
      fetchVideos();
      Alert.alert('Success', `Video ${editingVideo ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Video save error:', error);
      Alert.alert('Error', `Failed to ${editingVideo ? 'update' : 'add'} video`);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      youtube_url: video.youtube_url,
      thumbnail_url: video.thumbnail_url || '',
      duration: video.duration,
      language: video.language || 'english',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Attempting to delete video with ID:', id);
              const { error } = await supabase
                .from('videos')
                .delete()
                .eq('id', id);

              if (error) {
                console.error('Delete error:', error);
                throw error;
              }
              
              console.log('Video deleted successfully');
              fetchVideos();
              Alert.alert('Success', 'Video deleted successfully!');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingVideo(null);
    setFormData({ title: '', description: '', youtube_url: '', thumbnail_url: '', duration: '', language: 'english' });
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Videos</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Manage Videos</Text>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.webAddButton}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.webAddButtonText}>Add Video</Text>
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

						<TextInput
			  style={styles.input}
			  placeholder="Video Title *"
			  placeholderTextColor="#9ca3af"
			  value={formData.title}
			  onChangeText={(text) => setFormData({ ...formData, title: text })}
			/>

			<TextInput
			  style={[styles.input, styles.textArea]}
			  placeholder="Description"
			  placeholderTextColor="#9ca3af"
			  value={formData.description}
			  onChangeText={(text) => setFormData({ ...formData, description: text })}
			  multiline
			  numberOfLines={3}
			/>

			<TextInput
			  style={styles.input}
			  placeholder="YouTube URL *"
			  placeholderTextColor="#9ca3af"
			  value={formData.youtube_url}
			  onChangeText={(text) => setFormData({ ...formData, youtube_url: text })}
			/>

			<TextInput
			  style={styles.input}
			  placeholder="Thumbnail URL"
			  placeholderTextColor="#9ca3af"
			  value={formData.thumbnail_url}
			  onChangeText={(text) => setFormData({ ...formData, thumbnail_url: text })}
			/>

			<TextInput
			  style={styles.input}
			  placeholder="Duration (e.g., 12:30) *"
			  placeholderTextColor="#9ca3af"
			  value={formData.duration}
			  onChangeText={(text) => setFormData({ ...formData, duration: text })}
			/>

            
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Language *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScrollView}>
                <View style={styles.languageOptions}>
                {['english', 'tamil', 'hindi', 'telugu', 'kannada', 'malayalam'].map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.languageOption,
                      formData.language === lang && styles.languageOptionActive
                    ]}
                    onPress={() => setFormData({ ...formData, language: lang })}
                  >
                    <Text style={[
                      styles.languageText,
                      formData.language === lang && styles.languageTextActive
                    ]}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
                </View>
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="#ffffff" />
              <Text style={styles.saveButtonText}>
                {editingVideo ? 'Update Video' : 'Add Video'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.videosList}>
          {videos.map((video) => (
            <View key={video.id} style={styles.videoCard}>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.videoLanguage}>Language: {video.language || 'english'}</Text>
                <Text style={styles.videoDuration}>{video.duration}</Text>
                <Text style={styles.videoDescription} numberOfLines={2}>
                  {video.description}
                </Text>
              </View>
              <View style={styles.videoActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(video)}
                >
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(video.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
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
    backgroundColor: '#ef4444',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    justifyContent: 'space-between',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webHeader: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  webAddButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  webAddButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  languageScrollView: {
    maxHeight: 50,
  },
  languageOptions: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  languageOption: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  languageOptionActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  languageText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  languageTextActive: {
    color: '#ffffff',
  },
  videosList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    paddingRight: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    marginBottom: 4,
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  videoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});