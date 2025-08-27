import { useFonts } from "expo-font";

export const FONT_FAMILY = "ggsans";

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

// hook
export function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    [`${FONT_FAMILY}-Regular`]: require("@/assets/fonts/ggsans-Regular.ttf"),
    [`${FONT_FAMILY}-Medium`]: require("@/assets/fonts/ggsans-Medium.ttf"),
    [`${FONT_FAMILY}-SemiBold`]: require("@/assets/fonts/ggsans-Semibold.ttf"),
    [`${FONT_FAMILY}-Bold`]: require("@/assets/fonts/ggsans-Bold.ttf"),
  });

  return fontsLoaded;
}

export function getFontStyle(weight: keyof typeof fontWeights = "regular") {
  let fontFamily: string;

  switch (weight) {
    case "bold":
      fontFamily = `${FONT_FAMILY}-Bold`;
      break;
    case "semibold":
      fontFamily = `${FONT_FAMILY}-SemiBold`;
      break;
    case "medium":
      fontFamily = `${FONT_FAMILY}-Medium`;
      break;
    default:
      fontFamily = `${FONT_FAMILY}-Regular`;
      break;
  }

  return {
    fontFamily,
    fontWeight: fontWeights[weight],
  };
}