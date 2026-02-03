import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, MessageSquare, Calendar, Heart } from 'lucide-react-native';
import { useState } from 'react';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

export default function NotificationsScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    eventReminders: true,
    donationUpdates: false,
    newsletterUpdates: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const notificationSettings = [
    {
      id: 'pushNotifications',
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      icon: Bell,
      value: notifications.pushNotifications,
    },
    {
      id: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive updates via email',
      icon: MessageSquare,
      value: notifications.emailNotifications,
    },
    {
      id: 'eventReminders',
      title: 'Event Reminders',
      description: 'Get notified about upcoming events',
      icon: Calendar,
      value: notifications.eventReminders,
    },
    {
      id: 'donationUpdates',
      title: 'Donation Updates',
      description: 'Updates about your donations',
      icon: Heart,
      value: notifications.donationUpdates,
    },
    {
      id: 'newsletterUpdates',
      title: 'Newsletter Updates',
      description: 'New newsletter notifications',
      icon: MessageSquare,
      value: notifications.newsletterUpdates,
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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Notification Settings</Text>
            <Text style={styles.pageSubtitle}>Manage your notification preferences</Text>
          </View>
        )}

        <View style={styles.settingsContainer}>
          {notificationSettings.map((setting) => {
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
                  onValueChange={() => handleToggle(setting.id as keyof typeof notifications)}
                  trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
                  thumbColor={setting.value ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            );
          })}
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
});