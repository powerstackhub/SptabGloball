import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Calendar, Heart, Save } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

export default function PatientGodRegisterScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [loading, setLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    occupation: '',
    health_issues: '',
    spiritual_background: '',
    consultation_preference: 'online',
  });

  const handleSubmit = async () => {
    const requiredFields = ['full_name', 'email', 'phone', 'date_of_birth', 'gender', 'address', 'city', 'district', 'state', 'country', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('patient_god_registrations')
        .insert([formData]);

      if (error) throw error;

      Alert.alert(
        'Registration Successful',
        'Thank you for registering for Patient God program! You will be assigned to a spiritual doctor soon and contacted for consultation.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <WebHeader />

      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient God Registration</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Patient God Registration</Text>
            <Text style={styles.pageSubtitle}>Join our spiritual healing program</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.iconContainer}>
            <Heart size={32} color="#10b981" />
          </View>

          <Text style={styles.formTitle}>Register for Patient God</Text>
          <Text style={styles.formDescription}>
            Fill out this form to register for our spiritual healing and wellness consultation program
          </Text>

          {/* Personal Information */}
          <Text style={styles.sectionHeader}>Personal Information</Text>

          <View style={styles.inputContainer}>
            <User size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              placeholderTextColor="#9CA3AF"
              value={formData.full_name}
              onChangeText={(text) => setFormData({ ...formData, full_name: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email *"
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Phone size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              placeholderTextColor="#9CA3AF"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* Updated Calendar Date Picker */}
          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
            <Calendar size={20} color="#6b7280" style={styles.inputIcon} />
            <Text style={[styles.input, { color: formData.date_of_birth ? '#111827' : '#9CA3AF' }]}>
              {formData.date_of_birth || 'Select Date of Birth *'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date_of_birth ? new Date(formData.date_of_birth) : new Date()}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const yyyy = selectedDate.getFullYear();
                  const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const dd = String(selectedDate.getDate()).padStart(2, '0');
                  setFormData({ ...formData, date_of_birth: `${yyyy}-${mm}-${dd}` });
                }
              }}
            />
          )}

          {/* Gender */}
          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender *</Text>
            <View style={styles.genderOptions}>
              {['male', 'female', 'other'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderOption,
                    formData.gender === gender && styles.genderOptionActive
                  ]}
                  onPress={() => setFormData({ ...formData, gender })}
                >
                  <Text style={[
                    styles.genderText,
                    formData.gender === gender && styles.genderTextActive
                  ]}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Address */}
          <Text style={styles.sectionHeader}>Address Information</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Full Address *"
            placeholderTextColor="#9CA3AF"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            multiline
            numberOfLines={3}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City *"
              placeholderTextColor="#9CA3AF"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="District *"
              placeholderTextColor="#9CA3AF"
              value={formData.district}
              onChangeText={(text) => setFormData({ ...formData, district: text })}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State *"
              placeholderTextColor="#9CA3AF"
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Country *"
              placeholderTextColor="#9CA3AF"
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Pincode *"
            placeholderTextColor="#9CA3AF"
            value={formData.pincode}
            onChangeText={(text) => setFormData({ ...formData, pincode: text })}
            keyboardType="numeric"
          />

          {/* Additional Information */}
          <Text style={styles.sectionHeader}>Additional Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Occupation"
            placeholderTextColor="#9CA3AF"
            value={formData.occupation}
            onChangeText={(text) => setFormData({ ...formData, occupation: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Health Issues (if any)"
            placeholderTextColor="#9CA3AF"
            value={formData.health_issues}
            onChangeText={(text) => setFormData({ ...formData, health_issues: text })}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Spiritual Background"
            placeholderTextColor="#9CA3AF"
            value={formData.spiritual_background}
            onChangeText={(text) => setFormData({ ...formData, spiritual_background: text })}
            multiline
            numberOfLines={3}
          />

          {/* Preference */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.preferenceLabel}>Consultation Preference</Text>
            <View style={styles.preferenceOptions}>
              {['online', 'offline', 'both'].map((pref) => (
                <TouchableOpacity
                  key={pref}
                  style={[
                    styles.preferenceOption,
                    formData.consultation_preference === pref && styles.preferenceOptionActive
                  ]}
                  onPress={() => setFormData({ ...formData, consultation_preference: pref })}
                >
                  <Text style={[
                    styles.preferenceText,
                    formData.consultation_preference === pref && styles.preferenceTextActive
                  ]}>
                    {pref.charAt(0).toUpperCase() + pref.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Save size={16} color="#ffffff" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },

  mobileHeader: {
    backgroundColor: '#10b981',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  placeholder: { width: 40 },

  webHeader: { paddingHorizontal: 24, paddingVertical: 32, alignItems: 'center' },
  pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  pageSubtitle: { fontSize: 16, color: '#6b7280' },

  content: { flex: 1 },

  formContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 32,
  },

  iconContainer: { alignItems: 'center', marginBottom: 16 },
  formTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#111827' },
  formDescription: {
    fontSize: 14, color: '#6b7280', textAlign: 'center',
    marginBottom: 24, lineHeight: 20,
  },

  sectionHeader: {
    fontSize: 16, fontWeight: 'bold',
    color: '#10b981', marginTop: 20, marginBottom: 12,
  },

  // Inputs
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1, borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#111827' },

  textArea: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 80,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  row: { flexDirection: 'row', gap: 12 },
  halfInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flex: 1,
    marginBottom: 16,
  },

  // Gender
  genderContainer: { marginBottom: 16 },
  genderLabel: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  genderOptions: { flexDirection: 'row', gap: 12 },
  genderOption: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  genderOptionActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  genderText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  genderTextActive: { color: '#ffffff' },

  // Preferences
  preferenceContainer: { marginBottom: 24 },
  preferenceLabel: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  preferenceOptions: { flexDirection: 'row', gap: 12 },
  preferenceOption: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  preferenceOptionActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  preferenceText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  preferenceTextActive: { color: '#ffffff' },

  // Submit
  submitButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: { backgroundColor: '#9ca3af' },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
