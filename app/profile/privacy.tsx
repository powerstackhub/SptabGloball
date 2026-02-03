import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Eye, Lock, UserCheck } from 'lucide-react-native';
import { useState } from 'react';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

export default function PrivacyScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    dataSharing: false,
    analyticsTracking: true,
    locationAccess: false,
  });

  const handleToggle = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const privacySettings = [
    {
      id: 'profileVisibility',
      title: 'Profile Visibility',
      description: 'Allow others to see your profile',
      icon: Eye,
      value: privacy.profileVisibility,
    },
    {
      id: 'dataSharing',
      title: 'Data Sharing',
      description: 'Share anonymous usage data',
      icon: UserCheck,
      value: privacy.dataSharing,
    },
    {
      id: 'analyticsTracking',
      title: 'Analytics Tracking',
      description: 'Help improve the app with usage analytics',
      icon: Shield,
      value: privacy.analyticsTracking,
    },
    {
      id: 'locationAccess',
      title: 'Location Access',
      description: 'Allow location-based features',
      icon: Lock,
      value: privacy.locationAccess,
    },
  ];

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy & Security</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Privacy & Security</Text>
            <Text style={styles.pageSubtitle}>Control your privacy settings</Text>
          </View>
        )}

        <View style={styles.settingsContainer}>
          {privacySettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <View key={setting.id} style={styles.settingCard}>
                <View style={styles.settingIcon}>
                  <Icon size={20} color="#22c55e" />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={setting.value}
                  onValueChange={() => handleToggle(setting.id as keyof typeof privacy)}
                  trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
                  thumbColor={setting.value ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Data Protection</Text>
          <Text style={styles.infoText}>
            We take your privacy seriously. Your personal information is encrypted and stored securely. 
            We never share your data with third parties without your explicit consent.
          </Text>
          <Text style={styles.infoText}>
            You can request to download or delete your data at any time by contacting our support team.
          </Text>
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
  },
  content: {
    flex: 1,
  },
  settingsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 32,
    borderRadius: 16,
    padding: 20,
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
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
});