// app/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  CreditCard as Edit3,
  Save,
  Camera,
  Settings,
  LogOut,
  Bell,
  Shield,
  CircleHelp as HelpCircle,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { useAuth } from '../../contexts/AuthContext';
import { isMobileDevice } from '../../utils/deviceDetection';
import { supabase } from '../../lib/supabase';

interface CourseEnrollment {
  id: string;
  course_id: string;
  courses: {
    name: string;
    type: string;
  };
}

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseEnrollment[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const { profile: authProfile, signOut, dataLoaded } = useAuth();
  const router = useRouter();
  const isMobile = isMobileDevice();

  // local editable copy of profile
  const [localProfile, setLocalProfile] = useState(
    authProfile ?? {
      name: 'Spiritual Seeker',
      email: 'seeker@spiritualtablets.com',
      phone: '+1 234 567 8900',
      location: 'New York, USA',
      bio: 'On a journey of spiritual discovery and inner peace.',
    }
  );

  // keep localProfile in sync if authProfile arrives/changes
  useEffect(() => {
    if (authProfile) setLocalProfile((prev) => ({ ...prev, ...authProfile }));
  }, [authProfile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authProfile && dataLoaded) {
      router.replace('/login');
    }
  }, [authProfile, dataLoaded, router]);

  // Fetch enrolled courses when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (authProfile) {
        fetchEnrolledCourses();
      }
    }, [authProfile])
  );

  const fetchEnrolledCourses = async () => {
    try {
      setLoadingCourses(true);
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('id, course_id, courses(name, type)')
        .eq('user_id', authProfile?.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrolledCourses(data || []);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/login');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout');
          }
        }
      },
    ]);
  };

  const settingsOptions = [
    { id: 'notifications', title: 'Notifications', icon: Bell, route: '/profile/notifications' },
    { id: 'privacy', title: 'Privacy & Security', icon: Shield, route: '/profile/privacy' },
    { id: 'settings', title: 'App Settings', icon: Settings, route: '/profile/settings' },
    { id: 'help', title: 'Help & Support', icon: HelpCircle, route: '/profile/help' },
    ...(authProfile?.role === 'counselor' ? [{ id: 'patients', title: 'My Patients', icon: Users, route: '/counselor/patients' }] : []),
    ...(authProfile?.role === 'admin' ? [{ id: 'admin', title: 'Admin Panel', icon: Settings, route: '/admin' }] : []),
  ];

  const primaryColor = '#22c55e';

  return (
    <View style={styles.container}>
      <WebHeader />

      {(Platform.OS !== 'web' || isMobile) && (
        <View style={[styles.header, { backgroundColor: primaryColor }]}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
            {isEditing ? <Save size={20} color="#ffffff" /> : <Edit3 size={20} color="#ffffff" />}
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>My Profile</Text>
            <Text style={styles.pageSubtitle}>Manage your account settings</Text>
          </View>
        )}

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: authProfile?.avatar_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity style={[styles.cameraButton, { backgroundColor: primaryColor }]}>
                <Camera size={16} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.editInput}
                  value={(localProfile as any).name}
                  onChangeText={(text) => setLocalProfile({ ...localProfile, name: text })}
                  placeholder="Full Name"
                  placeholderTextColor="#9ca3af"
                />

                <TextInput
                  style={styles.editInput}
                  value={(localProfile as any).email}
                  onChangeText={(text) => setLocalProfile({ ...localProfile, email: text })}
                  placeholder="Email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                />

                <TextInput
                  style={styles.editInput}
                  value={(localProfile as any).phone}
                  onChangeText={(text) => setLocalProfile({ ...localProfile, phone: text })}
                  placeholder="Phone"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                />

                <TextInput
                  style={styles.editInput}
                  value={(localProfile as any).location}
                  onChangeText={(text) => setLocalProfile({ ...localProfile, location: text })}
                  placeholder="Location"
                  placeholderTextColor="#9ca3af"
                />

                <TextInput
                  style={[styles.editInput, styles.bioInput]}
                  value={(localProfile as any).bio}
                  onChangeText={(text) => setLocalProfile({ ...localProfile, bio: text })}
                  placeholder="Bio"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                />

                <TouchableOpacity style={[styles.saveButton, { backgroundColor: primaryColor }]} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.profileName}>{(localProfile as any).name}</Text>
                <View style={styles.profileDetail}>
                  <Mail size={16} color="#6b7280" />
                  <Text style={styles.profileDetailText}>{(localProfile as any).email}</Text>
                </View>
                <View style={styles.profileDetail}>
                  <Phone size={16} color="#6b7280" />
                  <Text style={styles.profileDetailText}>{(localProfile as any).phone}</Text>
                </View>
                <View style={styles.profileDetail}>
                  <MapPin size={16} color="#6b7280" />
                  <Text style={styles.profileDetailText}>{(localProfile as any).location}</Text>
                </View>
                <Text style={styles.profileBio}>{(localProfile as any).bio}</Text>
              </>
            )}
          </View>
        </View>

        {enrolledCourses.length > 0 && (
          <View style={styles.enrolledCoursesSection}>
            <Text style={styles.sectionTitle}>Your Enrolled Courses</Text>
            <View style={styles.coursesList}>
              {enrolledCourses.map((enrollment) => (
                <View key={enrollment.id} style={styles.courseItemCard}>
                  <BookOpen size={20} color="#22c55e" style={styles.courseIcon} />
                  <View style={styles.courseItemInfo}>
                    <Text style={styles.courseItemName}>{enrollment.courses.name}</Text>
                    <Text style={styles.courseItemType}>{enrollment.courses.type}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map((option) => {
            const Icon = option.icon;
            return (
              <TouchableOpacity key={option.id} style={styles.settingCard} onPress={() => router.push(option.route as any)}>
                <View style={[styles.settingIcon, { backgroundColor: `${primaryColor}20` }]}>
                  <Icon size={20} color={primaryColor} />
                </View>
                <Text style={styles.settingText}>{option.title}</Text>
                <ChevronRight size={16} color="#6b7280" />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { paddingTop: Platform.OS === 'web' ? 16 : 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  webHeader: { paddingHorizontal: 24, paddingVertical: 32, alignItems: 'center' },
  pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  pageSubtitle: { fontSize: 16, color: '#6b7280' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  editButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 20 },
  profileSection: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, marginTop: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  profileInfo: { width: '100%', alignItems: 'center' },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  profileDetail: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  profileDetailText: { fontSize: 14, color: '#6b7280', marginLeft: 8 },
  profileBio: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20, marginTop: 12 },
  editInput: { width: '100%', backgroundColor: '#f9fafb', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16, color: '#111827', borderWidth: 1, borderColor: '#e5e7eb' },
  bioInput: { height: 80, textAlignVertical: 'top' },
  saveButton: { borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  enrolledCoursesSection: { marginTop: 32, marginBottom: 24 },
  coursesList: { gap: 12 },
  courseItemCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  courseIcon: { marginRight: 16 },
  courseItemInfo: { flex: 1 },
  courseItemName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  courseItemType: { fontSize: 13, color: '#6b7280' },
  settingsSection: { marginTop: 32 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  settingCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  settingIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  settingText: { flex: 1, fontSize: 16, color: '#111827' },
  logoutButton: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginTop: 24, marginBottom: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  logoutText: { fontSize: 16, color: '#ef4444', fontWeight: '600', marginLeft: 8 },
});
