import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityAnalytics,
  AdditionalEvents,
  BotCommands,
  MessageInteractions,
  SecurityAnalytics,
  VoiceAnalytics,
} from "@/src/components/sections";
import { Header } from "@/src/components/ui";
import { useDiscordContext } from "@/src/context/DiscordContext";
import type { RootStackParamList } from "@/src/navigation/types";
import { TText, TView, useTheme } from "@/src/theme";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Analytics"
>;

export function AnalyticsScreen() {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { analytics } = useDiscordContext();

  if (!analytics) {
    navigation.navigate("Welcome");
    return null;
  }

  const topActivities = [
    { label: "Logins", value: analytics.loginSuccessful },
    { label: "Messages", value: analytics.messageEdited },
    { label: "Voice", value: analytics.joinVoiceChannel },
    { label: "Commands", value: analytics.applicationCommandUsed },
  ].sort((a, b) => b.value - a.value);

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <Header title="Analytics" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* card thingy */}
        <View style={[styles.summaryCard]}>
          <View style={{ alignItems: "center", marginBottom: 4 }}>
            <TText
              variant="secondary"
              weight="medium"
              style={{
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Total Events Tracked
            </TText>
            <TText
              variant="primary"
              weight="bold"
              style={{
                fontSize: 36,
              }}
            >
              {analytics.allEvents.toLocaleString()}
            </TText>
            <TText
              variant="secondary"
              style={{
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Across all categories since you started using Discord
            </TText>
          </View>

          {/* mini stats */}
          <View style={styles.miniStats}>
            {topActivities.slice(0, 3).map((activity) => (
              <View key={activity.label} style={{ alignItems: "center" }}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 18 }}
                >
                  {activity.value.toLocaleString()}
                </TText>
                <TText variant="secondary" style={{ fontSize: 11 }}>
                  {activity.label}
                </TText>
              </View>
            ))}
          </View>
        </View>

        <ActivityAnalytics analytics={analytics} />
        <VoiceAnalytics analytics={analytics} />
        <MessageInteractions analytics={analytics} />
        <BotCommands analytics={analytics} />
        <SecurityAnalytics analytics={analytics} />
        <AdditionalEvents analytics={analytics} />

        <View style={{ height: 24 }} />
      </ScrollView>

      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 12,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  miniStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingTop: 12,
  },
});
