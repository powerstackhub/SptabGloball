// utils/reload.ts
import { Platform, DevSettings } from "react-native";
import * as Updates from "expo-updates";

export function reloadAfter2s() {
  setTimeout(async () => {
    if (Platform.OS === "web") {
      window.location.reload();
      return;
    }

    if (__DEV__) {
      DevSettings.reload();
      return;
    }

    try {
      await Updates.reloadAsync();   // Android prod
    } catch {
      DevSettings.reload();          // fallback
    }
  }, 500);
}
