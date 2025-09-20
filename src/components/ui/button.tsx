import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";

import { TText, useTheme } from "@/src/theme";

// context for button text color
const ButtonContext = createContext<{ textColor: string }>({
  textColor: "#000",
});

export const useButtonContext = () => useContext(ButtonContext);

interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "active";
  disabled?: boolean;
}

// usage:
//
// <Button variant="primary" onPress={onPickFile}>
//   <ButtonText weight="semibold">
//     Choose Package
//   </ButtonText>
// </Button>

export default function Button({
  children,
  onPress,
  style,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const { theme, isDark } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const getBg = () => {
    if (isDark) {
      switch (variant) {
        case "primary":
          return theme.accent;
        case "secondary":
          return "rgba(255, 255, 255, 0.3)";
        case "tertiary":
          return "rgba(255, 255, 255, 0.2)";
        case "destructive":
          return theme.error;
        case "active":
          return theme.success;
        default:
          return theme.accent;
      }
    } else {
      switch (variant) {
        case "primary":
          return theme.accent;
        case "secondary":
          return "#ffffff";
        case "tertiary":
          return "rgba(255, 255, 255, 0.5)";
        case "destructive":
          return theme.error;
        case "active":
          return theme.success;
        default:
          return theme.accent;
      }
    }
  };

  const getTextColor = () => {
    if (isDark) {
      switch (variant) {
        case "secondary":
        case "tertiary":
          return theme.secondary;
        default:
          return "#ffffff";
      }
    } else {
      switch (variant) {
        case "secondary":
        case "tertiary":
          return theme.secondary;
        case "primary":
        case "destructive":
        case "active":
          return "#ffffff";
        default:
          return "#ffffff";
      }
    }
  };

  // animation stuff
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isPressed ? 0.98 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 20,
    }).start();

    Animated.timing(overlayOpacity, {
      toValue: isPressed ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isPressed, scaleAnim, overlayOpacity]);

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      onPressIn={() => !disabled && setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.button, style]}
      activeOpacity={1}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {/* bg layer */}
        <View style={[styles.backgroundLayer, { backgroundColor: getBg() }]} />

        {/* press overlay */}
        <Animated.View
          style={[
            styles.overlayLayer,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
              opacity: overlayOpacity,
            },
          ]}
        />

        {/* children */}
        <View style={styles.contentLayer}>
          <ButtonContext.Provider value={{ textColor: getTextColor() }}>
            {children}
          </ButtonContext.Provider>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// button text helper for easier color stuff
export function ButtonText({
  children,
  style,
  weight = "medium",
  ...props
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  weight?: "regular" | "medium" | "semibold" | "bold";
}) {
  const { textColor } = useButtonContext();

  return (
    <TText color={textColor} weight={weight} style={style} {...props}>
      {children}
    </TText>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    width: "100%",
    overflow: "hidden",
  },
  buttonContainer: {
    flex: 1,
    borderRadius: 48,
  },
  backgroundLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  overlayLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  contentLayer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
});
