// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  }),
});

// Request notification permissions
export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get notification permissions');
      return false;
    }
    return true;
  } else {
    console.log('Must use a physical device for notifications');
    return false;
  }
}

// Schedule a daily notification
export async function scheduleDailyNotification() {
  // Cancel any existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule 2-3 random times throughout the day
  const times = [
    { hour: 10, minute: 0 },  // 10 AM
    { hour: 15, minute: 30 }, // 3:30 PM
    { hour: 20, minute: 0 },  // 8 PM
  ];

  // Select 2-3 random times
  const selectedTimes = times
    .sort(() => 0.5 - Math.random())
    .slice(0, 2 + Math.floor(Math.random() * 2));

  for (const time of selectedTimes) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Daily Inspiration',
        body: getRandomQuote(),
        data: { type: 'daily_quote' },
      },
      trigger: {
        type: 'daily',
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      },
    });
  }
}

// Get a random quote
const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Life is what happens when you're busy making other plans. - John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
];

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}