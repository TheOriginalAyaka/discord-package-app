// no imports needed

export const FONT_FAMILY = "ggsans";

export const fontWeights = {
  regular: "Regular",
  medium: "Medium",
  semibold: "Semibold",
  bold: "Bold",
} as const;

export function getFontStyle(weight: keyof typeof fontWeights = "regular") {
  const psSuffix = fontWeights[weight];
  // Use PostScript family name on both platforms, e.g. "ggsans-Bold"
  const postScriptName = `${FONT_FAMILY}-${psSuffix}`;
  return {
    fontFamily: postScriptName,
  };
}
