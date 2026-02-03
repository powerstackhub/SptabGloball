import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { Heart, X } from 'lucide-react-native';

interface DonatePopupProps {
  visible: boolean;
  onClose: () => void;
  onDonate: () => void;
}

export default function DonatePopup({ visible, onClose, onDonate }: DonatePopupProps) {

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={styles.popup}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color="#6b7280" />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <Heart size={48} color="#f43f5e" />
          </View>
          
          <Text style={styles.title}>Support Our Mission</Text>
          <Text style={styles.description}>
            Your donation helps us continue spreading spiritual wisdom and supporting our community.
          </Text>
          
          <View style={styles.impactStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1000+</Text>
              <Text style={styles.statLabel}>Lives Touched</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Free Programs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </View>
          </View>
          
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.donateButton} onPress={onDonate}>
              <Heart size={16} color="#ffffff" />
              <Text style={styles.donateButtonText}>Donate Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.laterButton} onPress={onClose}>
              <Text style={styles.laterButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  buttons: {
    width: '100%',
  },
  donateButton: {
    backgroundColor: '#f43f5e',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  donateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  laterButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  laterButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
