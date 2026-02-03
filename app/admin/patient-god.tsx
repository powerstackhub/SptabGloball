import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, MapPin, Phone, Mail, Calendar, MessageCircle, Edit, Save, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type PatientRegistration = Database['public']['Tables']['patient_god_registrations']['Row'];
type Counselor = Database['public']['Tables']['counselors']['Row'];

export default function AdminPatientGodScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [patients, setPatients] = useState<PatientRegistration[]>([]);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [selectedCounselor, setSelectedCounselor] = useState<string>('');

  useEffect(() => {
    fetchPatients();
    fetchCounselors();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_god_registrations')
        .select(`
          *,
          counselors:assigned_counselor_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch patient registrations');
    } finally {
      setLoading(false);
    }
  };

  const fetchCounselors = async () => {
    try {
      const { data, error } = await supabase
        .from('counselors')
        .select('*')
        .eq('available', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setCounselors(data || []);
    } catch (error) {
      console.error('Failed to fetch counselors:', error);
    }
  };

  const updatePatientStatus = async (patientId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('patient_god_registrations')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', patientId);

      if (error) throw error;
      
      fetchPatients();
      Alert.alert('Success', 'Patient status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update patient status');
    }
  };

  const assignCounselor = async (patientId: string, counselorId: string) => {
    try {
      const { error } = await supabase
        .from('patient_god_registrations')
        .update({ 
          assigned_counselor_id: counselorId,
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', patientId);

      if (error) throw error;
      
      setEditingPatient(null);
      setSelectedCounselor('');
      fetchPatients();
      Alert.alert('Success', 'Counselor assigned successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to assign counselor');
    }
  };

  const startEdit = (patientId: string, currentCounselorId?: string) => {
    setEditingPatient(patientId);
    setSelectedCounselor(currentCounselorId || '');
  };

  const cancelEdit = () => {
    setEditingPatient(null);
    setSelectedCounselor('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'assigned': return '#3b82f6';
      case 'in_progress': return '#8b5cf6';
      case 'completed': return '#22c55e';
      case 'cancelled': return '#ef4444';
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
          <Text style={styles.headerTitle}>Patient God Registrations</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Patient God Registrations</Text>
            <Text style={styles.pageSubtitle}>Manage patient registrations and assignments</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{patients.length}</Text>
            <Text style={styles.statLabel}>Total Registrations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{patients.filter(p => p.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{patients.filter(p => p.status === 'assigned').length}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{patients.filter(p => p.status === 'completed').length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.patientsList}>
          {patients.map((patient) => (
            <View key={patient.id} style={styles.patientCard}>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.full_name}</Text>
                <View style={styles.patientDetail}>
                  <Mail size={14} color="#6b7280" />
                  <Text style={styles.patientDetailText}>{patient.email}</Text>
                </View>
                <View style={styles.patientDetail}>
                  <Phone size={14} color="#6b7280" />
                  <Text style={styles.patientDetailText}>{patient.phone}</Text>
                </View>
                <View style={styles.patientDetail}>
                  <MapPin size={14} color="#6b7280" />
                  <Text style={styles.patientDetailText}>
                    {patient.city}, {patient.district}, {patient.state}, {patient.country}
                  </Text>
                </View>
                <View style={styles.patientDetail}>
                  <Calendar size={14} color="#6b7280" />
                  <Text style={styles.patientDetailText}>
                    DOB: {patient.date_of_birth}
                  </Text>
                </View>
                {patient.health_issues && (
                  <Text style={styles.healthIssues}>Health Issues: {patient.health_issues}</Text>
                )}
                
                {editingPatient === patient.id ? (
                  <View style={styles.assignmentForm}>
                    <Text style={styles.assignmentLabel}>Assign Counselor:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.counselorScrollView}>
                      <View style={styles.counselorOptions}>
                        <TouchableOpacity
                          style={[
                            styles.counselorOption,
                            selectedCounselor === '' && styles.counselorOptionActive
                          ]}
                          onPress={() => setSelectedCounselor('')}
                        >
                          <Text style={[
                            styles.counselorText,
                            selectedCounselor === '' && styles.counselorTextActive
                          ]}>
                            Unassigned
                          </Text>
                        </TouchableOpacity>
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
                    <View style={styles.assignmentActions}>
                      <TouchableOpacity
                        style={styles.saveAssignmentButton}
                        onPress={() => assignCounselor(patient.id, selectedCounselor)}
                      >
                        <Save size={16} color="#ffffff" />
                        <Text style={styles.saveAssignmentText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelAssignmentButton}
                        onPress={cancelEdit}
                      >
                        <X size={16} color="#6b7280" />
                        <Text style={styles.cancelAssignmentText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.assignmentInfo}>
                    {(patient as any).counselors ? (
                      <Text style={styles.assignedCounselor}>
                        Assigned to: {(patient as any).counselors.name}
                      </Text>
                    ) : (
                      <Text style={styles.unassignedText}>Not assigned</Text>
                    )}
                  </View>
                )}
              </View>
              
              <View style={styles.patientActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                  <Text style={styles.statusText}>{patient.status.toUpperCase()}</Text>
                </View>
                
                {editingPatient !== patient.id && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => startEdit(patient.id, patient.assigned_counselor_id || undefined)}
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
    backgroundColor: '#10b981',
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
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  patientsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  patientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  patientInfo: {
    flex: 1,
    marginBottom: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  patientDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  patientDetailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
  },
  healthIssues: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 8,
    fontStyle: 'italic',
  },
  assignmentInfo: {
    marginTop: 8,
  },
  assignedCounselor: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
  },
  unassignedText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  assignmentForm: {
    marginTop: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  assignmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  counselorScrollView: {
    maxHeight: 50,
    marginBottom: 12,
  },
  counselorOptions: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  counselorOption: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  counselorOptionActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  counselorText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  counselorTextActive: {
    color: '#ffffff',
  },
  assignmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveAssignmentButton: {
    backgroundColor: '#22c55e',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  saveAssignmentText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelAssignmentButton: {
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
  cancelAssignmentText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  patientActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
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