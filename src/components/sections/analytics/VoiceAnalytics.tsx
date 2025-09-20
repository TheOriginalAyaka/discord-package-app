import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import type { EventCount } from "@/modules/dpkg-module";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { TText, useTheme } from "@/src/theme";
import type { MaterialIconName } from "@/src/types";

export function VoiceAnalytics({ analytics }: { analytics: EventCount }) {
  const { theme } = useTheme();

  const voiceItems = [
    {
      icon: "call",
      label: "Voice Channels Joined",
      description: "Times you've joined voice channels",
      count: analytics.joinVoiceChannel || 0,
    },
    {
      icon: "call-end",
      label: "Voice Channels Left",
      description: "Times you've left voice channels",
      count: analytics.leaveVoiceChannel || 0,
    },
    {
      icon: "mic",
      label: "Voice Messages Recorded",
      description: "Voice messages you've sent",
      count: analytics.voiceMessageRecorded || 0,
    },
  ];

  const totalVoiceActivity = voiceItems.reduce(
    (acc, item) => acc + item.count,
    0,
  );

  if (totalVoiceActivity === 0) return null;

  return (
    <TableRowGroup
      title="Voice Activity"
      description="Your voice channel usage and interaction statistics"
    >
      {voiceItems.map((item) => (
        <TableRow key={item.label}>
          <View style={styles.tableRowContent}>
            <MaterialIcons
              name={item.icon as MaterialIconName}
              size={24}
              color={theme.primary}
            />

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
