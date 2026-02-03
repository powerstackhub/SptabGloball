import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Palette, Globe, Volume2, Vibrate } from 'lucide-react-native';
import { useState } from 'react';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

export default function SettingsScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [settings, setSettings] = useState({
    darkMode: false,
    soundEffects: true,
    hapticFeedback: true,
    autoPlay: false,
    language: 'english',
  });

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleLanguageChange = (language: string) => {
    setSettings(prev => ({
      ...prev,
      language
    }));
  };

  const appSettings = [
    {
      id: 'darkMode',
      title: 'Dark Mode',
      description: 'Use dark theme',
      icon: Palette,
      value: settings.darkMode,
      type: 'toggle',
    },
    {
      id: 'soundEffects',
      title: 'Sound Effects',
      description: 'Play sound effects',
      icon: Volume2,
      value: settings.soundEffects,
      type: 'toggle',
    },
    {
      id: 'hapticFeedback',
      title: 'Haptic Feedback',
      description: 'Vibration feedback',
      icon: Vibrate,
      value: settings.hapticFeedback,
      type: 'toggle',
    },
    {
      id: 'autoPlay',
      title: 'Auto Play Videos',
      description: 'Automatically play videos',
      icon: Globe,
      value: settings.autoPlay,
      type: 'toggle',
    },
  ];

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'tamil', name: 'Tamil' },
    { code: 'hindi', name: 'Hindi' },
    { code: 'telugu', name: 'Telugu' },
    { code: 'kannada', name: 'Kannada' },
    { code: 'malayalam', name: 'Malayalam' },
  ];

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Settings</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>App Settings</Text>
            <Text style={styles.pageSubtitle}>Customize your app experience</Text>
          </View>
        )}

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>General</Text>
          {appSettings.map((setting) => {
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
                  onValueChange={() => handleToggle(setting.id as keyof typeof settings)}
                  trackColor={{ false: '#e5e7eb', true: '#22c55e' }}
                  thumbColor={setting.value ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.languageGrid}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  settings.language === lang.code && styles.languageOptionActive
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={[
                  styles.languageText,
                  settings.language === lang.code && styles.languageTextActive
                ]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
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
  languageSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  languageOption: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  languageOptionActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  languageText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  languageTextActive: {
    color: '#ffffff',
  },
});