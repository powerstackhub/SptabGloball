// AdminAdmissionCentersScreen.tsx
import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type AdmissionCenter = Database['public']['Tables']['admission_centers']['Row'];

export default function AdminAdmissionCentersScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [centers, setCenters] = useState<AdmissionCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCenter, setEditingCenter] = useState<AdmissionCenter | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    hours: '',
  });

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('admission_centers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCenters(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch admission centers');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.phone || !formData.email || !formData.hours) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingCenter) {
        const { error } = await supabase
          .from('admission_centers')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCenter.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('admission_centers')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingCenter(null);
      setFormData({ name: '', address: '', phone: '', email: '', hours: '' });
      fetchCenters();
      Alert.alert('Success', `Admission center ${editingCenter ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${editingCenter ? 'update' : 'add'} admission center`);
    }
  };

  const handleEdit = (center: AdmissionCenter) => {
    setEditingCenter(center);
    setFormData({
      name: center.name,
      address: center.address,
      phone: center.phone,
      email: center.email,
      hours: center.hours,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Admission Center',
      'Are you sure you want to delete this admission center?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Attempting to delete admission center with ID:', id);
              const { error } = await supabase
                .from('admission_centers')
                .delete()
                .eq('id', id);

              if (error) {
                console.error('Delete error:', error);
                throw error;
              }
              
              console.log('Admission center deleted successfully');
              fetchCenters();
              Alert.alert('Success', 'Admission center deleted successfully!');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete admission center');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCenter(null);
    setFormData({ name: '', address: '', phone: '', email: '', hours: '' });
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Admission Centers</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Manage Admission Centers</Text>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.webAddButton}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.webAddButtonText}>Add Center</Text>
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingCenter ? 'Edit Admission Center' : 'Add New Admission Center'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Center Name *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Address *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
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
              placeholder="Hours (e.g., Mon-Fri: 9AM-6PM) *"
              placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={formData.hours}
              onChangeText={(text) => setFormData({ ...formData, hours: text })}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="#ffffff" />
              <Text style={styles.saveButtonText}>
                {editingCenter ? 'Update Center' : 'Add Center'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.centersList}>
          {centers.map((center) => (
            <View key={center.id} style={styles.centerCard}>
              <View style={styles.centerInfo}>
                <Text style={styles.centerName}>{center.name}</Text>
                <Text style={styles.centerAddress}>{center.address}</Text>
                <Text style={styles.centerPhone}>{center.phone}</Text>
                <Text style={styles.centerEmail}>{center.email}</Text>
                <Text style={styles.centerHours}>{center.hours}</Text>
              </View>
              <View style={styles.centerActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(center)}
                >
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(center.id)}
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
    backgroundColor: '#6366f1',
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
    fontSize: 18,
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
    backgroundColor: '#6366f1',
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
    backgroundColor: '#6366f1',
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
  centersList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  centerCard: {
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
  centerInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  centerAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  centerPhone: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  centerEmail: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  centerHours: {
    fontSize: 12,
    color: '#6366f1',
  },
  centerActions: {
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
