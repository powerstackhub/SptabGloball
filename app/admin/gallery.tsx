
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type GalleryItem = Database['public']['Tables']['gallery']['Row'];

export default function AdminGalleryScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
  });

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
      Alert.alert('Error', 'Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image_url || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('gallery')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingItem(null);
      setFormData({ title: '', description: '', image_url: '', category: '' });
      fetchGallery();
      Alert.alert('Success', `Gallery item ${editingItem ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${editingItem ? 'update' : 'add'} gallery item`);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category: item.category,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Gallery Item',
      'Are you sure you want to delete this gallery item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Attempting to delete gallery item with ID:', id);
              const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', id);

              if (error) {
                console.error('Delete error:', error);
                throw error;
              }

              console.log('Gallery item deleted successfully');
              fetchGallery();
              Alert.alert('Success', 'Gallery item deleted successfully!');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete gallery item');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ title: '', description: '', image_url: '', category: '' });
  };

  return (
    <View style={styles.container}>
      <WebHeader />

      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Gallery</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Manage Gallery</Text>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.webAddButton}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.webAddButtonText}>Add Image</Text>
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Image Title *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.image_url}
              onChangeText={(text) => setFormData({ ...formData, image_url: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Category *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="#ffffff" />
              <Text style={styles.saveButtonText}>
                {editingItem ? 'Update Item' : 'Add Item'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.galleryList}>
          {gallery.map((item) => (
            <View key={item.id} style={styles.galleryCard}>
              <View style={styles.galleryInfo}>
                <Text style={styles.galleryTitle}>{item.title}</Text>
                <Text style={styles.galleryCategory}>Category: {item.category}</Text>
                <Text style={styles.galleryDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.galleryActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}
                >
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
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
    backgroundColor: '#ec4899',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#ec4899',
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
    backgroundColor: '#ec4899',
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
  galleryList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  galleryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  galleryInfo: {
    flex: 1,
  },
  galleryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  galleryCategory: {
    fontSize: 12,
    color: '#ec4899',
    marginBottom: 4,
  },
  galleryDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  galleryActions: {
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
