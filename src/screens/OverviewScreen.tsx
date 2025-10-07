import { useNavigation, usePreventRemove } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Alert, ScrollView, View } from "react-native";
import {
  FavChannelsList,
  FavDmsList,
  FavEmoteList,
  FavTextList,
  ProfileList,
} from "@/src/components/sections";
import { useToast } from "@/src/components/ui";
import { useDiscordContext } from "@/src/context/DiscordContext";
import type { RootStackParamList } from "@/src/navigation/types";
import { TView, useTheme } from "@/src/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Overview">;

export function OverviewScreen() {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const {
    data,
    analytics,
    progress,
    isLoadingAnalytics,
    analyticsError,
    cancelProcessing,
    isFeatureEnabled,
  } = useDiscordContext();
  const navigation = useNavigation<NavigationProp>();

  // track previous states for toasts
  const prevIsLoadingAnalytics = useRef<boolean | null>(null);
  const prevAnalyticsError = useRef(analyticsError);

  // if no data, go back to welcome
  useEffect(() => {
    if (!data) {
      navigation.popToTop();
    }
  }, [data, navigation]);

  // toasts
  useEffect(() => {
    const wasLoading = prevIsLoadingAnalytics.current;
    const wasError = prevAnalyticsError.current;

    if (!wasLoading && isLoadingAnalytics) {
      showToast({ icon: "hourglass-empty", text: "Processing analytics..." });
    }
    if (wasLoading && !isLoadingAnalytics && analytics && !analyticsError) {
      showToast({ icon: "check-circle", text: "Analytics ready!" });
    }
    if (!wasError && analyticsError) {
      showToast({
        icon: "error",
        text: "Failed to load analytics",
        duration: 3,
      });
    }

    prevIsLoadingAnalytics.current = isLoadingAnalytics;
    prevAnalyticsError.current = analyticsError;
  }, [isLoadingAnalytics, analytics, analyticsError, showToast]);

  // navigation prevention
  usePreventRemove(isLoadingAnalytics, ({ data }) => {
    Alert.alert(
      "Analytics is still processing",
      "Analytics are still being processed in the background. Do you want to stop and go back?",
      [
        {
          text: "Keep Processing",
          style: "cancel",
        },
        {
          text: "Stop & Go Back",
          style: "destructive",
          onPress: () => {
            cancelProcessing();
            navigation.dispatch(data.action);
          },
        },
      ],
    );
  });

  if (!data) return null;

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, paddingTop: 16 }}>
        <ProfileList
          data={data}
          analytics={analytics}
          progress={progress}
          isLoadingAnalytics={isLoadingAnalytics}
          analyticsError={analyticsError}
          isAnalyticsEnabled={isFeatureEnabled("analytics")}
        />
        <FavTextList data={data} />
        <FavEmoteList data={data} />
        <FavDmsList data={data} />
        <FavChannelsList data={data} />
        <View style={{ height: 24 }} />
      </ScrollView>
      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}
