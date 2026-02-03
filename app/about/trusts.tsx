import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Building, Users } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { isMobileDevice } from '../../utils/deviceDetection';

interface Trust {
  id: string;
  trust_name: string;
  board_member: string;
  designation: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function TrustsScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [trusts, setTrusts] = useState<Trust[]>([]);
  const [loading, setLoading] = useState(true);
  const [trustGroups, setTrustGroups] = useState<{ [key: string]: Trust[] }>({});

  useEffect(() => {
    fetchTrusts();
  }, []);

  const fetchTrusts = async () => {
    try {
      const { data, error } = await supabase
        .from('trusts')
        .select('*')
        .order('trust_name', { ascending: true });

      if (error) throw error;
      
      setTrusts(data || []);
      
      // Group trusts by trust_name
      const grouped = (data || []).reduce((acc: { [key: string]: Trust[] }, trust) => {
        if (!acc[trust.trust_name]) {
          acc[trust.trust_name] = [];
        }
        acc[trust.trust_name].push(trust);
        return acc;
      }, {});
      
      setTrustGroups(grouped);
    } catch (error) {
      console.error('Failed to fetch trusts:', error);
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
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trusts</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Our Trusts</Text>
            <Text style={styles.pageSubtitle}>
              Meet the dedicated board members who guide our spiritual mission
            </Text>
          </View>
        )}

        <View style={styles.trustsContainer}>
          {Object.keys(trustGroups).map((trustName) => (
            <View key={trustName} style={styles.trustSection}>
              <View style={styles.trustHeader}>
                <Building size={24} color="#22c55e" />
                <Text style={styles.trustName}>{trustName}</Text>
              </View>
              
              {trustGroups[trustName][0]?.description && (
                <Text style={styles.trustDescription}>
                  {trustGroups[trustName][0].description}
                </Text>
              )}
              
              <View style={styles.membersContainer}>
                <View style={styles.membersHeader}>
                  <Users size={20} color="#6b7280" />
                  <Text style={styles.membersTitle}>Board Members</Text>
                </View>
                
                <View style={styles.membersTable}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.nameColumn]}>Name</Text>
                    <Text style={[styles.tableHeaderText, styles.designationColumn]}>Designation</Text>
                  </View>
                  
                  {trustGroups[trustName].map((member) => (
                    <View key={member.id} style={styles.tableRow}>
                      <Text style={[styles.tableCellText, styles.nameColumn]}>
                        {member.board_member}
                      </Text>
                      <Text style={[styles.tableCellText, styles.designationColumn]}>
                        {member.designation}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
          
          {Object.keys(trustGroups).length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Building size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No trusts information available</Text>
            </View>
          )}
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
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
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
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  trustsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  trustSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trustName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 12,
  },
  trustDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  membersContainer: {
    marginTop: 8,
  },
  membersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  membersTable: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableCellText: {
    fontSize: 14,
    color: '#111827',
  },
  nameColumn: {
    flex: 1.2,
  },
  designationColumn: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
});