import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  View,
} from "react-native";
import { Button, ButtonText } from "../components/ui";
import { useDiscordContext } from "../context/DiscordContext";
import type { RootStackParamList } from "../navigation/types";
import { TText, TView, useTheme } from "../theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Process">;
type RouteProp = NativeStackScreenProps<RootStackParamList, "Process">["route"];

export function ProcessScreen() {
  const { isDark, theme } = useTheme();
  const {
    data,
    isLoadingUserData,
    isLoadingAnalytics,
    progress,
    cancelProcessing,
  } = useDiscordContext();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();

  useEffect(() => {
    if (data && !isLoadingUserData) {
      navigation.reset({
        index: 1,
        routes: [{ name: "Welcome" }, { name: "Overview", params: { data } }],
      });
    }
  }, [data, isLoadingUserData, navigation]);

  useEffect(() => {
    if (!isLoadingUserData && !isLoadingAnalytics && !data) {
      navigation.popToTop();
    }
  }, [isLoadingUserData, isLoadingAnalytics, data, navigation]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      "Cancel Processing",
      "Are you sure you want to cancel processing?",
      [
        {
          text: "Keep Processing",
          style: "cancel",
        },
        {
          text: "Cancel",
          style: "destructive",
          onPress: () => {
            cancelProcessing();
            if (route.params?.mode === "demo") {
              navigation.navigate("Welcome");
            } else {
              navigation.navigate("Start");
            }
          },
        },
      ],
    );
  }, [cancelProcessing, navigation, route.params?.mode]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isLoadingUserData) {
          handleCancel();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [isLoadingUserData, handleCancel]),
  );

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator
              size="large"
              color={theme.accent}
              style={styles.spinner}
            />
          </View>
          <TText variant="primary" weight="medium" style={styles.progressText}>
            {!isLoadingUserData && data ? "Finalizing data..." : progress}
          </TText>
          <TText variant="muted" style={styles.hintText}>
            {!isLoadingUserData && data
              ? "Almost there..."
              : "This may take a moment..."}
          </TText>
        </View>
      </View>
      {isLoadingUserData && (
        <View style={styles.cancelContainer}>
          <Button variant="secondary" onPress={handleCancel}>
            <ButtonText weight="semibold">Cancel</ButtonText>
          </Button>
        </View>
      )}
    </TView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  loadingIconContainer: {
    width: 72,
    height: 72,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    transform: [{ scale: 1.5 }],
  },
  progressText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    textAlign: "center",
  },
  cancelContainer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
  },
});
