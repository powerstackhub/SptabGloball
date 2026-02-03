import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Mail, Shield, Edit, Save, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Counselor = Database['public']['Tables']['counselors']['Row'];

export default function AdminUsersScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [users, setUsers] = useState<Profile[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('user');
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');

  useEffect(() => {
    fetchUsers();
    fetchCounselors();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchCounselors = async () => {
    try {
      const { data, error } = await supabase
        .from('counselors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCounselors(data || []);
    } catch (error) {
      console.error('Failed to fetch counselors:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string, counselorId?: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      // If assigning counselor role, link to counselor record
      if (newRole === 'counselor' && counselorId) {
        const user = users.find(u => u.id === userId);
        if (user) {
          const { error: counselorError } = await supabase
            .from('counselors')
            .update({ 
              email: user.email,
              updated_at: new Date().toISOString()
            })
            .eq('id', counselorId);

          if (counselorError) throw counselorError;
        }
      }
      
      setEditingUser(null);
      setSelectedRole('user');
      setSelectedCounselor('');
      fetchUsers();
      Alert.alert('Success', 'User role updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const startEdit = (userId: string, currentRole: string) => {
    setEditingUser(userId);
    setSelectedRole(currentRole);
    setSelectedCounselor('');
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setSelectedRole('user');
    setSelectedCounselor('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'counselor': return '#3b82f6';
      case 'user': return '#22c55e';
      default: return '#6b7280';
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
          <Text style={styles.headerTitle}>Manage Users</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Manage Users</Text>
            <Text style={styles.pageSubtitle}>Manage user roles and permissions</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.filter(u => u.role === 'admin').length}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.filter(u => u.role === 'counselor').length}</Text>
            <Text style={styles.statLabel}>Counselors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{users.filter(u => u.role === 'user').length}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
        </View>

        <View style={styles.usersList}>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.full_name || 'No Name'}</Text>
                <View style={styles.userDetail}>
                  <Mail size={14} color="#6b7280" />
                  <Text style={styles.userDetailText}>{user.email}</Text>
                </View>
                
                {editingUser === user.id ? (
                  <View style={styles.roleForm}>
                    <Text style={styles.roleLabel}>Change Role:</Text>
                    <View style={styles.roleOptions}>
                      {['user', 'counselor', 'admin'].map((role) => (
                        <TouchableOpacity
                          key={role}
                          style={[
                            styles.roleOption,
                            selectedRole === role && styles.roleOptionActive
                          ]}
                          onPress={() => setSelectedRole(role)}
                        >
                          <Text style={[
                            styles.roleText,
                            selectedRole === role && styles.roleTextActive
                          ]}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    {selectedRole === 'counselor' && (
                      <View style={styles.counselorLinkSection}>
                        <Text style={styles.counselorLinkLabel}>Link to Counselor:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.counselorScrollView}>
                          <View style={styles.counselorOptions}>
                            {counselors.map((counselor) => (
                              <TouchableOpacity
                                key={counselor.id}
                                style={[
                                  styles.counselorOption,
                                  selectedCounselor === counselor.id && styles.counselorOptionActive
                                ]}
                                onPress={() => setSelectedCounselor(counselor.id)}
                              >
                                <Text style={[
                                  styles.counselorText,
                                  selectedCounselor === counselor.id && styles.counselorTextActive
                                ]}>
                                  {counselor.name}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </ScrollView>
                      </View>
                    )}
                    
                    <View style={styles.roleActions}>
                      <TouchableOpacity
                        style={styles.saveRoleButton}
                        onPress={() => updateUserRole(user.id, selectedRole, selectedCounselor || undefined)}
                      >
                        <Save size={16} color="#ffffff" />
                        <Text style={styles.saveRoleText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelRoleButton}
                        onPress={cancelEdit}
                      >
                        <X size={16} color="#6b7280" />
                        <Text style={styles.cancelRoleText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.roleInfo}>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                      <Shield size={12} color="#ffffff" />
                      <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
                    </View>
                  </View>
                )}
              </View>
              
              <View style={styles.userActions}>
                {editingUser !== user.id && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => startEdit(user.id, user.role)}
                  >
                    <Edit size={16} color="#3b82f6" />
                  </TouchableOpacity>
                )}
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
  placeholder: {
    width: 40,
  },
  webHeader: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  usersList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userDetailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  roleInfo: {
    marginTop: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  roleForm: {
    marginTop: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roleOption: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  roleOptionActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  roleText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  roleTextActive: {
    color: '#ffffff',
  },
  counselorLinkSection: {
    marginBottom: 12,
  },
  counselorLinkLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  counselorScrollView: {
    maxHeight: 40,
  },
  counselorOptions: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  counselorOption: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  counselorOptionActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  counselorText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  counselorTextActive: {
    color: '#ffffff',
  },
  roleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveRoleButton: {
    backgroundColor: '#22c55e',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  saveRoleText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelRoleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelRoleText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  userActions: {
    alignItems: 'flex-end',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
});