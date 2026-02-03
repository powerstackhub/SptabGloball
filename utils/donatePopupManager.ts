import AsyncStorage from '@react-native-async-storage/async-storage';

const DONATE_POPUP_KEY = 'donate_popup_shown_time';

export const donatePopupManager = {
  async shouldShowDonatePopup(): Promise<boolean> {
    try {
      const lastShownTime = await AsyncStorage.getItem(DONATE_POPUP_KEY);

      if (!lastShownTime) {
        return true;
      }

      const lastTime = parseInt(lastShownTime, 10);
      const now = Date.now();
      const tenMinutesInMs = 10 * 60 * 1000;

      return now - lastTime >= tenMinutesInMs;
    } catch (err) {
      console.error('[DonatePopupManager] Error checking popup:', err);
      return true;
    }
  },

  async markDonatePopupShown(): Promise<void> {
    try {
      await AsyncStorage.setItem(DONATE_POPUP_KEY, Date.now().toString());
    } catch (err) {
      console.error('[DonatePopupManager] Error marking popup shown:', err);
    }
  },

  async resetDonatePopup(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DONATE_POPUP_KEY);
    } catch (err) {
      console.error('[DonatePopupManager] Error resetting popup:', err);
    }
  },
};
