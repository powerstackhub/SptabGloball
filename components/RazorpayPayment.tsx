import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

interface RazorpayPaymentProps {
  amount: number;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: any) => void;
}

export default function RazorpayPayment({
  amount,
  donorName,
  donorEmail,
  donorPhone,
  onSuccess,
  onError,
}: RazorpayPaymentProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!donorName || !donorEmail || !donorPhone) {
      Alert.alert('Error', 'Please fill in all donor information fields');
      return;
    }

    setLoading(true);
    try {
      // Create order using edge function
      const orderResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL!}/functions/v1/create-payment-order`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency: 'INR',
            donor_name: donorName,
            donor_email: donorEmail,
            donor_phone: donorPhone,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      if (Platform.OS === 'web') {
        // For web, redirect to Razorpay checkout
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const options = {
            key: orderData.key_id,
            amount: orderData.order.amount,
            currency: orderData.order.currency,
            name: 'Spiritual Tablets',
            description: 'Donation to Spiritual Tablets',
            order_id: orderData.order.id,
            prefill: {
              name: donorName,
              email: donorEmail,
              contact: donorPhone,
            },
            theme: {
              color: '#22c55e',
            },
            handler: async (response: any) => {
              try {
                // Verify payment
                const verifyResponse = await fetch(
                  `${process.env.EXPO_PUBLIC_SUPABASE_URL!}/functions/v1/verify-payment`,
                  {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_signature: response.razorpay_signature,
                      donation_id: orderData.donation_id,
                    }),
                  }
                );

                const verifyData = await verifyResponse.json();

                if (verifyData.success) {
                  onSuccess(response);
                } else {
                  throw new Error('Payment verification failed');
                }
              } catch (error) {
                onError(error);
              }
            },
            modal: {
              ondismiss: () => {
                onError(new Error('Payment cancelled'));
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.head.appendChild(script);
      } else {
        // For mobile, use react-native-razorpay
        const RazorpayCheckout = require('react-native-razorpay');

        const options = {
          description: 'Donation to Spiritual Tablets',
          image: 'https://your-logo-url.com/logo.png',
          currency: 'INR',
          key: orderData.key_id,
          amount: orderData.order.amount,
          order_id: orderData.order.id,
          name: 'Spiritual Tablets',
          prefill: {
            email: donorEmail,
            contact: donorPhone,
            name: donorName,
          },
          theme: { color: '#22c55e' },
        };

        RazorpayCheckout.open(options)
          .then(async (data: any) => {
            // Verify payment
            const verifyResponse = await fetch(
              `${process.env.EXPO_PUBLIC_SUPABASE_URL!}/functions/v1/verify-payment`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_payment_id: data.razorpay_payment_id,
                  razorpay_order_id: data.razorpay_order_id,
                  razorpay_signature: data.razorpay_signature,
                  donation_id: orderData.donation_id,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              onSuccess(data);
            } else {
              throw new Error('Payment verification failed');
            }
          })
          .catch((error: any) => {
            onError(error);
          });
      }

    } catch (error) {
      console.error('Payment error:', error);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.payButton, loading && styles.payButtonDisabled]} 
      onPress={handlePayment}
      disabled={loading}
    >
      <Heart size={20} color="#ffffff" />
      <Text style={styles.payButtonText}>
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  payButton: {
    backgroundColor: '#f43f5e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});