// src/components/analytics/SecurityAnalytics.tsx
import { StyleSheet, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import type { EventCount } from "@/modules/dpkg-module";
import { TText, useTheme } from "../../theme";
import { TableRow, TableRowGroup } from "../ui";

export function SecurityAnalytics({ analytics }: { analytics: EventCount }) {
  const { theme } = useTheme();

  const securityItems = [
    {
      icon: "security",
      label: "CAPTCHAs Served",
      description: "Security verifications completed",
      count: analytics.captchaServed || 0,
    },
    {
      icon: "qr-code-scanner",
      label: "Remote Auth Logins",
      description: "QR code logins performed",
      count: analytics.remoteAuthLogin || 0,
    },
    {
      icon: "verified-user",
      label: "OAuth2 Authorizations",
      description: "Third-party apps authorized",
      count: analytics.oauth2AuthorizeAccepted || 0,
    },
    {
      icon: "warning",
      label: "Token Compromises",
      description: "Bot token security issues",
      count: analytics.botTokenCompromised || 0,
      isWarning: true,
    },
  ];

  return (
    <TableRowGroup
      title="Security & Privacy"
      description="Your account security events and authorization history"
    >
      {securityItems.map((item) => (
        <TableRow key={item.label}>
          <View style={styles.tableRowContent}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: item.isWarning
                    ? "rgba(239, 68, 68, 0.2)"
                    : `${theme.primary}20`,
                },
              ]}
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.isWarning ? "#EF4444" : theme.primary}
              />
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
