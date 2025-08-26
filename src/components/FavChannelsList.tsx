import { View, StyleSheet } from "react-native";
import { TText } from "../theme";
import { TableRow, TableRowGroup } from "./ui";
import { useTheme } from "../theme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import type { ExtractedData } from "../../modules/dpkg-module";

export function FavChannelsList({ data }: { data: ExtractedData }) {
  const { theme } = useTheme();

  if (data.topChannels.length === 0) return null;

  return (
    <TableRowGroup
      title="Top Channels"
      description="The channels where you've been most active across all Discord servers."
    >
      {data.topChannels.slice(0, 5).map((channel, index) => {
        // parse channel name
        const channelName = channel.name
          ? channel.name.split(" in ")[0].trim()
          : "Unknown Channel";
        // server name
        const serverName = channel.guildName || "Unknown Server";

        return (
          <TableRow key={`${channel.name}-${index}`}>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons name="tag" size={24} color={theme.primary} />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  #{channelName}
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  in {serverName}
                </TText>
              </View>

              <TText
                variant="secondary"
                style={{ fontSize: 14, lineHeight: 16 }}
              >
                {channel.messageCount.toLocaleString()} messages
              </TText>
            </View>
          </TableRow>
        );
      })}
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
