import { StyleSheet, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import type { EventCount } from "@/modules/dpkg-module";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { TText, useTheme } from "@/src/theme";

export function MessageInteractions({ analytics }: { analytics: EventCount }) {
  const { theme } = useTheme();

  const messageItems = [
    {
      icon: "edit",
      label: "Messages Edited",
      description: "Times you've edited your messages",
      count: analytics.messageEdited || 0,
    },
    {
      icon: "emoji-emotions",
      label: "Reactions Added",
      description: "Reactions you've added to messages",
      count: analytics.addReaction || 0,
    },
    {
      icon: "report",
      label: "Messages Reported",
      description: "Messages you've reported",
      count: analytics.messageReported || 0,
    },
  ];

  return (
    <TableRowGroup
      title="Message Interactions"
      description="How you interact with messages on Discord"
    >
      {messageItems.map((item) => (
        <TableRow key={item.label}>
          <View style={styles.tableRowContent}>
            <MaterialIcons name={item.icon} size={24} color={theme.primary} />

            <View style={styles.textContainer}>
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                {item.label}
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                {item.description}
              </TText>
            </View>

            <TText variant="secondary" style={{ fontSize: 14, lineHeight: 16 }}>
              {item.count.toLocaleString()}
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
});
