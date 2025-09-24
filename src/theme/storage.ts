import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeMode } from "./colors";

const THEME_MODE_KEY = "@theme_mode";

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_MODE_KEY, mode);
  } catch (error) {
    console.error("Failed to save theme mode:", error);
    // this will continue without throwing because it's not a critical error
  }
}

export async function loadThemeMode(): Promise<ThemeMode | null> {
  try {
    const saved = await AsyncStorage.getItem(THEME_MODE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return null;
  } catch (error) {
    console.error("Failed to load theme mode:", error);
    return null;
  }
}
