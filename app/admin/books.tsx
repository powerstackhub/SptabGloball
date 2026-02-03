import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash2, Save, X } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { isMobileDevice } from '../../utils/deviceDetection';
import WebHeader from '../../components/WebHeader';

type Book = Database['public']['Tables']['books']['Row'];

export default function AdminBooksScreen() {
  const router = useRouter();
  const isMobile = isMobileDevice();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    pdf_url: '',
    thumbnail_url: '',
    language: 'english',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.author || !formData.pdf_url || !formData.language) {
      Alert.alert('Error', 'Please fill required fields (Title, Author, PDF URL, Language)');
      return;
    }

    try {
      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingBook.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('books')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', description: '', pdf_url: '', thumbnail_url: '', language: 'english' });
      fetchBooks();
      Alert.alert('Success', `Book ${editingBook ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Book save error:', error);
      Alert.alert('Error', `Failed to ${editingBook ? 'update' : 'add'} book`);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      pdf_url: book.pdf_url,
      thumbnail_url: book.thumbnail_url || '',
      language: book.language || 'english',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('books')
                .delete()
                .eq('id', id);

              if (error) throw error;

              fetchBooks();
              Alert.alert('Success', 'Book deleted successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({ title: '', author: '', description: '', pdf_url: '', thumbnail_url: '', language: 'english' });
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {(Platform.OS !== 'web' || isMobile) && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Books</Text>
          <TouchableOpacity onPress={() => setShowForm(true)} style={styles.addButton}>
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {(!isMobile && Platform.OS === 'web') && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Manage Books</Text>
            <TouchableOpacity onPress={() => setShowForm(true)} style={styles.webAddButton}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.webAddButtonText}>Add Book</Text>
            </TouchableOpacity>
          </View>
        )}

        {showForm && (
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

					   <TextInput
			  style={styles.input}
			  placeholder="Enter Book Title *"
			  placeholderTextColor="#9ca3af"
			  value={formData.title}
			  onChangeText={(text) => setFormData({ ...formData, title: text })}
			/>

			<TextInput
			  style={styles.input}
			  placeholder="Enter Author Name *"
			  placeholderTextColor="#9ca3af"
			  value={formData.author}
			  onChangeText={(text) => setFormData({ ...formData, author: text })}
			/>

			<TextInput
			  style={[styles.input, styles.textArea]}
			  placeholder="Book Description"
			  placeholderTextColor="#9ca3af"
			  value={formData.description}
			  onChangeText={(text) => setFormData({ ...formData, description: text })}
			  multiline
			  numberOfLines={3}
			/>

			<TextInput
			  style={styles.input}
			  placeholder="Enter PDF Link *"
			  placeholderTextColor="#9ca3af"
			  value={formData.pdf_url}
			  onChangeText={(text) => setFormData({ ...formData, pdf_url: text })}
			/>

			<TextInput
			  style={styles.input}
			  placeholder="Enter Thumbnail Image URL"
			  placeholderTextColor="#9ca3af"
			  value={formData.thumbnail_url}
			  onChangeText={(text) => setFormData({ ...formData, thumbnail_url: text })}
			/>


            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Language *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScrollView}>
                <View style={styles.languageOptions}>
                  {['english', 'tamil', 'hindi', 'telugu', 'kannada', 'malayalam'].map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.languageOption,
                        formData.language === lang && styles.languageOptionActive
                      ]}
                      onPress={() => setFormData({ ...formData, language: lang })}
                    >
                      <Text
                        style={[
                          styles.languageText,
                          formData.language === lang && styles.languageTextActive
                        ]}
                      >
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={16} color="#ffffff" />
              <Text style={styles.saveButtonText}>
                {editingBook ? 'Update Book' : 'Add Book'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.booksList}>
          {books.map((book) => (
            <View key={book.id} style={styles.bookCard}>
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>by {book.author}</Text>
                <Text style={styles.bookLanguage}>Language: {book.language || 'english'}</Text>
                <Text style={styles.bookDescription} numberOfLines={2}>
                  {book.description}
                </Text>
              </View>
              <View style={styles.bookActions}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(book)}>
                  <Edit size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(book.id)}>
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
  container: { flex: 1, backgroundColor: '#f9fafb' },
  mobileHeader: {
    backgroundColor: '#6366f1',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  addButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  webHeader: {
    paddingHorizontal: 24, paddingVertical: 32,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  pageTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827' },
  webAddButton: {
    backgroundColor: '#6366f1', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  webAddButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { flex: 1 },
  formContainer: {
    backgroundColor: '#fff', marginHorizontal: 20, marginTop: 20,
    borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  input: {
    backgroundColor: '#f9fafb', borderRadius: 8,
    padding: 12, marginBottom: 12,
    fontSize: 16, color: '#111827',
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#6366f1', borderRadius: 8,
    paddingVertical: 12, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  languageScrollView: { maxHeight: 50 },
  languageOptions: { flexDirection: 'row', paddingRight: 20 },
  languageOption: {
    backgroundColor: '#f3f4f6', borderRadius: 16,
    paddingHorizontal: 12, paddingVertical: 6,
    marginRight: 8, borderWidth: 1, borderColor: '#e5e7eb',
  },
  languageOptionActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  languageText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  languageTextActive: { color: '#fff' },
  booksList: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  bookCard: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, marginBottom: 12,
    flexDirection: 'row', paddingRight: 20,
    justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  bookAuthor: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  bookDescription: { fontSize: 12, color: '#9ca3af' },
  bookActions: { flexDirection: 'row', gap: 8 },
  editButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center',
  },
  deleteButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center',
  },
});
