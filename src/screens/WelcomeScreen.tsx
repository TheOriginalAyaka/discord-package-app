import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ImageBackground } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Button, ButtonText } from "../components/ui";
import { useDiscordContext } from "../context/DiscordContext";
import type { RootStackParamList } from "../navigation/types";
import { TText, TTitle, TView, useTheme } from "../theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

export function WelcomeScreen() {
  const { isDark, theme } = useTheme();
  const {
    pickAndProcessFile,
    useMockData,
    data,
    isLoadingUserData,
    progress,
    cancelProcessing,
  } = useDiscordContext();
  const navigation = useNavigation<NavigationProp>();
  const [showLoading, setshowLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setshowLoading(false);
    }, []),
  );

  useEffect(() => {
    if (isLoadingUserData) {
      setshowLoading(true);
    }
  }, [isLoadingUserData]);

  useEffect(() => {
    if (data && !isLoadingUserData && showLoading) {
      const timer = setTimeout(() => {
        navigation.navigate("Overview", { data });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [data, isLoadingUserData, showLoading, navigation]);

  const handleCancel = () => {
    cancelProcessing();
    setshowLoading(false);
  };

  if (showLoading) {
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

            <TText
              variant="primary"
              weight="medium"
              style={styles.progressText}
            >
              {!isLoadingUserData && data ? "Finalizing data..." : progress}
            </TText>

            <TText variant="muted" style={styles.hintText}>
              {!isLoadingUserData && data
                ? "Almost there..."
                : "This may take a moment..."}
            </TText>
          </View>

          <View style={styles.cancelButtonContainer}>
            <Button variant="secondary" onPress={handleCancel}>
              <ButtonText weight="semibold">Cancel</ButtonText>
            </Button>
          </View>
        </View>
      </TView>
    );
  }

  return (
    <ImageBackground source={require("@/assets/bg.webp")} style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.content}>
        <View style={styles.centerSection}>
          <View style={[styles.iconBadge]}>
            <MaterialIcons name="discord" size={100} color="#ffffff" />
          </View>

          <TTitle style={styles.title}>Data Package Analyzer</TTitle>
          <TText style={styles.subtitle}>
            Analyze your Discord data package to understand your data and
            improve your privacy and security.
          </TText>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            variant="primary"
            onPress={pickAndProcessFile}
            disabled={isLoadingUserData}
          >
            <ButtonText weight="semibold">Choose Package</ButtonText>
          </Button>

          <Button
            variant="secondary"
            onPress={useMockData}
            disabled={isLoadingUserData}
            style={{ marginTop: 8 }}
          >
            <ButtonText weight="semibold">View Demo</ButtonText>
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadge: {
    width: 100,
    height: 100,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  buttonsContainer: {
    paddingBottom: 40,
    gap: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "space-between",
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
  cancelButtonContainer: {
    paddingBottom: 40,
  },
});
