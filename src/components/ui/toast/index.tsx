import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TText, useTheme } from "@/src/theme";

export interface ToastProps {
  icon?: string;
  src?: string;
  text: string;
  duration?: number;
  onDismiss?: () => void;
  shouldDismiss?: boolean;
}

export default function Toast({
  icon,
  src,
  text,
  duration: _duration = 2,
  onDismiss,
  shouldDismiss,
}: ToastProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [isDismissing, setIsDismissing] = useState(false);

  if (icon && src) {
    throw new Error(
      "Toast: Cannot provide both 'icon' and 'src' props. Only one is allowed.",
    );
  }

  // adjust distance
  const targetY = useMemo(() => (insets.top || 0) + 12, [insets.top]);

  // animate in
  const animateIn = useCallback(() => {
    const overshootY = targetY + 8;
    Animated.parallel([
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: overshootY,
          duration: 120,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: targetY,
          useNativeDriver: true,
          damping: 14,
          stiffness: 180,
          mass: 0.7,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 90,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, targetY, translateY]);

  const animateOut = useCallback(
    (cb?: () => void) => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -50,
          duration: 75,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 50,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => cb?.());
    },
    [opacity, translateY],
  );

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  useEffect(() => {
    if (!shouldDismiss || isDismissing) return;
    setIsDismissing(true);
    animateOut(onDismiss);
  }, [animateOut, isDismissing, onDismiss, shouldDismiss]);

  return (
    <Animated.View
      accessibilityRole="alert"
      pointerEvents="none"
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: theme.foreground,
            borderColor: theme.border,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          },
        ]}
      >
        <View style={styles.rowCenter}>
          {/* icon or image */}
          {icon ? (
            <MaterialIcons
              name={icon}
              size={20}
              color={theme.primary}
              style={{
                marginRight: 8,
              }}
            />
          ) : src ? (
            <Image
              source={{ uri: src }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : null}
          <TText weight="medium" style={{ fontSize: 14 }}>
            {text}
          </TText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  toast: {
    minWidth: 120,
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 0.5,
    justifyContent: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
});
