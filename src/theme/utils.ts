import { useTheme } from "./ThemeProvider";

export function useThemeControls() {
  const { mode, actualTheme, systemTheme, isDark, setMode } = useTheme();

  const toggleTheme = () => {
    setMode(isDark ? "light" : "dark");
  };

  const setLightMode = () => setMode("light");
  const setDarkMode = () => setMode("dark");
  const setSystemMode = () => setMode("system");

  return {
    mode,
    actualTheme,
    systemTheme,
    isDark,
    toggleTheme,
    setLightMode,
    setDarkMode,
    setSystemMode,
  };
}
