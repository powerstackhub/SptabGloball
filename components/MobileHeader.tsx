import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MobileHeaderProps {
  title: string;
  backgroundColor?: string;
  textColor?: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

export default function MobileHeader({
  title,
  backgroundColor = '#ffffff',
  textColor = '#111827',
  showBackButton = true,
  rightComponent,
}: MobileHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return null;
  }

  const paddingTop = Math.max(insets.top, 12) + 12;

  return (
    <View style={[styles.header, { backgroundColor, paddingTop }]}>
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={textColor === '#111827' ? '#22c55e' : textColor} />
        </TouchableOpacity>
      )}
      {!showBackButton && <View style={styles.placeholder} />}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {rightComponent || <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
});

