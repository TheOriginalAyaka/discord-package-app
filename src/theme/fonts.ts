export const FONT_FAMILY = "ggsans";

export const fontWeights = {
  regular: "Normal",
  medium: "Medium",
  semibold: "Semibold",
  bold: "Bold",
} as const;

export function getFontStyle(weight: keyof typeof fontWeights = "regular") {
  const psSuffix = fontWeights[weight];
  const postScriptName = `${FONT_FAMILY}-${psSuffix}`;
  return {
    fontFamily: postScriptName,
  };
}
