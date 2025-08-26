import type React from "react";
import { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, type Theme, type ThemeMode } from "./colors";

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultMode = "system",
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const isDark =
    mode === "system" ? systemColorScheme === "dark" : mode === "dark";

  const theme: Theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    mode,
    setMode,
    isDark,
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
