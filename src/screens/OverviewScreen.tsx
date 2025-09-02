import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef } from "react";
import { Alert, BackHandler, ScrollView, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  FavChannelsList,
  FavDmsList,
  FavEmoteList,
  FavTextList,
  ProfileList,
} from "@/src/components";
import { Header, TableRow, TableRowGroup, useToast } from "@/src/components/ui";
import { useDiscordContext } from "@/src/context/DiscordContext";
import type { RootStackParamList } from "@/src/navigation/types";
import { TText, TView, useTheme, useThemeControls } from "@/src/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Overview">;

export function OverviewScreen() {
  const { isDark, theme } = useTheme();
  const { toggleTheme, mode } = useThemeControls();
  const { showToast } = useToast();
  const {
    data,
    analytics,
    isLoadingAnalytics,
    analyticsError,
    resetData,
    cancelProcessing,
  } = useDiscordContext();
  const navigation = useNavigation<NavigationProp>();

  // Initialize refs with null or false to detect the initial state
  const prevIsLoadingAnalytics = useRef<boolean | null>(null);
  const prevAnalytics = useRef(analytics);
  const prevAnalyticsError = useRef(analyticsError);

  useEffect(() => {
    if (!data) {
      navigation.navigate("Welcome");
    }
  }, [data, navigation]);

  // toast
  useEffect(() => {
    const wasLoading = prevIsLoadingAnalytics.current;
    const wasError = prevAnalyticsError.current;

    if (wasLoading === null && isLoadingAnalytics) {
      showToast({
        icon: "hourglass-empty",
        text: "Analytics are being processed...",
      });
    } else if (wasLoading === false && isLoadingAnalytics) {
      showToast({
        icon: "hourglass-empty",
        text: "Analytics are being processed...",
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
        "Processing Analytics",
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

      // prevent default behavior
      e.preventDefault();

      Alert.alert(
        "Processing Analytics",
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
      <Header title="Analysis" onBack={handleBackPress} />

      <ScrollView style={{ flex: 1 }}>
        <ProfileList
          data={data}
          analytics={analytics}
          isLoadingAnalytics={isLoadingAnalytics}
          analyticsError={analyticsError}
        />
        <FavTextList data={data} />
        <FavEmoteList data={data} />
        <FavDmsList data={data} />
        <FavChannelsList data={data} />

        <TableRowGroup title="Settings">
          <TableRow onPress={toggleTheme}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <MaterialIcons
                name="brightness-6"
                size={24}
                color={theme.primary}
              />
              <TText style={{ marginLeft: 16 }}>Theme</TText>
            </View>
            <TText variant="secondary">{mode}</TText>
          </TableRow>
          <TableRow
            onPress={() => {
              showToast({
                icon: "info",
                text: `Test toast ${Math.random()}`,
                duration: 2,
              });
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <MaterialIcons name="info" size={24} color={theme.primary} />
              <TText style={{ marginLeft: 16 }}>Show test toast</TText>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.tertiary}
            />
          </TableRow>
        </TableRowGroup>

        <View style={{ height: 24 }} />
      </ScrollView>

      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}
