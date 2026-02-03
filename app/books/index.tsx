import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, Download } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Book = Database['public']['Tables']['books']['Row'];

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const getCardWidth = () => {
  if (isWeb) {
    if (width > 1200) return (width - 200) / 3;
    if (width > 768) return (width - 120) / 2;
    return width - 80;
  }
  return width - 40;
};

export default function BooksScreen() {
  const router = useRouter();
  const cardWidth = getCardWidth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (selectedLanguage === 'all') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.language === selectedLanguage));
    }
  }, [books, selectedLanguage]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {!isWeb && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Books</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isWeb && (
          <View style={styles.webHeader}>
            <Text style={styles.pageTitle}>Spiritual Books</Text>
            <Text style={styles.pageSubtitle}>Discover wisdom through reading</Text>
          </View>
        )}

        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filter by Language</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageFilter}>
            <TouchableOpacity
              style={[styles.filterChip, selectedLanguage === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedLanguage('all')}
            >
              <Text style={[styles.filterText, selectedLanguage === 'all' && styles.filterTextActive]}>
                All Languages
              </Text>
            </TouchableOpacity>
            {['english', 'tamil', 'hindi', 'telugu', 'kannada', 'malayalam', 'vietnamese'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.filterChip, selectedLanguage === lang && styles.filterChipActive]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text style={[styles.filterText, selectedLanguage === lang && styles.filterTextActive]}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.booksGrid}>
          {filteredBooks.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={[styles.bookCard, { width: cardWidth }]}
              onPress={() => handleBookPress(book.id)}
            >
              <Image 
                source={{ 
                  uri: book.thumbnail_url || 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=300' 
                }} 
                style={styles.bookThumbnail} 
              />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>by {book.author}</Text>
                <Text style={styles.bookLanguage}>{book.language || 'english'}</Text>
                <Text style={styles.bookDescription} numberOfLines={2}>
                  {book.description}
                </Text>
                <TouchableOpacity
                  style={styles.readButton}
                  onPress={() => handleBookPress(book.id)}
                >
                  <BookOpen size={16} color="#ffffff" />
                  <Text style={styles.readButtonText}>Read Book</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  languageFilter: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  bookCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bookThumbnail: {
    width: '100%',
    height: 160,
  },
  bookInfo: {
    padding: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  bookLanguage: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    marginBottom: 8,
  },
  bookDescription: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
    marginBottom: 12,
  },
  readButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  readButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});