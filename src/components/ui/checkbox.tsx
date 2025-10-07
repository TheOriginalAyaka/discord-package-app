import { MaterialIcons } from "@expo/vector-icons";
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

interface CheckboxProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface CheckboxGroupContextValue {
  value: string[];
  onValueChange: (value: string[]) => void;
  disabled?: boolean;
}

interface CheckboxItemContextValue {
  isChecked: boolean;
  toggle: () => void;
  disabled: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null,
);
const CheckboxItemContext = createContext<CheckboxItemContextValue | null>(
  null,
);

interface CheckboxGroupProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  disabled?: boolean;
  children: ReactNode;
}

// Properly typed props that CheckboxItem can receive and pass through
interface CheckboxItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export default function Checkbox({
  value,
  onValueChange,
  disabled = false,
  style,
}: CheckboxProps) {
  const { theme } = useTheme();

  const checkboxItemContext = useContext(CheckboxItemContext);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgScale = useRef(new Animated.Value(value ? 1 : 0)).current;
  const bgOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const checkScale = useRef(new Animated.Value(value ? 1 : 0)).current;
  const checkOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderOpacity = useRef(new Animated.Value(value ? 0 : 1)).current;

  useEffect(() => {
    if (value) {
      Animated.parallel([
        // Background and checkmark animate together with same timing
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
        Animated.timing(checkScale, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
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
        // Everything animates out together
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
        Animated.timing(checkScale, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(checkOpacity, {
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
  }, [value, bgScale, bgOpacity, checkScale, checkOpacity, borderOpacity]);

  const handlePress = () => {
    if (!disabled) {
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

      if (checkboxItemContext) {
        checkboxItemContext.toggle();
      } else {
        onValueChange(!value);
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

export function CheckboxGroup({
  value,
  onValueChange,
  disabled,
  children,
}: CheckboxGroupProps) {
  return (
    <CheckboxGroupContext.Provider value={{ value, onValueChange, disabled }}>
      {children}
    </CheckboxGroupContext.Provider>
  );
}

export function CheckboxItem({
  value: itemValue,
  children,
  disabled: itemDisabled,
}: CheckboxItemProps) {
  const context = useContext(CheckboxGroupContext);

  if (!context) {
    throw new Error("CheckboxItem must be used within CheckboxGroup");
  }

  const { value, onValueChange, disabled: groupDisabled } = context;
  const isChecked = value.includes(itemValue);
  const isDisabled = groupDisabled || itemDisabled;

  const handleToggle = () => {
    if (isDisabled) return;

    if (isChecked) {
      onValueChange(value.filter((v) => v !== itemValue));
    } else {
      onValueChange([...value, itemValue]);
    }
  };

  const itemContextValue: CheckboxItemContextValue = {
    isChecked,
    toggle: handleToggle,
    disabled: isDisabled || false,
  };

  return (
    <CheckboxItemContext.Provider value={itemContextValue}>
      <View style={{ flex: 1 }}>{children}</View>
    </CheckboxItemContext.Provider>
  );
}

export function useCheckboxItem() {
  const context = useContext(CheckboxItemContext);
  if (!context) {
    throw new Error("useCheckboxItem must be used within CheckboxItem");
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
