import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, TrendingUp, Users, DollarSign } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type Donation = Database['public']['Tables']['donations']['Row'];

export default function AdminPaymentsScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    successfulPayments: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const donationsData = data || [];
      setDonations(donationsData);
      
      // Calculate stats
      const totalAmount = donationsData
        .filter(d => d.status === 'paid')
        .reduce((sum, d) => sum + Number(d.amount), 0);
      
      const successfulPayments = donationsData.filter(d => d.status === 'paid').length;
      const pendingPayments = donationsData.filter(d => d.status === 'pending').length;
      
      setStats({
        totalAmount,
        totalDonations: donationsData.length,
        successfulPayments,
        pendingPayments,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#22c55e';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'cancelled': return '#6b7280';
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
          <Text style={styles.headerTitle}>Payment Analytics</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Payment Analytics</Text>
            <Text style={styles.pageSubtitle}>Monitor donations and payment performance</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <DollarSign size={24} color="#22c55e" />
            <Text style={styles.statNumber}>₹{stats.totalAmount.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Raised</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#3b82f6" />
            <Text style={styles.statNumber}>{stats.totalDonations}</Text>
            <Text style={styles.statLabel}>Total Donations</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#8b5cf6" />
            <Text style={styles.statNumber}>{stats.successfulPayments}</Text>
            <Text style={styles.statLabel}>Successful</Text>
          </View>
          <View style={styles.statCard}>
            <CreditCard size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>{stats.pendingPayments}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.donationsList}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          {donations.map((donation) => (
            <View key={donation.id} style={styles.donationCard}>
              <View style={styles.donationInfo}>
                <Text style={styles.donorName}>
                  {donation.donor_name || 'Anonymous Donor'}
                </Text>
                <Text style={styles.donationAmount}>₹{Number(donation.amount).toLocaleString()}</Text>
                <Text style={styles.donationDate}>
                  {new Date(donation.created_at).toLocaleDateString()}
                </Text>
                {donation.donor_email && (
                  <Text style={styles.donorEmail}>{donation.donor_email}</Text>
                )}
              </View>
              <View style={styles.donationStatus}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(donation.status) }
                ]}>
                  <Text style={styles.statusText}>{donation.status.toUpperCase()}</Text>
                </View>
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
    backgroundColor: '#22c55e',
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
    fontSize: 20,
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
    padding: 20,
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
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  donationsList: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  donationCard: {
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
  donationInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  donationAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 4,
  },
  donationDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  donorEmail: {
    fontSize: 12,
    color: '#6b7280',
  },
  donationStatus: {
    alignItems: 'flex-end',
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
});