export const lightTheme = {
  background: "#f2f4f5",
  foreground: "#ffffff",
  surface: "#e5e5e5",

  primary: "#000000",
  secondary: "rgba(0, 0, 0, 0.8)",
  tertiary: "rgba(0, 0, 0, 0.6)",
  muted: "rgba(0, 0, 0, 0.4)",

  accent: "#5865F2",
  accentForeground: "#ffffff",

  border: "rgba(0, 0, 0, 0.1)",
  divider: "rgba(0, 0, 0, 0.05)",

  success: "#32985c",
  warning: "#ffa714",
  error: "#e8483a",

  card: "#ffffff",
  cardPressed: "#e1e1e1",
} as const;

export const darkTheme = {
  background: "#1b1d23",
  foreground: "#262730",
  surface: "#4E5058",

  primary: "#ffffff",
  secondary: "rgba(255, 255, 255, 0.8)",
  tertiary: "rgba(255, 255, 255, 0.6)",
  muted: "rgba(255, 255, 255, 0.4)",

  accent: "#546cf8",
  accentForeground: "#ffffff",

  border: "rgba(255, 255, 255, 0.1)",
  divider: "rgba(255, 255, 255, 0.1)",

  success: "#21763e",
  warning: "#ffa714",
  error: "#d73034",

  card: "#262730",
  cardPressed: "#35363f",
} as const;

export type Theme = {
  background: string;
  foreground: string;
  surface: string;

  primary: string;
  secondary: string;
  tertiary: string;
  muted: string;

  accent: string;
  accentForeground: string;

  border: string;
  divider: string;

  success: string;
  warning: string;
  error: string;

  card: string;
  cardPressed: string;
};
export type ThemeMode = "light" | "dark" | "system";
