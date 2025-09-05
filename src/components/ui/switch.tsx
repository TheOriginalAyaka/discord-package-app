import { useEffect, useRef } from "react";
import {
  Animated,
  type StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@/src/theme";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  thumbStyle?: StyleProp<ViewStyle>;
}

export default function Toggle({
  value,
  onValueChange,
  disabled = false,
  style,
  thumbStyle,
}: ToggleProps) {
  const { theme } = useTheme();

  // anim
  const positionAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const backgroundAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // icon
  const crossOpacity = useRef(new Animated.Value(value ? 0 : 1)).current;
  const checkOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const checkScale = useRef(new Animated.Value(value ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.spring(positionAnim, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    Animated.timing(backgroundAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    // icon anim
    if (value) {
      Animated.parallel([
        Animated.timing(crossOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 200,
          delay: 50,
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          tension: 200,
          friction: 10,
          delay: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(checkOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(checkScale, {
          toValue: 0.5,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(crossOpacity, {
          toValue: 1,
          duration: 200,
          delay: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    value,
    positionAnim,
    backgroundAnim,
    crossOpacity,
    checkOpacity,
    checkScale,
  ]);

  const handlePress = () => {
    if (!disabled) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
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

  const thumbTranslateX = positionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.surface, theme.accent],
  });

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.container, style, disabled && { opacity: 0.5 }]}>
        <Animated.View
          style={[
            styles.track,
            {
              backgroundColor,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              thumbStyle,
              {
                transform: [
                  { translateX: thumbTranslateX },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: crossOpacity,
                },
              ]}
            >
              <MaterialIcons name="close" size={16} color={theme.surface} />
            </Animated.View>

            <Animated.View
              style={[
                styles.iconContainer,
                {
                  opacity: checkOpacity,
                  transform: [{ scale: checkScale }],
                },
              ]}
            >
              <MaterialIcons name="check" size={16} color={theme.accent} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 32,
  },
  track: {
    width: 48,
    height: 32,
    borderRadius: 16,
    padding: 4,
    justifyContent: "center",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
