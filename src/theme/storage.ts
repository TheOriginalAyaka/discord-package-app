import Storage from "expo-native-storage";
import type { ThemeMode } from "./colors";

export function saveThemeMode(mode: ThemeMode): void {
  try {
    Storage.setItemSync("@theme_mode", mode);
  } catch (error) {
    console.error("Failed to save theme mode:", error);
    // continue without throwing since it's not critical
  }
}

export function loadThemeMode(): ThemeMode | null {
  try {
    const saved = Storage.getItemSync("@theme_mode");
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return null;
  } catch (error) {
    console.error("Failed to load theme mode:", error);
    return null;
  }
}
