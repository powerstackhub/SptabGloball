import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle, Mail, Phone, ExternalLink, Book, Video } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { isMobileDevice } from '../../utils/deviceDetection';

export default function HelpScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();

  const handleContactPress = async (type: string, value: string) => {
    try {
      let url = '';
      switch (type) {
        case 'email':
          url = `mailto:${value}`;
          break;
        case 'phone':
          url = `tel:${value}`;
          break;
        case 'website':
          url = value;
          break;
      }

      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Failed to open contact:', error);
    }
  };

  const helpSections = [
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions',
      icon: MessageCircle,
      action: () => router.push('/help/faq'),
    },
    {
      id: 'tutorials',
      title: 'Video Tutorials',
      description: 'Learn how to use the app',
      icon: Video,
      action: () => router.push('/help/tutorials'),
    },
    {
      id: 'documentation',
      title: 'User Guide',
      description: 'Complete app documentation',
      icon: Book,
      action: () => router.push('/help/guide'),
    },
  ];

  const contactOptions = [
    {
      id: 'email',
      title: 'Email Support',
      value: 'support@spiritualtablets.com',
      icon: Mail,
      type: 'email',
    },
    {
      id: 'phone',
      title: 'Phone Support',
      value: '+1-800-SPIRITUAL',
      icon: Phone,
      type: 'phone',
    },
    {
      id: 'website',
      title: 'Visit Website',
      value: 'https://spiritualtablets.com',
      icon: ExternalLink,
      type: 'website',
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Help & Support</Text>
            <Text style={styles.pageSubtitle}>Get help and find answers</Text>
          </View>
        )}

        <View style={styles.helpContainer}>
          <Text style={styles.sectionTitle}>Self Help</Text>
          {helpSections.map((section) => {
            const Icon = section.icon;
            return (
              <TouchableOpacity key={section.id} style={styles.helpCard} onPress={section.action}>
                <View style={styles.helpIcon}>
                  <Icon size={20} color="#22c55e" />
                </View>
                <View style={styles.helpInfo}>
                  <Text style={styles.helpTitle}>{section.title}</Text>
                  <Text style={styles.helpDescription}>{section.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {contactOptions.map((contact) => {
            const Icon = contact.icon;
            return (
              <TouchableOpacity 
                key={contact.id} 
                style={styles.contactCard}
                onPress={() => handleContactPress(contact.type, contact.value)}
              >
                <View style={styles.contactIcon}>
                  <Icon size={20} color="#22c55e" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{contact.title}</Text>
                  <Text style={styles.contactValue}>{contact.value}</Text>
                </View>
                <ExternalLink size={16} color="#6b7280" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Support</Text>
          <Text style={styles.infoText}>
            Our support team is available to help you with any questions or issues you may have. 
            We typically respond to inquiries within 24 hours.
          </Text>
          <Text style={styles.infoText}>
            For urgent matters, please call our phone support line during business hours.
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
  helpContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  helpCard: {
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
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpInfo: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  helpDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  contactContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  contactCard: {
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
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
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