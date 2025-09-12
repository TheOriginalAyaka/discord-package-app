import { StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { handleLinkPress } from "@/src/lib/utils";
import { TText, useTheme } from "@/src/theme";

export function SupportSection() {
  const { theme } = useTheme();

  return (
    <TableRowGroup title="Support">
      <TableRow
        onPress={() =>
          handleLinkPress(
            "https://github.com/theoriginalayaka/discord-package-app/issues",
          )
        }
      >
        <View style={styles.tableRowContent}>
          <MaterialIcons name="bug-report" size={24} color={theme.primary} />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              Bug Reports
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              On GitHub Issues
            </TText>
          </View>

          <MaterialIcons name="open-in-new" size={20} color={theme.secondary} />
        </View>
      </TableRow>

      <TableRow onPress={() => handleLinkPress("https://thereallo.dev")}>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="discord" size={24} color={theme.primary} />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              Discord Server
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              Share your thoughts and suggestions
            </TText>
          </View>

          <MaterialIcons name="open-in-new" size={20} color={theme.secondary} />
        </View>
      </TableRow>

      <TableRow
        onPress={() =>
          handleLinkPress(
            "https://github.com/theoriginalayaka/discord-package-app",
          )
        }
      >
        <View style={styles.tableRowContent}>
          <MaterialCommunityIcons
            name="github"
            size={24}
            color={theme.primary}
          />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              View Source
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              theoriginalayaka/discord-package-app
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
