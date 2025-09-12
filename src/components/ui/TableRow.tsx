import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
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
  const { theme } = useTheme();

  const content = (
    <View style={[styles.contentWrapper, disabled && { opacity: 0.5 }]}>
      {children}
    </View>
  );

  const shapeStyle = style || styles.singleRow;

  if (onPress && !disabled) {
    // outer wrapper owns border radius + clipping
    // android ripple stays inside that way
    // discord literally just make the border radius rounded in all corners for the ripple
    // discord, if you are reading this, fix your shit
    return (
      <View style={[shapeStyle, { overflow: "hidden" }]}>
        <Pressable
          onPress={onPress}
          android_ripple={
            Platform.OS === "android"
              ? { color: theme.cardPressed, borderless: false }
              : undefined
          }
          style={({ pressed }) => [
            styles.tableRow,
            {
              backgroundColor:
                Platform.OS === "ios"
                  ? pressed
                    ? theme.cardPressed
                    : theme.card
                  : theme.card,
            },
          ]}
        >
          {content}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[shapeStyle, { backgroundColor: theme.card }]}>
      <View style={styles.tableRow}>{content}</View>
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
    if (!React.isValidElement(child)) return child;

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

    if (index === 0 && (title || description)) {
      positionStyle = { ...positionStyle, marginTop: 8 };
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
      { style: combinedStyle },
    );
  });

  return (
    <View style={[{ marginBottom: 24 }, style]}>
      {(title || description) && (
        <View style={{ marginHorizontal: 12 }}>
          {title && (
            <TText
              variant="primary"
              style={[{ fontSize: 14 }, { color: theme.secondary }]}
              weight="medium"
            >
              {title}
            </TText>
          )}
          {description && (
            <TText
              variant="secondary"
              style={[{ fontSize: 12 }, { color: theme.tertiary }]}
              weight="regular"
            >
              {description}
            </TText>
          )}
        </View>
      )}
      {enhancedChildren}
    </View>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 60,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
    borderTopWidth: 1,
  },
  lastRow: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 1,
    marginHorizontal: 8,
    marginTop: 0,
    borderTopWidth: 1,
  },
});
