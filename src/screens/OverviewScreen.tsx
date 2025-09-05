import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerDevMenuItems } from "expo-dev-menu";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef } from "react";
import { Alert, BackHandler, ScrollView, View } from "react-native";
import {
  FavChannelsList,
  FavDmsList,
  FavEmoteList,
  FavTextList,
  ProfileList,
} from "@/src/components/sections";
import { Header, useToast } from "@/src/components/ui";
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
    resetData,
    cancelProcessing,
  } = useDiscordContext();
  const navigation = useNavigation<NavigationProp>();

  const prevIsLoadingAnalytics = useRef<boolean | null>(null);
  const prevAnalytics = useRef(analytics);
  const prevAnalyticsError = useRef(analyticsError);

  useEffect(() => {
    const devMenuItems = [
      {
        name: "Show Test Toast",
        callback: () => {
          showToast({
            icon: "info",
            text: `Test toast ${Math.random()}`,
            duration: 2,
          });
        },
      },
    ];

    registerDevMenuItems(devMenuItems);

    return () => {
      registerDevMenuItems([]);
    };
  }, [showToast]);

  useEffect(() => {
    if (!data) {
      navigation.navigate("Welcome");
    }
  }, [data, navigation]);

  // toast
  useEffect(() => {
    const wasLoading = prevIsLoadingAnalytics.current;
    const wasError = prevAnalyticsError.current;

    if (!wasLoading && isLoadingAnalytics) {
      showToast({
        icon: "hourglass-empty",
        text: "Processing analytics...",
      });
    }

    if (wasLoading && !isLoadingAnalytics && analytics && !analyticsError) {
      showToast({
        icon: "check-circle",
        text: "Analytics ready!",
      });
    }

    if (!wasError && analyticsError) {
      showToast({
        icon: "error",
        text: "Failed to load analytics",
        duration: 3,
      });
    }

    prevIsLoadingAnalytics.current = isLoadingAnalytics;
    prevAnalytics.current = analytics;
    prevAnalyticsError.current = analyticsError;
  }, [isLoadingAnalytics, analytics, analyticsError, showToast]);

  const handleBackPress = useCallback(() => {
    if (isLoadingAnalytics) {
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
              resetData();
              navigation.navigate("Welcome");
            },
          },
        ],
        { cancelable: true },
      );
      return true;
    }

    resetData();
    navigation.navigate("Welcome");
    return true;
  }, [isLoadingAnalytics, cancelProcessing, resetData, navigation]);

  // hardware back button on Android
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress,
      );
      return () => subscription.remove();
    }, [handleBackPress]),
  );

  // handle navigation back action (swipe gesture on iOS)
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!isLoadingAnalytics) {
        return;
      }
      e.preventDefault();

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
              resetData();
              navigation.dispatch(e.data.action);
            },
          },
        ],
        { cancelable: true },
      );
    });

    return unsubscribe;
  }, [navigation, isLoadingAnalytics, cancelProcessing, resetData]);

  if (!data) {
    return null;
  }

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <Header
        title="Overview"
        onBack={handleBackPress}
        onExtra={() => navigation.navigate("Settings")}
        extraIcon="settings"
      />

      <ScrollView style={{ flex: 1 }}>
        <ProfileList
          data={data}
          analytics={analytics}
          progress={progress}
          isLoadingAnalytics={isLoadingAnalytics}
          analyticsError={analyticsError}
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
