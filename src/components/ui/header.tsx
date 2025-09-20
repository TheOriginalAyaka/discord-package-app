import { MaterialIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TText, TView, useTheme } from "@/src/theme";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onExtra?: () => void;
  extraIcon?: string;
}

export default function Header({
  title,
  onBack,
  onExtra,
  extraIcon,
}: HeaderProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <TView
      style={[
        styles.header,
        {
          paddingTop: insets.top + 12,
          backgroundColor: theme.background,
          ...(Platform.OS === "android"
            ? {
                elevation: 8,
              }
            : // ios
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.border,
              }),
        },
      ]}
    >
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.iconButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.secondary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}

      <TText variant="primary" style={styles.headerTitle} weight="bold">
        {title}
      </TText>

      {onExtra && extraIcon ? (
        <TouchableOpacity
          onPress={onExtra}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.iconButton}
        >
          <MaterialIcons name={extraIcon} size={24} color={theme.secondary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}
    </TView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 12,
    minHeight: 60,
  },
  headerTitle: {
    fontSize: 20,
    flex: 1,
    textAlign: "left",
    marginLeft: 24,
  },
  iconButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
