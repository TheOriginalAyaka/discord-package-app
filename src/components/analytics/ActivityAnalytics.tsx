import { StyleSheet, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import type { EventCount } from "@/modules/dpkg-module";
import { TText, useTheme } from "../../theme";
import { TableRow, TableRowGroup } from "../ui";

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
