import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe';

interface YouTubePlayerProps {
  videoId: string;
  style?: any;
}

const { width } = Dimensions.get('window');

export default function YouTubePlayer({ videoId, style }: YouTubePlayerProps) {
  // Extract video ID from YouTube URL if full URL is provided
  const getVideoId = (url: string) => {
    if (!url) return '';
    
    // If it's already a video ID (11 characters, alphanumeric)
    if (!url.includes('http') && url.length === 11) {
      return url;
    }
    
    // Extract from various YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      const match = url.match(/[?&]v=([^&]+)/);
      return match ? match[1] : '';
    }
    if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([^?]+)/);
      return match ? match[1] : '';
    }
    if (url.includes('youtube.com/embed/')) {
      const match = url.match(/embed\/([^?]+)/);
      return match ? match[1] : '';
    }
    if (url.includes('youtube.com/v/')) {
      const match = url.match(/\/v\/([^?]+)/);
      return match ? match[1] : '';
    }
    
    // Try regex pattern matching
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const extractedVideoId = getVideoId(videoId);
  
  // Calculate height based on 16:9 aspect ratio
  const playerHeight = style?.height || width * 9 / 16;

  if (!extractedVideoId) {
    return (
      <View style={[styles.container, style, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Text style={styles.errorExclamation}>!</Text>
          </View>
          <View style={styles.errorTextContainer}>
            <Text style={styles.errorLinkText}>Watch video on YouTube</Text>
            <Text style={styles.errorCode}>Error 153</Text>
            <Text style={styles.errorMessage}>Video player configuration error</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <YouTubeIframe
        height={playerHeight}
        videoId={extractedVideoId}
        play={false}
        onChangeState={(state) => {
          // Handle state changes if needed
          if (state === 'error') {
            console.error('YouTube player error');
          }
        }}
        onError={(error) => {
          console.error('YouTube player error:', error);
        }}
        webViewStyle={{ opacity: 0.99 }}
        webViewProps={{
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  errorExclamation: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  errorTextContainer: {
    flex: 1,
  },
  errorLinkText: {
    fontSize: 14,
    color: '#ffffff',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
});