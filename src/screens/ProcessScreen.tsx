import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef } from "react";
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

  const isCancelledRef = useRef(false);

  useEffect(() => {
    if (data && !isLoadingUserData && !isCancelledRef.current) {
      navigation.reset({
        index: 1,
        routes: [{ name: "Welcome" }, { name: "Overview", params: { data } }],
      });
    }
  }, [data, isLoadingUserData, navigation]);

  useEffect(() => {
    if (
      !isLoadingUserData &&
      !isLoadingAnalytics &&
      !data &&
      !isCancelledRef.current
    ) {
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
            isCancelledRef.current = true;
            cancelProcessing();

            navigation.popToTop();
          },
        },
      ],
    );
  }, [cancelProcessing, navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isLoadingUserData) {
          handleCancel();
          return true; // prevent default back behavior
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

  const isFinalizingData = !isLoadingUserData && data;
  const loadingMessage = isFinalizingData ? "Finalizing data..." : progress;
  const hintMessage = isFinalizingData
    ? "Almost there..."
    : "This may take a moment...";

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
            {loadingMessage}
          </TText>
          <TText variant="muted" style={styles.hintText}>
            {hintMessage}
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
