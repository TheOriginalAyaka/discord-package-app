import { useTheme } from "./ThemeProvider";

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
