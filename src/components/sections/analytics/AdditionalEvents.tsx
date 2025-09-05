import { StyleSheet, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import type { EventCount } from "@/modules/dpkg-module";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { TText, useTheme } from "@/src/theme";

export function AdditionalEvents({ analytics }: { analytics: EventCount }) {
  const { theme } = useTheme();

  const eventItems = [
    {
      icon: "group-add",
      label: "Servers Joined",
      description: "New servers you've joined",
      count: analytics.guildJoined || 0,
    },
    {
      icon: "star",
      label: "Premium Upsells Viewed",
      description: "Nitro promotions you've seen",
      count: analytics.premiumUpsellViewed || 0,
    },
    {
      icon: "apps",
      label: "Applications Created",
      description: "Discord apps/bots you've created",
      count: analytics.applicationCreated || 0,
    },
    {
      icon: "error",
      label: "App Crashes",
      description: "Times the app has crashed",
      count: (analytics.appCrashed || 0) + (analytics.appNativeCrash || 0),
    },
  ];

  return (
    <TableRowGroup
      title="Additional Statistics"
      description="Other Discord activities and events"
    >
      {eventItems.map((item) => (
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
