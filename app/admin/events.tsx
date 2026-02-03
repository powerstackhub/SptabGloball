import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // <-- added
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type Event = Database['public']['Tables']['events']['Row'];

export default function AdminEventsScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image_url: '',
    category: '',
    max_attendees: '',
  });

  // --- date/time picker states (added) ---
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

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
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.location || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const eventData = {
        ...formData,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update({
            ...eventData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingEvent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', date: '', location: '', image_url: '', category: '', max_attendees: '' });
      fetchEvents();
      Alert.alert('Success', `Event ${editingEvent ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      Alert.alert('Error', `Failed to ${editingEvent ? 'update' : 'add'} event`);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      location: event.location,
      image_url: event.image_url || '',
      category: event.category,
      max_attendees: event.max_attendees?.toString() || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Attempting to delete event with ID:', id);
              const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

              if (error) {
                console.error('Delete error:', error);
                throw error;
              }
              
              console.log('Event deleted successfully');
              fetchEvents();
              Alert.alert('Success', 'Event deleted successfully!');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({ title: '', description: '', date: '', location: '', image_url: '', category: '', max_attendees: '' });
  };

  // --- helper: format date/time string (added) ---
  const formatDateTime = (d: Date) => {
    const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' } as const;
    const datePart = d.toLocaleDateString(undefined, optionsDate);
    const timePart = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' } as const);
    return `${datePart} ${timePart}`;
  };

  // --- Date picker handlers (added) ---
  const onDateChange = (event: any, selected?: Date) => {
    // On Android the picker closes automatically unless you keep it open
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (!selected) {
      // dismissed
      setTempDate(null);
      return;
    }
    // Save the picked date temporarily and open time picker
    setTempDate(selected);
    // show time picker next (chain)
    setShowTimePicker(true);
  };

  const onTimeChange = (event: any, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (!selected) {
      // dismissed time picker
      setTempDate(null);
      return;
    }

    // Combine date (tempDate) and selected time
    const base = tempDate ? new Date(tempDate) : new Date();
    base.setHours(selected.getHours());
    base.setMinutes(selected.getMinutes());
    base.setSeconds(0);
    base.setMilliseconds(0);

    const formatted = formatDateTime(base);
    setFormData({ ...formData, date: formatted });
    setTempDate(null);
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Events</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Manage Events</Text>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.webAddButton}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.webAddButtonText}>Add Event</Text>
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <TextInput
              style={styles.input}
              placeholder="Event Title *"
              placeholderTextColor="#9CA3AF"             // <-- placeholder color added
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />

            {/* Description */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#9CA3AF"             // <-- placeholder color added
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
            />

            {/* Date & Time field (replaced TextInput with picker UI) */}
            {/* The field still uses formData.date so nothing else breaks */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                // open date picker first (calendar)
                setShowDatePicker(true);
                // ensure time picker is closed
                setShowTimePicker(false);
              }}
            >
              <Text style={formData.date ? styles.inputTextValue : styles.placeholderText}>
                {formData.date ? formData.date : 'Select date & time *'}  {/* <-- cleaner placeholder */}
              </Text>
            </TouchableOpacity>

            {/* Render native pickers when requested (these are only visible when triggered) */}
            {showDatePicker && (
              <DateTimePicker
                value={tempDate || new Date()}
                mode="date"
                display="calendar"
                onChange={onDateChange}
                maximumDate={new Date(2100, 12, 31)}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={tempDate || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'spinner'}
                onChange={onTimeChange}
                is24Hour={false}
              />
            )}

            {/* Location */}
            <TextInput
              style={styles.input}
              placeholder="Location *"
              placeholderTextColor="#9CA3AF"             // <-- placeholder color added
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />

            {/* Image URL */}
            <TextInput
              style={styles.input}
              placeholder="Image URL"
              placeholderTextColor="#9CA3AF"             // <-- placeholder color added
              value={formData.image_url}
              onChangeText={(text) => setFormData({ ...formData, image_url: text })}
            />

            {/* Category */}
            <TextInput
              style={styles.input}
              placeholder="Category (meditation, workshops, anandho, global) *"
              placeholderTextColor="#9CA3AF"             // <-- placeholder color added
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />

            {/* Max attendees */}
            <TextInput
              style={styles.input}
              placeholder="Max Attendees (Optional)"
              placeholderTextColor="#9CA3AF"             // <-- placeholder color added
              value={formData.max_attendees}
              onChangeText={(text) => setFormData({ ...formData, max_attendees: text })}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="#ffffff" />
              <Text style={styles.saveButtonText}>
                {editingEvent ? 'Update Event' : 'Add Event'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.eventsList}>
          {events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
                <Text style={styles.eventCategory}>Category: {event.category}</Text>
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </Text>
              </View>
              <View style={styles.eventActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(event)}
                >
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(event.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
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
    backgroundColor: '#f59e0b',
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
  addButton: {
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
  webAddButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  webAddButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  formContainer: {
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
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  // text styles used for the touchable "input" (date/time)
  placeholderText: {
    color: '#9CA3AF', // <-- placeholder color style for touchable field
    fontSize: 16,
  },
  inputTextValue: {
    color: '#111827',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  eventCard: {
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
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: '#f59e0b',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  eventCategory: {
    fontSize: 12,
    color: '#8b5cf6',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
