import Storage from "expo-native-storage";
import type { ThemeMode } from "./colors";

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  try {
    await Storage.setItem("@theme_mode", mode);
  } catch (error) {
    console.error("Failed to save theme mode:", error);
    // continue without throwing since it's not critical
  }
}

export async function loadThemeMode(): Promise<ThemeMode | null> {
  try {
    const saved = await Storage.getItem("@theme_mode");
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return null;
  } catch (error) {
    console.error("Failed to load theme mode:", error);
    return null;
  }
}
