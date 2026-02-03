import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Clock, Heart } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function VolunteerRegisterScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [loading, setLoading] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    experience: '',
    motivation: '',
  });

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.email || !formData.phone || !formData.motivation) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('volunteers').insert([formData]);

      if (error) throw error;

      Alert.alert(
        'Success',
        'Thank you for registering as a volunteer! We will contact you soon.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit registration');
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
          <Text style={styles.headerTitle}>Volunteer Registration</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Volunteer Registration</Text>
            <Text style={styles.pageSubtitle}>Join our mission to spread spiritual wisdom</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.iconContainer}>
            <Heart size={32} color="#22c55e" />
          </View>

          <Text style={styles.formTitle}>Become a Volunteer</Text>
          <Text style={styles.formDescription}>Help us spread spiritual wisdom and support our community</Text>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <User size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Full Name *"
              placeholderTextColor="#9CA3AF"
              value={formData.full_name}
              onChangeText={(text) => setFormData({ ...formData, full_name: text })}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Mail size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Email Address *"
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Phone size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number *"
              placeholderTextColor="#9CA3AF"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* Skills */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Skills & Expertise (Optional)"
            placeholderTextColor="#9CA3AF"
            value={formData.skills}
            onChangeText={(text) => setFormData({ ...formData, skills: text })}
            multiline
            numberOfLines={3}
          />

          {/* Availability Time Picker */}
          <View style={styles.inputContainer}>
            <Clock size={20} color="#6b7280" style={styles.inputIcon} />

            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: formData.availability ? '#111827' : '#9CA3AF', fontSize: 16 }}>
                {formData.availability || 'Select Availability Time'}
              </Text>
            </TouchableOpacity>
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="spinner"
              onChange={(event, selected) => {
                setShowTimePicker(false);
                if (selected) {
                  const hrs = selected.getHours().toString().padStart(2, '0');
                  const mins = selected.getMinutes().toString().padStart(2, '0');
                  setFormData({ ...formData, availability: `${hrs}:${mins}` });
                }
              }}
            />
          )}

          {/* Experience */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Previous Experience (Optional)"
            placeholderTextColor="#9CA3AF"
            value={formData.experience}
            onChangeText={(text) => setFormData({ ...formData, experience: text })}
            multiline
            numberOfLines={3}
          />

          {/* Motivation */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Why do you want to volunteer? *"
            placeholderTextColor="#9CA3AF"
            value={formData.motivation}
            onChangeText={(text) => setFormData({ ...formData, motivation: text })}
            multiline
            numberOfLines={4}
          />

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Heart size={16} color="#ffffff" />
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
    backgroundColor: '#22c55e',
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
  formTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 8 },
  formDescription: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24, lineHeight: 20 },

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

  submitButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: { backgroundColor: '#9ca3af' },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});
