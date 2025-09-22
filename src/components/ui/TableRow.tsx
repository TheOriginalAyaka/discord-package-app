import React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
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
    // Using iOS approach for both platforms due to SDK 54 Android ripple issues
    // See: https://github.com/expo/expo/issues/39871
    return (
      <View
        style={[
          shapeStyle,
          { overflow: "hidden", backgroundColor: theme.card },
        ]}
      >
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.tableRow,
            {
              backgroundColor: pressed ? theme.cardPressed : "transparent",
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

  if (!title && description) {
    throw new Error("Description cannot be used without a title");
  }

  const enhancedChildren = childrenArray.map((child, index) => {
    if (!React.isValidElement(child)) return child;

    type RowKind = "single" | "first" | "middle" | "last";

    const rowKind: RowKind =
      totalChildren === 1
        ? "single"
        : index === 0
          ? "first"
          : index === totalChildren - 1
            ? "last"
            : "middle";

    const baseStyleByKind: Record<RowKind, ViewStyle> = {
      single: styles.singleRow,
      first: styles.firstRow,
      middle: { ...styles.middleRow, borderTopColor: theme.divider },
      last: { ...styles.lastRow, borderTopColor: theme.divider },
    };

    let positionStyle = baseStyleByKind[rowKind];
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

/*
 * ANDROID RIPPLE IMPLEMENTATION (Currently broken in SDK 54)
 *
 * Once the ripple issue is fixed (https://github.com/expo/expo/issues/39871),
 * replace the onPress handler above with this implementation:
 *
 * if (onPress && !disabled) {
 *   // Outer wrapper owns border radius + clipping
 *   // This ensures Android ripple stays inside rounded corners
 *   // Note: overflow: "hidden" is crucial for containing the ripple
 *   return (
 *     <View style={[shapeStyle, { overflow: "hidden" }]}>
 *       <Pressable
 *         onPress={onPress}
 *         android_ripple={
 *           Platform.OS === "android"
 *             ? {
 *                 color: theme.cardPressed,
 *                 borderless: false  // Keep ripple within bounds
 *               }
 *             : undefined
 *         }
 *         style={({ pressed }) => [
 *           styles.tableRow,
 *           {
 *             backgroundColor:
 *               Platform.OS === "ios"
 *                 ? pressed
 *                   ? theme.cardPressed
 *                   : theme.card
 *                 : theme.card,  // Android uses ripple, not backgroundColor change
 *           },
 *         ]}
 *       >
 *         {content}
 *       </Pressable>
 *     </View>
 *   );
 * }
 *
 * KEY POINTS FOR ANDROID RIPPLE WITH CORNER RADIUS:
 * 1. The outer View must have the border radius styles
 * 2. The outer View must have overflow: "hidden"
 * 3. Use borderless: false in android_ripple to contain it
 * 4. Don't apply border radius to the Pressable itself
 *
 * KNOWN ISSUES (SDK 54):
 * - Ripple doesn't show unless foreground: true (breaks UX)
 * - When android_ripple is present, theme changes don't trigger re-renders
 * - Component background won't update until navigation occurs
 */
