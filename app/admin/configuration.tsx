import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, Upload, Palette, Settings, Key, Smartphone } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type AppConfiguration = Database['public']['Tables']['app_configuration']['Row'];

export default function AdminConfigurationScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [config, setConfig] = useState<AppConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const fetchConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('app_configuration')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      // Save app configuration
      const { error: configError } = await supabase
        .from('app_configuration')
        .upsert({
          ...config,
          updated_at: new Date().toISOString(),
        });

      if (configError) throw configError;

      // Save payment configuration if razorpay keys are provided
      if (config.razorpay_key_id && config.razorpay_key_secret) {
        const { error: paymentError } = await supabase
          .from('payment_configurations')
          .upsert({
            razorpay_key_id: config.razorpay_key_id,
            razorpay_key_secret: config.razorpay_key_secret,
            is_live_mode: config.is_live_mode,
            updated_at: new Date().toISOString(),
          });

        if (paymentError) throw paymentError;
      }

      Alert.alert('Success', 'Configuration updated successfully!');
    } catch (error) {
      console.error('Configuration save error:', error);
      Alert.alert('Error', 'Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (field: keyof AppConfiguration, value: any) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  const tabs = [
    { id: 'general', title: 'General', icon: Settings },
    { id: 'theme', title: 'Theme', icon: Palette },
    { id: 'auth', title: 'Authentication', icon: Key },
    { id: 'mobile', title: 'Mobile App', icon: Smartphone },
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <WebHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading configuration...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Configuration</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
            <Save size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Icon size={16} color={activeTab === tab.id ? '#6366f1' : '#6b7280'} />
                <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>App Configuration</Text>
            <TouchableOpacity onPress={handleSave} style={styles.webSaveButton} disabled={saving}>
              <Save size={20} color="#ffffff" />
              <Text style={styles.webSaveButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'general' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Settings</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>App Name</Text>
              <TextInput
                style={styles.input}
                value={config?.app_name || ''}
                onChangeText={(text) => updateConfig('app_name', text)}
                placeholder="Enter app name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>App Logo URL</Text>
              <TextInput
                style={styles.input}
                value={config?.app_logo_url || ''}
                onChangeText={(text) => updateConfig('app_logo_url', text)}
                placeholder="Enter logo URL"
              />
              {config?.app_logo_url && (
                <Image source={{ uri: config.app_logo_url }} style={styles.logoPreview} />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Welcome Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={config?.welcome_message || ''}
                onChangeText={(text) => updateConfig('welcome_message', text)}
                placeholder="Enter welcome message"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Support Email</Text>
              <TextInput
                style={styles.input}
                value={config?.support_email || ''}
                onChangeText={(text) => updateConfig('support_email', text)}
                placeholder="Enter support email"
                keyboardType="email-address"
              />
            </View>
          </View>
        )}

        {activeTab === 'theme' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Theme Settings</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Primary Color</Text>
              <TextInput
                style={styles.input}
                value={config?.primary_color || ''}
                onChangeText={(text) => updateConfig('primary_color', text)}
                placeholder="#22c55e"
              />
              <View style={[styles.colorPreview, { backgroundColor: config?.primary_color || '#22c55e' }]} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Secondary Color</Text>
              <TextInput
                style={styles.input}
                value={config?.secondary_color || ''}
                onChangeText={(text) => updateConfig('secondary_color', text)}
                placeholder="#059669"
              />
              <View style={[styles.colorPreview, { backgroundColor: config?.secondary_color || '#059669' }]} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Theme Mode</Text>
              <View style={styles.radioGroup}>
                {['light', 'dark', 'auto'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.radioOption, config?.theme_mode === mode && styles.radioOptionActive]}
                    onPress={() => updateConfig('theme_mode', mode)}
                  >
                    <Text style={[styles.radioText, config?.theme_mode === mode && styles.radioTextActive]}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'auth' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Authentication Settings</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Razorpay Key ID</Text>
              <TextInput
                style={styles.input}
                value={config?.razorpay_key_id || ''}
                onChangeText={(text) => updateConfig('razorpay_key_id', text)}
                placeholder="Enter Razorpay Key ID"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Razorpay Key Secret</Text>
              <TextInput
                style={styles.input}
                value={config?.razorpay_key_secret || ''}
                onChangeText={(text) => updateConfig('razorpay_key_secret', text)}
                placeholder="Enter Razorpay Key Secret"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Razorpay Webhook URL</Text>
              <TextInput
                style={styles.input}
                value={config?.webhook_url || ''}
                onChangeText={(text) => updateConfig('webhook_url', text)}
                placeholder="https://your-domain.com/webhook"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payment Mode</Text>
              <View style={styles.radioGroup}>
                {['test', 'live'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.radioOption, config?.is_live_mode === (mode === 'live') && styles.radioOptionActive]}
                    onPress={() => updateConfig('is_live_mode', mode === 'live')}
                  >
                    <Text style={[styles.radioText, config?.is_live_mode === (mode === 'live') && styles.radioTextActive]}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Google OAuth Client ID</Text>
              <TextInput
                style={styles.input}
                value={config?.google_oauth_client_id || ''}
                onChangeText={(text) => updateConfig('google_oauth_client_id', text)}
                placeholder="Enter Google OAuth Client ID"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Google OAuth Client Secret</Text>
              <TextInput
                style={styles.input}
                value={config?.google_oauth_client_secret || ''}
                onChangeText={(text) => updateConfig('google_oauth_client_secret', text)}
                placeholder="Enter Google OAuth Client Secret"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supabase URL</Text>
              <TextInput
                style={styles.input}
                value={config?.supabase_url || ''}
                onChangeText={(text) => updateConfig('supabase_url', text)}
                placeholder="Enter Supabase URL"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supabase Anon Key</Text>
              <TextInput
                style={styles.input}
                value={config?.supabase_anon_key || ''}
                onChangeText={(text) => updateConfig('supabase_anon_key', text)}
                placeholder="Enter Supabase Anon Key"
                secureTextEntry
              />
            </View>
          </View>
        )}

        {activeTab === 'mobile' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mobile App Settings</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Android Package Name</Text>
              <TextInput
                style={styles.input}
                value={config?.android_package_name || ''}
                onChangeText={(text) => updateConfig('android_package_name', text)}
                placeholder="com.spiritualtablets.app"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>iOS Bundle Identifier</Text>
              <TextInput
                style={styles.input}
                value={config?.ios_bundle_identifier || ''}
                onChangeText={(text) => updateConfig('ios_bundle_identifier', text)}
                placeholder="com.spiritualtablets.app"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>App Version</Text>
              <TextInput
                style={styles.input}
                value={config?.app_version || ''}
                onChangeText={(text) => updateConfig('app_version', text)}
                placeholder="1.0.0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Build Number</Text>
              <TextInput
                style={styles.input}
                value={config?.build_number?.toString() || ''}
                onChangeText={(text) => updateConfig('build_number', parseInt(text) || 1)}
                placeholder="1"
                keyboardType="numeric"
              />
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webHeader: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  webSaveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  webSaveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  logoPreview: {
    width: 100,
    height: 60,
    marginTop: 8,
    borderRadius: 8,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  radioOptionActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  radioText: {
    fontSize: 14,
    color: '#6b7280',
  },
  radioTextActive: {
    color: '#ffffff',
  },
});