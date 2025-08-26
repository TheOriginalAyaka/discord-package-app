import { useTheme } from "./ThemeProvider";

// hook for quick theme switching
export function useThemeControls() {
  const { mode, setMode, isDark } = useTheme();

  const toggleTheme = () => {
    setMode(isDark ? "light" : "dark");
  };

  const setLightMode = () => setMode("light");
  const setDarkMode = () => setMode("dark");
  const setSystemMode = () => setMode("system");

  return {
    mode,
    isDark,
    toggleTheme,
    setLightMode,
    setDarkMode,
    setSystemMode,
  };
}
