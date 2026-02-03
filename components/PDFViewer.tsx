import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface PDFViewerProps {
  uri: string;
  style?: any;
}

export default function PDFViewer({ uri, style }: PDFViewerProps) {
  // For Google Drive links, convert to embeddable format
  const getEmbeddableUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      // Extract file ID from Google Drive URL
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    
    // For other URLs, use Google Docs Viewer
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
  };

  const embeddableUrl = getEmbeddableUrl(uri);

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ uri: embeddableUrl }}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});