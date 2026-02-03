import { Platform, Dimensions } from 'react-native';

export const isMobileDevice = () => {
  if (Platform.OS !== 'web') return true;
  
  // Check if running in mobile browser
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent;
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth < 1024; // Increased threshold for mobile layout
    
    return isMobileUserAgent || isSmallScreen;
  }
  
  return false;
};

export const isWebDesktop = () => {
  return Platform.OS === 'web' && !isMobileDevice();
};