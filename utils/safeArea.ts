import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Hook to get safe area padding for mobile headers
 * Returns paddingTop value that accounts for device safe areas (notches, status bars, etc.)
 * Use this instead of hardcoded paddingTop: 50
 */
export function useSafeHeaderPadding() {
  const insets = useSafeAreaInsets();
  
  // For mobile devices, use safe area insets
  // For web, use a minimal padding
  if (Platform.OS === 'web') {
    return 12;
  }
  
  // Add extra padding (12px) below the safe area for visual spacing
  return Math.max(insets.top, 12) + 12;
}

/**
 * Get safe area padding value (non-hook version for use in StyleSheet)
 * Note: This returns a default value. For dynamic values, use useSafeHeaderPadding hook
 */
export function getSafeHeaderPadding(): number {
  if (Platform.OS === 'web') {
    return 12;
  }
  // Default safe padding for older devices
  return 50;
}

