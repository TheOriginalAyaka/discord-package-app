import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import { TableRow, TableRowGroup } from "@/src/components/ui";
import { handleLinkPress } from "@/src/lib/utils";
import { TText, useTheme } from "@/src/theme";

export function LegalSection() {
  const { theme } = useTheme();

  return (
    <TableRowGroup title="Legal">
      <TableRow
        onPress={() =>
          handleLinkPress("https://dispackage.thereallo.dev/terms")
        }
      >
        <View style={styles.tableRowContent}>
          <MaterialIcons name="description" size={24} color={theme.primary} />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              Terms of Service
            </TText>
          </View>

          <MaterialIcons name="open-in-new" size={20} color={theme.secondary} />
        </View>
      </TableRow>

      <TableRow
        onPress={() =>
          handleLinkPress("https://dispackage.thereallo.dev/privacy")
        }
      >
        <View style={styles.tableRowContent}>
          <MaterialIcons name="privacy-tip" size={24} color={theme.primary} />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              Privacy Policy
            </TText>
          </View>

          <MaterialIcons name="open-in-new" size={20} color={theme.secondary} />
        </View>
      </TableRow>

      <TableRow
        onPress={() =>
          handleLinkPress("https://dispackage.thereallo.dev/licenses")
        }
      >
        <View style={styles.tableRowContent}>
          <MaterialIcons name="gavel" size={24} color={theme.primary} />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              Licenses
            </TText>
          </View>

          <MaterialIcons name="open-in-new" size={20} color={theme.secondary} />
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
