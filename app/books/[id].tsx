import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Download, BookOpen } from 'lucide-react-native';
import WebHeader from '../../components/WebHeader';
import PDFViewer from '../../components/PDFViewer';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Book = Database['public']['Tables']['books']['Row'];

const { width, height } = Dimensions.get('window');

export default function BookReaderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isWeb = Platform.OS === 'web';
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error('Failed to fetch book:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <WebHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading book...</Text>
        </View>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <WebHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Book not found</Text>
        </View>
      </View>
    );
  }

  if (showPDF && book?.pdf_url) {
    return (
      <View style={styles.container}>
        <WebHeader />
        
        {!isWeb && (
          <View style={styles.mobileHeader}>
            <TouchableOpacity onPress={() => setShowPDF(false)} style={styles.backButton}>
              <ArrowLeft size={24} color="#22c55e" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{book.title}</Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={20} color="#22c55e" />
            </TouchableOpacity>
          </View>
        )}
        
        <PDFViewer uri={book.pdf_url} style={styles.pdfViewer} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebHeader />
      
      {!isWeb && (
        <View style={styles.mobileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{book.title}</Text>
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={20} color="#22c55e" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.readerContainer}>
        <ScrollView style={styles.bookContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
          <Text style={styles.bookDescription}>{book.description}</Text>
          
          <TouchableOpacity 
            style={styles.readPDFButton}
            onPress={() => setShowPDF(true)}
          >
            <BookOpen size={20} color="#ffffff" />
            <Text style={styles.readPDFButtonText}>Read Full PDF</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pdfViewer: {
    flex: 1,
  },
  bookContent: {
    flex: 1,
    padding: 24,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  bookDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 24,
  },
  readPDFButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  readPDFButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
