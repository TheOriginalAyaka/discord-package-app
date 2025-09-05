import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import type { EventCount, ExtractedData } from "@/modules/dpkg-module";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import type { RootStackParamList } from "@/src/navigation/types";
import { TText, useTheme } from "@/src/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Overview">;

export function ProfileList({
  data,
  analytics = undefined,
  progress = "",
  isLoadingAnalytics = false,
  analyticsError = null,
}: {
  data: ExtractedData;
  analytics: EventCount | undefined;
  progress?: string;
  isLoadingAnalytics?: boolean;
  analyticsError?: string | null;
}) {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  if (!data.user) return null;

  const avatarUrl = `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatarHash}.png?size=256`;

  return (
    <View>
      <View style={{ marginHorizontal: 12, paddingBottom: 16, paddingTop: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: 64, height: 64, borderRadius: 100 }}
            resizeMode="contain"
          />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: 16,
              flex: 1,
            }}
          >
            <TText
              variant="primary"
              weight="bold"
              style={{ fontSize: 22, lineHeight: 28 }}
            >
              Welcome back, {data.user?.globalName}
            </TText>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TText
                variant="secondary"
                weight="medium"
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                }}
              >
                @{data.user?.username}
              </TText>
              <TText
                variant="secondary"
                weight="medium"
                style={{ fontSize: 14, lineHeight: 18 }}
              >
                •
              </TText>
              <TText
                variant="secondary"
                weight="medium"
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                }}
              >
                {data.user?.id}
              </TText>
            </View>
          </View>
        </View>
      </View>

      <TableRowGroup title="Profile" description="About your Discord account">
        <TableRow>
          <View style={styles.tableRowContent}>
            <MaterialIcons name="message" size={24} color={theme.primary} />

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                marginLeft: 16,
              }}
            >
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                Messages Sent
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                The amount of messages sent by you
              </TText>
            </View>

            <TText variant="secondary" weight="medium" style={styles.rightText}>
              {data.messageCount.toLocaleString()} messages
            </TText>
          </View>
        </TableRow>
        <TableRow>
          <View style={styles.tableRowContent}>
            <MaterialIcons name="text-fields" size={24} color={theme.primary} />

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                marginLeft: 16,
              }}
            >
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                Characters
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                Total message character count
              </TText>
            </View>

            <TText variant="secondary" weight="medium" style={styles.rightText}>
              {data.characterCount.toLocaleString()} characters
            </TText>
          </View>
        </TableRow>
        <TableRow>
          <View style={styles.tableRowContent}>
            <MaterialIcons name="home" size={24} color={theme.primary} />

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                marginLeft: 16,
              }}
            >
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                Servers
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                The amount of servers you are a member of
              </TText>
            </View>

            <TText variant="secondary" weight="medium" style={styles.rightText}>
              {data.guilds.length.toLocaleString()} servers
            </TText>
          </View>
        </TableRow>
        <TableRow>
          <View style={styles.tableRowContent}>
            <MaterialIcons name="list" size={24} color={theme.primary} />

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                marginLeft: 16,
              }}
            >
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                Channels
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                The amount of channels you have interacted with
              </TText>
            </View>

            <TText variant="secondary" weight="medium" style={styles.rightText}>
              {data.channelCount.toLocaleString()} channels
            </TText>
          </View>
        </TableRow>
        <TableRow>
          <View style={styles.tableRowContent}>
            <MaterialIcons name="messenger" size={24} color={theme.primary} />

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                marginLeft: 16,
              }}
            >
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                DM Channels
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                The total number of DM channels you've created
              </TText>
            </View>

            <TText variant="secondary" weight="medium" style={styles.rightText}>
              {data.dmChannelCount.toLocaleString()} DMs
            </TText>
          </View>
        </TableRow>
        <TableRow>
          <View style={styles.tableRowContent}>
            <MaterialIcons name="payments" size={24} color={theme.primary} />

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                marginLeft: 16,
              }}
            >
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                Purchases
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                How much you have spent on Discord
              </TText>
            </View>

            <TText variant="secondary" weight="medium" style={styles.rightText}>
              {`$${(
                (data.user?.payments
                  ?.map((payment) =>
                    payment.status === 1 ? payment.amount : 0,
                  )
                  .reduce((acc, cur) => acc + cur, 0) ?? 0) / 100
              ).toFixed(2)}`}
            </TText>
          </View>
        </TableRow>
        <TableRow
          onPress={() => {
            if (!isLoadingAnalytics && analytics && !analyticsError) {
              navigation.navigate("Analytics", { analytics });
            }
          }}
          disabled={isLoadingAnalytics || !analytics || !!analyticsError}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              opacity:
                isLoadingAnalytics || (!analytics && !analyticsError) ? 0.5 : 1,
            }}
          >
            <MaterialIcons
              name="show-chart"
              size={24}
              color={analyticsError ? theme.error : theme.primary}
            />

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                marginLeft: 16,
              }}
            >
              <TText
                variant="primary"
                weight="semibold"
                style={{
                  fontSize: 16,
                  lineHeight: 20,
                  ...(analyticsError && { color: theme.error }),
                }}
              >
                {isLoadingAnalytics
                  ? "Loading Analytics..."
                  : analyticsError
                    ? "Failed to load analytics"
                    : "More Analytics"}
              </TText>
              {(isLoadingAnalytics || analyticsError) && (
                <TText
                  variant="secondary"
                  style={{
                    fontSize: 12,
                    lineHeight: 16,
                    ...(analyticsError && { color: theme.error }),
                  }}
                >
                  {isLoadingAnalytics
                    ? (() => {
                        if (!progress || progress === "")
                          return "Please wait while we process your analytics.";

                        const batchMatch =
                          progress.match(/Processing batch \d+/);
                        return batchMatch ? `${batchMatch[0]}...` : progress;
                      })()
                    : analyticsError}
                </TText>
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isLoadingAnalytics && (
                <ActivityIndicator
                  size="small"
                  color={theme.secondary}
                  style={{
                    transform: [{ scale: 0.8 }],
                    marginRight: 8,
                  }}
                />
              )}
              {analyticsError ? (
                <MaterialIcons
                  name="error-outline"
                  size={24}
                  color={theme.error}
                />
              ) : (
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={theme.secondary}
                />
              )}
            </View>
          </View>
        </TableRow>
      </TableRowGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  tableRowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 16,
  },
});
