import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type Newsletter = Database['public']['Tables']['newsletters']['Row'];

export default function AdminNewslettersScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    pdf_url: '',
    thumbnail_url: '',
    published_date: '',
  });

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
      Alert.alert('Error', 'Failed to fetch newsletters');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.published_date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingNewsletter) {
        const { error } = await supabase
          .from('newsletters')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNewsletter.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('newsletters')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingNewsletter(null);
      setFormData({ title: '', description: '', content: '', pdf_url: '', thumbnail_url: '', published_date: '' });
      fetchNewsletters();
      Alert.alert('Success', `Newsletter ${editingNewsletter ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${editingNewsletter ? 'update' : 'add'} newsletter`);
    }
  };

  const handleEdit = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter);
    setFormData({
      title: newsletter.title,
      description: newsletter.description || '',
      content: newsletter.content,
      pdf_url: newsletter.pdf_url || '',
      thumbnail_url: newsletter.thumbnail_url || '',
      published_date: newsletter.published_date,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Newsletter',
      'Are you sure you want to delete this newsletter?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Attempting to delete newsletter with ID:', id);
              const { error } = await supabase
                .from('newsletters')
                .delete()
                .eq('id', id);

              if (error) {
                console.error('Delete error:', error);
                throw error;
              }
              
              console.log('Newsletter deleted successfully');
              fetchNewsletters();
              Alert.alert('Success', 'Newsletter deleted successfully!');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete newsletter');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingNewsletter(null);
    setFormData({ title: '', description: '', content: '', pdf_url: '', thumbnail_url: '', published_date: '' });
    setShowDatePicker(false);
  };

  const onDateChange = (event: any, selectedDate?: Date | undefined) => {
    // Hide picker on both platforms after selection (keeps behavior simple)
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setFormData((prev) => ({ ...prev, published_date: iso }));
    }
  };

  const formattedPublishedDate = formData.published_date
    ? (new Date(formData.published_date)).toLocaleDateString()
    : '';

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Newsletters</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Manage Newsletters</Text>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.webAddButton}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.webAddButtonText}>Add Newsletter</Text>
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingNewsletter ? 'Edit Newsletter' : 'Add New Newsletter'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Newsletter Title *"
              placeholderTextColor="#9CA3AF"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Content *"
              placeholderTextColor="#9CA3AF"
              value={formData.content}
              onChangeText={(text) => setFormData({ ...formData, content: text })}
              multiline
              numberOfLines={5}
            />
            <TextInput
              style={styles.input}
              placeholder="PDF URL (Optional)"
              placeholderTextColor="#9CA3AF"
              value={formData.pdf_url}
              onChangeText={(text) => setFormData({ ...formData, pdf_url: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Thumbnail URL"
              placeholderTextColor="#9CA3AF"
              value={formData.thumbnail_url}
              onChangeText={(text) => setFormData({ ...formData, thumbnail_url: text })}
            />

            {/* Published date replaced with date picker trigger */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={{ color: formData.published_date ? '#111827' : '#9CA3AF', fontSize: 16 }}>
                {formData.published_date ? formattedPublishedDate : 'Select published date *'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.published_date ? new Date(formData.published_date) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                onChange={onDateChange}
                maximumDate={new Date(2100, 11, 31)}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="#ffffff" />
              <Text style={styles.saveButtonText}>
                {editingNewsletter ? 'Update Newsletter' : 'Add Newsletter'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.newslettersList}>
          {newsletters.map((newsletter) => (
            <View key={newsletter.id} style={styles.newsletterCard}>
              <View style={styles.newsletterInfo}>
                <Text style={styles.newsletterTitle}>{newsletter.title}</Text>
                <Text style={styles.newsletterDate}>{newsletter.published_date}</Text>
                <Text style={styles.newsletterDescription} numberOfLines={2}>
                  {newsletter.description}
                </Text>
              </View>
              <View style={styles.newsletterActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(newsletter)}
                >
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(newsletter.id)}
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
    backgroundColor: '#06b6d4',
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
    backgroundColor: '#06b6d4',
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
    backgroundColor: '#06b6d4',
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
  newslettersList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  newsletterCard: {
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
  newsletterInfo: {
    flex: 1,
  },
  newsletterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  newsletterDate: {
    fontSize: 12,
    color: '#06b6d4',
    marginBottom: 4,
  },
  newsletterDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  newsletterActions: {
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
