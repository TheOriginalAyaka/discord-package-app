import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import type { EventCount } from "@/modules/dpkg-module";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { TText, useTheme } from "@/src/theme";

export function BotCommands({ analytics }: { analytics: EventCount }) {
  const { theme } = useTheme();

  if (!analytics.mostUsedCommands || analytics.mostUsedCommands.length === 0) {
    if (analytics.applicationCommandUsed === 0) {
      return null;
    }

    return (
      <TableRowGroup
        title="Bot Commands"
        description="Slash commands and bot interactions"
      >
        <TableRow>
          <View style={styles.tableRowContent}>
            <MaterialIcons name="terminal" size={24} color={theme.primary} />

            <View style={styles.textContainer}>
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                Slash Commands
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                Top commands you have used on Discord
              </TText>
            </View>

            <TText variant="secondary" style={{ fontSize: 14, lineHeight: 16 }}>
              {analytics.applicationCommandUsed.toLocaleString()}
            </TText>
          </View>
        </TableRow>
      </TableRowGroup>
    );
  }

  const sortedCommands = [...analytics.mostUsedCommands]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <TableRowGroup
      title="Most Used Bot Commands"
      description="The slash commands and bot interactions you use most frequently"
    >
      <TableRow>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="terminal" size={24} color={theme.primary} />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              Total Commands Used
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              All slash commands executed
            </TText>
          </View>

          <TText variant="secondary" style={{ fontSize: 14, lineHeight: 16 }}>
            {analytics.applicationCommandUsed.toLocaleString()}
          </TText>
        </View>
      </TableRow>

      {sortedCommands.map((command, index) => (
        <TableRow
          key={`${command.commandId}-${index}`}
          disabled={!command.commandName}
        >
          <View style={styles.tableRowContent}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${theme.primary}20` },
              ]}
            >
              <MaterialCommunityIcons
                name="slash-forward"
                size={24}
                color={theme.primary}
              />
            </View>

            <View style={styles.textContainer}>
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                /{command.commandName || "Unknown Command"}
              </TText>
              {command.commandDescription &&
                command.commandDescription !== "…" && (
                  <TText
                    variant="secondary"
                    style={{ fontSize: 12, lineHeight: 16 }}
                  >
                    {command.commandDescription}
                  </TText>
                )}
            </View>

            <TText
              variant="secondary"
              style={{ fontSize: 14, lineHeight: 16, marginLeft: 16 }}
            >
              {command.count.toLocaleString()} uses
            </TText>
          </View>
        </TableRow>
      ))}
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
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
