import {
  Text as RNText,
  View as RNView,
  type TextProps as RNTextProps,
  type ViewProps as RNViewProps,
} from "react-native";
import { useTheme } from "./ThemeProvider";
import { getFontStyle } from "./fonts";

type ColorVariant = "primary" | "secondary" | "tertiary" | "muted" | "accent";
type BackgroundVariant =
  | "background"
  | "foreground"
  | "surface"
  | "card"
  | "cardPressed";
type FontWeight = "regular" | "medium" | "semibold" | "bold";

interface ThemedTextProps extends RNTextProps {
  variant?: ColorVariant;
  color?: string;
  weight?: FontWeight;
}

interface ThemedViewProps extends RNViewProps {
  variant?: BackgroundVariant;
  backgroundColor?: string;
}

export function Text({
  variant = "primary",
  color,
  weight = "regular",
  style,
  ...props
}: ThemedTextProps) {
  const { theme } = useTheme();

  const textColor = color || theme[variant];

  const fontStyle = getFontStyle(weight);

  return <RNText style={[{ color: textColor }, fontStyle, style]} {...props} />;
}

export function View({
  variant,
  backgroundColor,
  style,
  ...props
}: ThemedViewProps) {
  const { theme } = useTheme();

  const bgColor = backgroundColor || (variant ? theme[variant] : undefined);

  return (
    <RNView
      style={[bgColor && { backgroundColor: bgColor }, style]}
      {...props}
    />
  );
}

export function Card({ children, style, ...props }: RNViewProps) {
  return (
    <View
      variant="card"
      style={[{ borderRadius: 16, padding: 16 }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export function Surface({ children, style, ...props }: RNViewProps) {
  return (
    <View variant="surface" style={style} {...props}>
      {children}
    </View>
  );
}
