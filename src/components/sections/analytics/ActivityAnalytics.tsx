import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import type { EventCount } from "@/modules/dpkg-module";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { TText, useTheme } from "@/src/theme";
import type { MaterialIconName } from "@/src/types";

export function ActivityAnalytics({ analytics }: { analytics: EventCount }) {
  const { theme } = useTheme();

  const activityItems = [
    {
      icon: "login",
      label: "Successful Logins",
      description: "Times you've logged into Discord",
      count: analytics.loginSuccessful || 0,
    },
    {
      icon: "phone-android",
      label: "App Opens",
      description: "Times you've opened the Discord app",
      count: analytics.appOpened || 0,
    },
    {
      icon: "notifications",
      label: "Notifications Clicked",
      description: "Discord notifications you've interacted with",
      count: analytics.notificationClicked || 0,
    },
    {
      icon: "email",
      label: "Emails Opened",
      description: "Discord emails you've opened",
      count: analytics.emailOpened || 0,
    },
    {
      icon: "portrait",
      label: "Avatar Updates",
      description: "Times you've changed your avatar",
      count: analytics.userAvatarUpdated || 0,
    },
  ];

  return (
    <TableRowGroup
      title="Activity Statistics"
      description="Your general Discord activity and engagement metrics"
    >
      {activityItems.map((item) => (
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
