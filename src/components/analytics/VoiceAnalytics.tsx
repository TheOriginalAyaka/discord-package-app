import { StyleSheet, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import type { EventCount } from "@/modules/dpkg-module";
import { TText, useTheme } from "../../theme";
import { TableRow, TableRowGroup } from "../ui";

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
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${theme.primary}20` },
              ]}
            >
              <MaterialIcons name={item.icon} size={24} color={theme.primary} />
            </View>

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
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
