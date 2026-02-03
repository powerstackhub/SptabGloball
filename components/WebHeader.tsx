import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { User, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { isMobileDevice } from '../utils/deviceDetection';
import { useAuth } from '../contexts/AuthContext';

interface WebHeaderProps {
  // Remove isLoggedIn prop as we'll get it from context
}

export default function WebHeader({}: WebHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, signOut, appConfig } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const isMobile = isMobileDevice();

  const menuItems = [
    { title: 'Home', route: '/' },
    { title: 'Events', route: '/events' },
    { title: 'About', route: '/about' },
    { title: 'Donate', route: '/donate-tab' },
  ];

  const handleProfileClick = () => {
    if (profile) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowProfileMenu(false);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show mobile header for mobile devices even on web
  if (Platform.OS !== 'web' || isMobile) return null;

  return (
    <View style={[styles.header, appConfig?.primary_color && { borderBottomColor: appConfig.primary_color }]}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {appConfig?.app_logo_url ? (
            <Image
              source={{ uri: appConfig.app_logo_url }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.navigation}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.navItem,
                pathname === item.route && [styles.navItemActive, appConfig?.primary_color && { backgroundColor: `${appConfig.primary_color}20` }],
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <Text
                style={[
                  styles.navText,
                  pathname === item.route && [styles.navTextActive, appConfig?.primary_color && { color: appConfig.primary_color }],
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfileClick}>
            {profile ? (
              <>
                <User size={20} color={appConfig?.primary_color || "#22c55e"} />
                <ChevronDown size={16} color={appConfig?.primary_color || "#22c55e"} />
              </>
            ) : (
              <Text style={[styles.loginText, appConfig?.primary_color && { color: appConfig.primary_color }]}>Login</Text>
            )}
          </TouchableOpacity>

          {showProfileMenu && profile && (
            <View style={styles.profileMenu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push('/(tabs)/profile');
                  setShowProfileMenu(false);
                }}
              >
                <Text style={styles.menuItemText}>Profile</Text>
              </TouchableOpacity>
              {profile.role === 'admin' && (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    router.push('/admin');
                    setShowProfileMenu(false);
                  }}
                >
                  <Text style={styles.menuItemText}>Admin Panel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push('/profile/settings');
                  setShowProfileMenu(false);
                }}
              >
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogout}
              >
                <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    zIndex: 2000,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  leftSection: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 40,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#f0fdf4',
  },
  navText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#22c55e',
    fontWeight: '600',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'relative',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  loginText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '600',
  },
  profileMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 150,
    zIndex: 9999,
  },

  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    fontSize: 14,
    color: '#374151',
  },
  logoutText: {
    color: '#ef4444',
  },
});