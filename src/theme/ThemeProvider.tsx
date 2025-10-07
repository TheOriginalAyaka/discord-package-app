import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme, type Theme, type ThemeMode } from "./colors";
import { loadThemeMode, saveThemeMode } from "./storage";

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  actualTheme: "light" | "dark";
  systemTheme: "light" | "dark" | null;
  isLoading: boolean;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultMode = "dark",
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [isLoading, setIsLoading] = useState(true);

  // Expo treats null as light
  const systemTheme = systemColorScheme || "light";

  const actualTheme = mode === "system" ? systemTheme : mode;
  const isDark = actualTheme === "dark";
  const theme = isDark ? darkTheme : lightTheme;

  // load saved theme preference on mount (if there is one)
  useEffect(() => {
    loadThemeMode().then((savedMode) => {
      if (savedMode) {
        setModeState(savedMode);
      }
      setIsLoading(false);
    });
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await saveThemeMode(newMode);
  };

  const value: ThemeContextType = {
    theme,
    mode,
    actualTheme,
    systemTheme,
    isLoading,
    isDark,
    setMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
