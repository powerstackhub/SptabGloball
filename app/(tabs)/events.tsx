import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Event = Database['public']['Tables']['events']['Row'];

const eventCategories = [
  { id: 'meditation', title: 'Meditation', color: '#22c55e' },
  { id: 'workshops', title: 'Workshops', color: '#3b82f6' },
  { id: 'anandho', title: 'Anandho Brahma', color: '#8b5cf6' },
  { id: 'global', title: 'Global Programs', color: '#f59e0b' },
  { id: 'gallery', title: 'Gallery', color: '#ec4899' },
];

export default function EventsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isWeb = Platform.OS === 'web';
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents =
    selectedCategory === 'all' ? events : events.filter((e) => e.category === selectedCategory);

  return (
    <View style={styles.container}>
      <WebHeader />

      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <Text style={styles.headerTitle}>Events</Text>
          <Text style={styles.headerSubtitle}>Discover spiritual gatherings</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.categoryText, selectedCategory === 'all' && styles.categoryTextActive]}>
            All Events
          </Text>
        </TouchableOpacity>

        {eventCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Spiritual Events</Text>
            <Text style={styles.pageSubtitle}>Join our community gatherings</Text>
          </View>
        )}

        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          filteredEvents.map((event) => {
            const id = String(event.id); // coerce to string for key + comparisons
            return (
              <TouchableOpacity key={id} style={styles.eventCard}>
                <Image
                  source={{
                    uri:
                      event.image_url ||
                      'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
                  }}
                  style={styles.eventImage}
                />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>

                  <View style={styles.eventDetail}>
                    <Calendar size={12} color="#6b7280" />
                    <Text style={styles.eventDetailText}>{String(event.date ?? '')}</Text>
                  </View>

                  <View style={styles.eventDetail}>
                    <MapPin size={12} color="#6b7280" />
                    <Text style={styles.eventDetailText}>{event.location}</Text>
                  </View>

                  {event.max_attendees != null && (
                    <View style={styles.eventDetail}>
                      <Users size={12} color="#6b7280" />
                      <Text style={styles.eventDetailText}>Max {event.max_attendees} attendees</Text>
                    </View>
                  )}
                </View>

                <ChevronRight size={16} color="#6b7280" />
              </TouchableOpacity>
            );
          })
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
    paddingTop: Platform.OS === 'web' ? 16 : 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  categoriesContainer: {
    marginTop: 12,
    marginBottom: 8,
    maxHeight: 40,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 36,
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 80,
  },
  eventImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventDetailText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
  },
});
