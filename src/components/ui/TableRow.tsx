import React, { useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from "react-native";
import { TText, useTheme } from "@/src/theme";

interface TableRowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
  onPress?: () => void;
}

interface TableRowGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
  description?: string;
}

export function TableRow({
  children,
  style,
  disabled = false,
  onPress,
}: TableRowProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { theme } = useTheme();

  const handlePressIn = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  if (onPress && !disabled) {
    return (
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <View
          style={[
            styles.tableRow,
            { backgroundColor: isPressed ? theme.cardPressed : theme.card },
            styles.singleRow,
            disabled && styles.disabled,
            style,
          ]}
        >
          {children}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View
      style={[
        styles.tableRow,
        { backgroundColor: theme.card },
        styles.singleRow,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function TableRowGroup({
  children,
  style,
  title,
  description,
}: TableRowGroupProps) {
  const { theme } = useTheme();
  const childrenArray = React.Children.toArray(children);
  const totalChildren = childrenArray.length;

  const enhancedChildren = childrenArray.map((child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    let positionStyle: ViewStyle;
    if (totalChildren === 1) {
      positionStyle = styles.singleRow;
    } else if (index === 0) {
      positionStyle = styles.firstRow;
    } else if (index === totalChildren - 1) {
      positionStyle = { ...styles.lastRow, borderTopColor: theme.divider };
    } else {
      positionStyle = { ...styles.middleRow, borderTopColor: theme.divider };
    }

    const existingStyle = (child.props as { style?: ViewStyle | ViewStyle[] })
      ?.style;
    const combinedStyle = existingStyle
      ? Array.isArray(existingStyle)
        ? [...existingStyle, positionStyle]
        : [existingStyle, positionStyle]
      : [positionStyle];

    return React.cloneElement(
      child as React.ReactElement<{ style?: ViewStyle | ViewStyle[] }>,
      {
        style: combinedStyle,
      },
    );
  });

  return (
    <View style={[{ marginBottom: 24 }, style]}>
      {title && (
        <TText
          variant="primary"
          style={[styles.groupTitle, { color: theme.secondary }]}
          weight="medium"
        >
          {title}
        </TText>
      )}
      {description && (
        <TText
          variant="secondary"
          style={[styles.groupDescription, { color: theme.tertiary }]}
          weight="regular"
        >
          {description}
        </TText>
      )}
      {enhancedChildren}
    </View>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    fontSize: 14,
    marginBottom: 4,
    marginHorizontal: 12,
  },
  groupDescription: {
    fontSize: 12,
    marginBottom: 8,
    marginHorizontal: 12,
  },
  // per item
  tableRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 60,
  },
  singleRow: {
    borderRadius: 16,
    marginVertical: 1,
    marginHorizontal: 8,
  },
  firstRow: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: 1,
    marginHorizontal: 8,
    marginBottom: 0,
  },
  middleRow: {
    borderRadius: 0,
    marginVertical: 0,
    marginHorizontal: 8,
    paddingLeft: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  lastRow: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 1,
    marginHorizontal: 8,
    marginTop: 0,
    paddingLeft: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  disabled: {
    opacity: 0.5,
  },
});
