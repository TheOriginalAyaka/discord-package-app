import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  Animated,
  Easing,
  type StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/src/theme";

interface RadioProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface RadioGroupContextValue {
  value: string | null;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

interface RadioItemContextValue {
  isChecked: boolean;
  select: () => void;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
const RadioItemContext = createContext<RadioItemContextValue | null>(null);

interface RadioGroupProps {
  value: string | null;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
}

interface RadioItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export default function Radio({
  value,
  onValueChange,
  disabled = false,
  style,
}: RadioProps) {
  const { theme } = useTheme();

  const radioItemContext = useContext(RadioItemContext);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgScale = useRef(new Animated.Value(value ? 1 : 0)).current;
  const bgOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const dotScale = useRef(new Animated.Value(value ? 1 : 0)).current;
  const dotOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderOpacity = useRef(new Animated.Value(value ? 0 : 1)).current;

  useEffect(() => {
    if (value) {
      Animated.parallel([
        Animated.timing(bgScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bgOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dotScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(borderOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        // animates out together
        Animated.timing(bgScale, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bgOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dotScale, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(borderOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [value, bgScale, bgOpacity, dotScale, dotOpacity, borderOpacity]);

  const handlePress = () => {
    if (!disabled && !value) {
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

      if (radioItemContext) {
        radioItemContext.select();
      } else {
        onValueChange(true);
      }
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
        <Animated.View
          style={[
            styles.border,
            {
              borderColor: theme.secondary,
              opacity: borderOpacity,
            },
          ]}
        />

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

        <Animated.View
          style={[
            styles.dotContainer,
            {
              opacity: dotOpacity,
              transform: [{ scale: dotScale }],
            },
          ]}
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor: "white",
              },
            ]}
          />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export function RadioGroup({
  value,
  onValueChange,
  disabled,
  children,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      {children}
    </RadioGroupContext.Provider>
  );
}

export function RadioItem({
  value: itemValue,
  children,
  disabled: itemDisabled,
}: RadioItemProps) {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioItem must be used within RadioGroup");
  }

  const { value, onValueChange, disabled: groupDisabled } = context;
  const isChecked = value === itemValue;
  const isDisabled = groupDisabled || itemDisabled;

  const handleSelect = () => {
    if (isDisabled || isChecked) return;
    onValueChange(itemValue);
  };

  const itemContextValue: RadioItemContextValue = {
    isChecked,
    select: handleSelect,
    disabled: isDisabled || false,
  };

  return (
    <RadioItemContext.Provider value={itemContextValue}>
      <View style={{ flex: 1 }}>{children}</View>
    </RadioItemContext.Provider>
  );
}

export function useRadioItem() {
  const context = useContext(RadioItemContext);
  if (!context) {
    throw new Error("useRadioItem must be used within RadioItem");
  }

  return context;
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
    borderRadius: 12,
    borderWidth: 2,
  },
  background: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  dotContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  disabled: {
    opacity: 0.5,
  },
});
