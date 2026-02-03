
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type Counselor = Database['public']['Tables']['counselors']['Row'];

export default function AdminCounselorsScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCounselor, setEditingCounselor] = useState<Counselor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    experience: '',
    rating: '',
    image_url: '',
    available: 'true',
    email: '',
    phone: '',
    country: '',
    state: '',
    district: '',
    city: '',
    language: 'english',
  });

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const { data, error } = await supabase
        .from('counselors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCounselors(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch counselors');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.specialization || !formData.experience || !formData.email || !formData.language) {
      Alert.alert('Error', 'Please fill in all required fields (Name, Specialization, Experience, Email, Language)');
      return;
    }

    try {
      const counselorData = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : 5.0,
        available: formData.available === 'true',
      };

      if (editingCounselor) {
        const { error } = await supabase
          .from('counselors')
          .update({
            ...counselorData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCounselor.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('counselors')
          .insert([counselorData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingCounselor(null);
      setFormData({ name: '', specialization: '', experience: '', rating: '', image_url: '', available: 'true', email: '', phone: '', country: '', state: '', district: '', city: '', language: 'english' });
      fetchCounselors();
      Alert.alert('Success', `Counselor ${editingCounselor ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${editingCounselor ? 'update' : 'add'} counselor`);
    }
  };

  const handleEdit = (counselor: Counselor) => {
    setEditingCounselor(counselor);
    setFormData({
      name: counselor.name,
      specialization: counselor.specialization,
      experience: counselor.experience,
      rating: counselor.rating?.toString() || '5.0',
      image_url: counselor.image_url || '',
      available: counselor.available ? 'true' : 'false',
      email: counselor.email,
      phone: counselor.phone || '',
      country: counselor.country || '',
      state: counselor.state || '',
      district: counselor.district || '',
      city: counselor.city || '',
      language: counselor.language || 'english',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Counselor',
      'Are you sure you want to delete this counselor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Attempting to delete counselor with ID:', id);
              const { error } = await supabase
                .from('counselors')
                .delete()
                .eq('id', id);

              if (error) {
                console.error('Delete error:', error);
                throw error;
              }

              console.log('Counselor deleted successfully');
              fetchCounselors();
              Alert.alert('Success', 'Counselor deleted successfully!');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete counselor');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCounselor(null);
    setFormData({ name: '', specialization: '', experience: '', rating: '', image_url: '', available: 'true', email: '', phone: '', country: '', state: '', district: '', city: '', language: 'english' });
  };

  return (
    <View style={styles.container}>
      <WebHeader />

      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Counselors</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Manage Counselors</Text>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.webAddButton}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.webAddButtonText}>Add Counselor</Text>
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingCounselor ? 'Edit Counselor' : 'Add New Counselor'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Counselor Name *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Specialization *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.specialization}
              onChangeText={(text) => setFormData({ ...formData, specialization: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Experience *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.experience}
              onChangeText={(text) => setFormData({ ...formData, experience: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Rating (1-5)"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.rating}
              onChangeText={(text) => setFormData({ ...formData, rating: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.image_url}
              onChangeText={(text) => setFormData({ ...formData, image_url: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="District"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.district}
              onChangeText={(text) => setFormData({ ...formData, district: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Available:</Text>
              <View style={styles.switchOptions}>
                <TouchableOpacity
                  style={[styles.switchOption, formData.available === 'true' && styles.switchOptionActive]}
                  onPress={() => setFormData({ ...formData, available: 'true' })}
                >
                  <Text style={[styles.switchText, formData.available === 'true' && styles.switchTextActive]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.switchOption, formData.available === 'false' && styles.switchOptionActive]}
                  onPress={() => setFormData({ ...formData, available: 'false' })}
                >
                  <Text style={[styles.switchText, formData.available === 'false' && styles.switchTextActive]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

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
                {editingCounselor ? 'Update Counselor' : 'Add Counselor'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.counselorsList}>
          {counselors.map((counselor) => (
            <View key={counselor.id} style={styles.counselorCard}>
              <View style={styles.counselorInfo}>
                <Text style={styles.counselorName}>{counselor.name}</Text>
                <Text style={styles.counselorSpecialization}>{counselor.specialization}</Text>
                <Text style={styles.counselorLanguage}>Language: {counselor.language || 'english'}</Text>
                <Text style={styles.counselorExperience}>{counselor.experience}</Text>
                <Text style={styles.counselorRating}>Rating: {counselor.rating}/5</Text>
                {counselor.city && (
                  <Text style={styles.counselorLocation}>
                    Location: {counselor.city}, {counselor.district}, {counselor.state}
                  </Text>
                )}
                <Text style={[styles.counselorStatus, { color: counselor.available ? '#22c55e' : '#ef4444' }]}>
                  {counselor.available ? 'Available' : 'Unavailable'}
                </Text>
              </View>
              <View style={styles.counselorActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(counselor)}
                >
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(counselor.id)}
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
    backgroundColor: '#22c55e',
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
    backgroundColor: '#22c55e',
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#111827',
    marginRight: 16,
  },
  switchOptions: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  switchOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  switchOptionActive: {
    backgroundColor: '#22c55e',
  },
  switchText: {
    fontSize: 14,
    color: '#6b7280',
  },
  switchTextActive: {
    color: '#ffffff',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  languageScrollView: {
    maxHeight: 50,
  },
  languageOptions: {
    flexDirection: 'row',
    paddingRight: 20,
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
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  languageText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  languageTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#22c55e',
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
  counselorsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  counselorCard: {
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
  counselorInfo: {
    flex: 1,
  },
  counselorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  counselorSpecialization: {
    fontSize: 14,
    color: '#6b7280',
  },
  counselorLanguage: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: 4,
  },
  counselorExperience: {
    fontSize: 14,
    color: '#6b7280',
  },
  counselorRating: {
    fontSize: 14,
    color: '#6b7280',
  },
  counselorStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  counselorLocation: {
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  counselorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
});
