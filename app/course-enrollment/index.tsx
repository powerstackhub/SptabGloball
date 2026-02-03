import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

interface Course {
  id: string;
  name: string;
  type: string;
  description: string | null;
}

export default function CourseEnrollmentScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { profile } = useAuth();
  const isMobile = isMobileDevice();

  useEffect(() => {
    if (!profile) {
      router.replace('/login');
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
      setCourses((data as Course[]) || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (courseId: string) => {
    router.push({
      pathname: '/course-enrollment/form',
      params: { courseId },
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <WebHeader />

      {(!isMobile && Platform.OS === 'web') && (
        <View style={styles.webHeader}>
          <Text style={styles.pageTitle}>Course Enrollment</Text>
          <Text style={styles.pageSubtitle}>Select a course to enroll</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(Platform.OS !== 'web' || isMobile) && (
          <View style={styles.mobileHeader}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#22c55e" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Enroll in Courses</Text>
            <View style={styles.placeholder} />
          </View>
        )}

        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>Available Courses</Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading courses...</Text>
        ) : courses.length === 0 ? (
          <Text style={styles.emptyText}>No courses available at the moment.</Text>
        ) : (
          <View style={styles.coursesList}>
            {courses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <Text style={styles.courseName}>{course.name}</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{course.type}</Text>
                  </View>
                </View>

                {course.description && (
                  <Text style={styles.courseDescription}>{course.description}</Text>
                )}

                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() => handleEnrollClick(course.id)}
                >
                  <Text style={styles.enrollButtonText}>Enroll Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
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
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284c7',
  },
  courseDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  enrollButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#ffffff',
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
