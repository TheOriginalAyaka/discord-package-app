import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { TableRow, TableRowGroup, Toggle } from "@/src/components/ui";
import { TText, useTheme, useThemeControls } from "@/src/theme";

export function AppearanceSection() {
  const { isDark, theme } = useTheme();
  const { toggleTheme } = useThemeControls();

  return (
    <TableRowGroup title="Appearance" description="Customize how the app looks">
      <TableRow onPress={toggleTheme}>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="brightness-6" size={24} color={theme.primary} />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              Themes
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              {isDark ? "Dark theme enabled" : "Light theme enabled"}
            </TText>
          </View>

          <Toggle value={isDark} onValueChange={toggleTheme} />
        </View>
      </TableRow>
    </TableRowGroup>
  );
}

const styles = StyleSheet.create({
  tableRowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    marginLeft: 16,
  },
});
