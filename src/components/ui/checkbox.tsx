import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  type StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  type ViewStyle,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@/src/theme";

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function Checkbox({
  value,
  onValueChange,
  disabled = false,
  style,
}: CheckboxProps) {
  const { theme } = useTheme();

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgScale = useRef(new Animated.Value(value ? 1 : 0)).current;
  const bgOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const checkScale = useRef(new Animated.Value(value ? 1 : 0)).current;
  const checkOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderOpacity = useRef(new Animated.Value(value ? 0 : 1)).current;

  // Handle animations when value changes
  useEffect(() => {
    if (value) {
      // Animate to checked state
      Animated.parallel([
        // Background scales up and fades in
        Animated.timing(bgScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bgOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        // Checkmark scales up and fades in with slight delay
        Animated.timing(checkScale, {
          toValue: 1,
          duration: 200,
          delay: 50,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 150,
          delay: 50,
          useNativeDriver: true,
        }),
        // Border fades out quickly
        Animated.timing(borderOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate to unchecked state
      Animated.parallel([
        // Background scales down slowly
        Animated.timing(bgScale, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        // Background fades out very quickly
        Animated.timing(bgOpacity, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
        // Checkmark scales down
        Animated.timing(checkScale, {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        // Checkmark fades out immediately
        Animated.timing(checkOpacity, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
        // Border fades in after other elements are mostly gone
        Animated.timing(borderOpacity, {
          toValue: 1,
          duration: 150,
          delay: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [value, bgScale, bgOpacity, checkScale, checkOpacity, borderOpacity]);

  // Handle press
  const handlePress = () => {
    if (!disabled) {
      // Small scale animation for feedback
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onValueChange(!value);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <Animated.View
        style={[
          styles.container,
          style,
          disabled && styles.disabled,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Border layer */}
        <Animated.View
          style={[
            styles.border,
            {
              borderColor: theme.secondary,
              opacity: borderOpacity,
            },
          ]}
        />

        {/* Background layer */}
        <Animated.View
          style={[
            styles.background,
            {
              backgroundColor: theme.accent,
              opacity: bgOpacity,
              transform: [{ scale: bgScale }],
            },
          ]}
        />

        {/* Checkmark */}
        <Animated.View
          style={[
            styles.checkContainer,
            {
              opacity: checkOpacity,
              transform: [{ scale: checkScale }],
            },
          ]}
        >
          <MaterialIcons name="check" size={16} color={theme.primary} />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
  },
  background: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 8,
  },
  checkContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
