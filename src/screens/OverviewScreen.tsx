import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { Alert, BackHandler, ScrollView, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  FavChannelsList,
  FavDmsList,
  FavTextList,
  ProfileList,
} from "@/src/components";
import { Header, TableRow, TableRowGroup } from "@/src/components/ui";
import { useDiscordContext } from "@/src/context/DiscordContext";
import type { RootStackParamList } from "@/src/navigation/types";
import { TText, TView, useTheme, useThemeControls } from "@/src/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Overview">;

export function OverviewScreen() {
  const { isDark, theme } = useTheme();
  const { toggleTheme, mode } = useThemeControls();
  const { data, analytics, isLoadingAnalytics, resetData, cancelProcessing } =
    useDiscordContext();
  const navigation = useNavigation<NavigationProp>();

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
    navigation.navigate("Welcome");
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
        />
        <FavTextList data={data} />
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
        </TableRowGroup>

        <View style={{ height: 24 }} />
      </ScrollView>

      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}
