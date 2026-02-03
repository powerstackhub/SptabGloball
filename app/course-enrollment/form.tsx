import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';
import { getCountries, getStates, getCities } from '../../utils/locationData';

interface Course {
  id: string;
  name: string;
  type: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  batch_month: string;
}

export default function CourseEnrollmentForm() {
  const { courseId } = useLocalSearchParams();
  const router = useRouter();
  const { profile } = useAuth();
  const isMobile = isMobileDevice();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    batch_month: '',
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const countryList = getCountries();
  const stateList = formData.country ? getStates(formData.country) : [];
  const cityList = formData.country && formData.state ? getCities(formData.country, formData.state) : [];

  useEffect(() => {
    if (!profile) {
      router.replace('/login');
      return;
    }
    if (courseId) {
      fetchCourse(courseId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, courseId]);

  const fetchCourse = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        Alert.alert('Error', 'Course not found');
        router.back();
        return;
      }
      setCourse(data as Course);
    } catch (error) {
      console.error('Error fetching course:', error);
      Alert.alert('Error', 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Validation Error', 'Valid email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Validation Error', 'Phone is required');
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return false;
    }
    if (!formData.country.trim()) {
      Alert.alert('Validation Error', 'Country is required');
      return false;
    }
    if (!formData.state.trim()) {
      Alert.alert('Validation Error', 'State is required');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Validation Error', 'City is required');
      return false;
    }
    if (!formData.batch_month.trim()) {
      Alert.alert('Validation Error', 'Batch month is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !course) return;

    try {
      setSubmitting(true);
      const { error } = await supabase.from('course_enrollments').insert([
        {
          user_id: profile?.id,
          course_id: course.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          batch_month: formData.batch_month,
        },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Enrolled successfully!', [
        {
          text: 'View Profile',
          onPress: () => router.push('/(tabs)/profile'),
        },
        {
          text: 'Back to Courses',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      Alert.alert('Error', 'Failed to submit enrollment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const DropdownComponent = ({
    label,
    value,
    options,
    onSelect,
    field,
  }: {
    label: string;
    value: string;
    options: string[];
    onSelect: (value: string, field: keyof FormData) => void;
    field: keyof FormData;
  }) => (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label} *</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownOpen(dropdownOpen === field ? null : field)}
      >
        <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]}>
          {value || `Select ${label.toLowerCase()}`}
        </Text>
        <ChevronDown
          size={20}
          color="#6b7280"
          style={[styles.dropdownIcon, dropdownOpen === field && styles.dropdownIconOpen]}
        />
      </TouchableOpacity>

      {dropdownOpen === field && (
        <View style={styles.dropdownMenu}>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownOption,
                  value === item && styles.dropdownOptionActive,
                ]}
                onPress={() => {
                  onSelect(item, field);
                  setDropdownOpen(null);
                }}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    value === item && styles.dropdownOptionTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            scrollEnabled
            nestedScrollEnabled
            maxToRenderPerBatch={10}
          />
        </View>
      )}
    </View>
  );

  const handleSelectDropdown = (value: string, field: keyof FormData) => {
    // single setState call to avoid stale state/race conditions
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'country') {
        next.state = '';
        next.city = '';
      } else if (field === 'state') {
        next.city = '';
      }
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <WebHeader />

      {(!isMobile && Platform.OS === 'web') && (
        <View style={styles.webHeader}>
          <Text style={styles.pageTitle}>Course Enrollment Form</Text>
          <Text style={styles.pageSubtitle}>Complete your course enrollment</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(Platform.OS !== 'web' || isMobile) && (
          <View style={styles.mobileHeader}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#22c55e" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Enrollment Form</Text>
            <View style={styles.placeholder} />
          </View>
        )}

        {loading ? (
          <Text style={styles.loadingText}>Loading course...</Text>
        ) : course ? (
          <>
            <View style={styles.courseSection}>
              <Text style={styles.courseSectionTitle}>Selected Course</Text>
              <View style={styles.courseInfoCard}>
                <View>
                  <Text style={styles.courseInfoName}>{course.name}</Text>
                  <Text style={styles.courseInfoType}>Type: {course.type}</Text>
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Your Information</Text>

              <View>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(text) => setFormData((p) => ({ ...p, name: text }))}
                />
              </View>

              <View>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(text) => setFormData((p) => ({ ...p, email: text }))}
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChangeText={(text) => setFormData((p) => ({ ...p, phone: text }))}
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="Enter your address"
                  value={formData.address}
                  onChangeText={(text) => setFormData((p) => ({ ...p, address: text }))}
                  multiline
                  numberOfLines={2}
                />
              </View>

              <DropdownComponent
                label="Country"
                value={formData.country}
                options={countryList}
                onSelect={handleSelectDropdown}
                field="country"
              />

              {formData.country && (
                <DropdownComponent
                  label="State/Province"
                  value={formData.state}
                  options={stateList}
                  onSelect={handleSelectDropdown}
                  field="state"
                />
              )}

              {formData.country && formData.state && (
                <DropdownComponent
                  label="City"
                  value={formData.city}
                  options={cityList}
                  onSelect={handleSelectDropdown}
                  field="city"
                />
              )}

              <DropdownComponent
                label="Batch Month"
                value={formData.batch_month}
                options={months}
                onSelect={handleSelectDropdown}
                field="batch_month"
              />

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Submitting...' : 'Submit Enrollment'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleGoBack}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>Course not found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  webHeader: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  mobileHeader: {
  backgroundColor: '#ffffff',
  paddingTop: 50,            // same extra top spacing as books page
  paddingBottom: 16,
  paddingHorizontal: 20,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderBottomColor: '#e5e7eb',
},
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    paddingVertical: 40,
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    paddingVertical: 40,
  },
  courseSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  courseSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  courseInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseInfoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  courseInfoType: {
    fontSize: 14,
    color: '#6b7280',
  },
  formSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownMenu: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    borderTopWidth: 0,
    maxHeight: 300,
    marginBottom: 16,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownOptionActive: {
    backgroundColor: '#dbeafe',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownOptionTextActive: {
    color: '#0284c7',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
});
