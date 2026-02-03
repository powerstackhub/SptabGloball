import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, TextInput, Alert } from 'react-native';
import { Heart, CreditCard, Smartphone, Building } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import RazorpayPayment from '../../components/RazorpayPayment';
import { isMobileDevice } from '../../utils/deviceDetection';

const donationAmounts = [10, 25, 50, 100, 250, 500];

const paymentMethods = [
  { id: 'card', title: 'Credit/Debit Card', icon: CreditCard, color: '#3b82f6' },
  { id: 'paypal', title: 'PayPal', icon: Smartphone, color: '#0070ba' },
  { id: 'bank', title: 'Bank Transfer', icon: Building, color: '#6b7280' },
];

export default function DonateScreen(): JSX.Element {
  const isWeb = Platform.OS === 'web';
  const isMobile = isMobileDevice();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showDonorForm, setShowDonorForm] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setShowDonorForm(true);
  };

  const handleCustomAmount = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount > 0) {
      setSelectedAmount(amount);
      setShowDonorForm(true);
    } else {
      Alert.alert('Error', 'Please enter a valid amount');
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Generate and download receipt
    generateReceipt(paymentData);
    
    Alert.alert(
      'Thank You!',
      'Your donation has been received successfully. Your support helps us continue our spiritual mission.',
      [{ text: 'OK', onPress: () => resetForm() }]
    );
  };

  const handlePaymentError = (error: any) => {
    Alert.alert('Payment Failed', 'There was an issue processing your payment. Please try again.');
    console.error('Payment error:', error);
  };

  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setShowDonorForm(false);
    setDonorInfo({ name: '', email: '', phone: '' });
  };

  const generateReceipt = (paymentData: any) => {
    if (Platform.OS === 'web') {
      // Generate HTML receipt for web
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Donation Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #22c55e; font-size: 24px; font-weight: bold; }
            .receipt-title { font-size: 20px; margin: 20px 0; }
            .details { margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .amount { font-size: 24px; color: #22c55e; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Spiritual Tablets</div>
            <div class="receipt-title">Donation Receipt</div>
          </div>
          <div class="details">
            <div class="detail-row"><strong>Donor Name:</strong> ${donorInfo.name}</div>
            <div class="detail-row"><strong>Email:</strong> ${donorInfo.email}</div>
            <div class="detail-row"><strong>Phone:</strong> ${donorInfo.phone}</div>
            <div class="detail-row"><strong>Amount:</strong> <span class="amount">₹${selectedAmount}</span></div>
            <div class="detail-row"><strong>Payment ID:</strong> ${paymentData.razorpay_payment_id}</div>
            <div class="detail-row"><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="footer">
            <p>Thank you for your generous donation!</p>
            <p>Spiritual Tablets - Spreading Spiritual Wisdom</p>
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([receiptHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donation-receipt-${paymentData.razorpay_payment_id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <Text style={styles.headerTitle}>Donate</Text>
          <Text style={styles.headerSubtitle}>Support our mission</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Support Our Mission</Text>
            <Text style={styles.pageSubtitle}>Your donation helps us spread spiritual wisdom</Text>
          </View>
        )}

        <View style={styles.transparencySection}>
          <Text style={styles.transparencyTitle}>About Spiritual Tablets</Text>
          <Text style={styles.transparencyText}>
            Spiritual Tablets is a registered Non-Governmental Organization (NGO) dedicated to 
            spreading spiritual wisdom and fostering inner peace through meditation, teachings, 
            and community support. Your donations directly support our mission to provide free 
            spiritual guidance, educational resources, and community programs.
          </Text>
          <Text style={styles.transparencyText}>
            We maintain complete transparency in our operations and fund utilization. All donations 
            are used exclusively for spiritual and educational activities, maintaining our centers, 
            and supporting our community programs.
          </Text>
        </View>

        <View style={styles.impactSection}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.impactStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1000+</Text>
              <Text style={styles.statLabel}>Lives Touched</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Free Programs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </View>
          </View>
        </View>

        <View style={styles.donationSection}>
          <Text style={styles.sectionTitle}>Choose Amount</Text>
          <View style={styles.amountGrid}>
            {donationAmounts.map((amount) => (
              <TouchableOpacity 
                key={amount} 
                style={[
                  styles.amountCard,
                  selectedAmount === amount && styles.amountCardSelected
                ]}
                onPress={() => handleAmountSelect(amount)}
              >
                <Text style={styles.amountText}>${amount}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.customAmountContainer}>
            <TextInput
              style={styles.customAmountInput}
              placeholder="Enter custom amount"
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.customAmountButton} onPress={handleCustomAmount}>
              <Text style={styles.customAmountText}>Donate</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDonorForm && selectedAmount && (
          <View style={styles.donorFormSection}>
            <Text style={styles.sectionTitle}>Donor Information (Optional)</Text>
            <TextInput
              style={styles.donorInput}
              placeholder="Full Name *"
			  placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={donorInfo.name}
              onChangeText={(text) => setDonorInfo({ ...donorInfo, name: text })}
            />
            <TextInput
              style={styles.donorInput}
              placeholder="Email *"
			  placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={donorInfo.email}
              onChangeText={(text) => setDonorInfo({ ...donorInfo, email: text })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.donorInput}
              placeholder="Phone *"
			  placeholderTextColor="#9CA3AF" /* placeholder color added */
              value={donorInfo.phone}
              onChangeText={(text) => setDonorInfo({ ...donorInfo, phone: text })}
              keyboardType="phone-pad"
            />
            
            <RazorpayPayment
              amount={selectedAmount}
              donorName={donorInfo.name}
              donorEmail={donorInfo.email}
              donorPhone={donorInfo.phone}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
            
            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {!showDonorForm && (
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>How Your Donation Helps</Text>
            <Text style={styles.infoText}>
              • Provides free spiritual guidance and counseling sessions
            </Text>
            <Text style={styles.infoText}>
              • Maintains and operates our meditation centers
            </Text>
            <Text style={styles.infoText}>
              • Creates and distributes free educational content
            </Text>
            <Text style={styles.infoText}>
              • Supports community outreach programs
            </Text>
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
  mobileHeader: {
    backgroundColor: '#22c55e',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
    paddingHorizontal: 20,
  },
  impactSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  donationSection: {
    marginBottom: 32,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12, // spacing instead of gap
  },
  amountCardSelected: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  customAmountButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginLeft: 12,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  customAmountInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  customAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  donorFormSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  donorInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 8,
  },
  transparencySection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transparencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  transparencyText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 12,
  },
});
