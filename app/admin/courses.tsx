import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Trash2, Edit2, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

interface Course {
  id: string;
  name: string;
  type: string;
  description: string | null;
  created_at: string;
}

export default function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'L1', description: '' });
  const { profile } = useAuth();
  const router = useRouter();
  const isMobile = isMobileDevice();

  useEffect(() => {
    if (!profile?.role || profile.role !== 'admin') {
      router.replace('/(tabs)');
      return;
    }
    fetchCourses();
  }, [profile]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async () => {
    if (!formData.name.trim() || !formData.type.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update({
            name: formData.name,
            type: formData.type,
            description: formData.description,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCourse.id);

        if (error) throw error;
        Alert.alert('Success', 'Course updated successfully');
      } else {
        const { error } = await supabase.from('courses').insert([
          {
            name: formData.name,
            type: formData.type,
            description: formData.description,
          },
        ]);

        if (error) throw error;
        Alert.alert('Success', 'Course created successfully');
      }

      setShowModal(false);
      setEditingCourse(null);
      setFormData({ name: '', type: 'L1', description: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      Alert.alert('Error', 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    Alert.alert('Delete Course', 'Are you sure you want to delete this course?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.from('courses').delete().eq('id', courseId);
            if (error) throw error;
            Alert.alert('Success', 'Course deleted successfully');
            fetchCourses();
          } catch (error) {
            console.error('Error deleting course:', error);
            Alert.alert('Error', 'Failed to delete course');
          }
        },
      },
    ]);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      type: course.type,
      description: course.description || '',
    });
    setShowModal(true);
  };

  const handleNewCourse = () => {
    setEditingCourse(null);
    setFormData({ name: '', type: 'L1', description: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({ name: '', type: 'L1', description: '' });
  };

  return (
    <View style={styles.container}>
      <WebHeader />

      {(!isMobile && Platform.OS === 'web') && (
        <View style={styles.webHeader}>
          <Text style={styles.pageTitle}>Course Management</Text>
          <Text style={styles.pageSubtitle}>Add and manage courses for enrollment</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>All Courses</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleNewCourse}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Course</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading courses...</Text>
        ) : courses.length === 0 ? (
          <Text style={styles.emptyText}>No courses yet. Create one to get started!</Text>
        ) : (
          <View style={styles.coursesList}>
            {courses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <Text style={styles.courseType}>Type: {course.type}</Text>
                  {course.description && (
                    <Text style={styles.courseDescription}>{course.description}</Text>
                  )}
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditCourse(course)}
                  >
                    <Edit2 size={18} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCourse ? 'Edit Course' : 'New Course'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <X size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Course Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter course name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.label}>Course Type *</Text>
              <View style={styles.typeSelector}>
                {['L1', 'L2'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      formData.type === type && styles.typeButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, type })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        formData.type === type && styles.typeButtonTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter course description (optional)"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveCourse}>
                <Text style={styles.saveButtonText}>
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    paddingVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    paddingVertical: 20,
  },
  coursesList: {
    gap: 12,
    marginBottom: 40,
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  courseType: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#dbeafe',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
