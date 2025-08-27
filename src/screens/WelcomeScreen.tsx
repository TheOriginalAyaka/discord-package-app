import { StyleSheet, View, ImageBackground, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme, TText, TTitle } from "../theme";
import { Button, ButtonText } from "../components/ui";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface WelcomeScreenProps {
  onPickFile: () => void;
  onMockData: () => void;
  progress: string;
}

export function WelcomeScreen({
  onPickFile,
  onMockData,
  progress,
}: WelcomeScreenProps) {
  const { isDark, theme } = useTheme();

  return (
    <ImageBackground
      source={require("../../assets/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.content}>
        <View style={styles.centerSection}>
          <View style={[styles.iconBadge]}>
            <MaterialIcons name="discord" size={100} color="#ffffff" />
          </View>

          <TTitle style={styles.title}>Data Package Analyzer</TTitle>
          <TText variant="primary" weight="medium" style={styles.subtitle}>
            Analyze your Discord data package to understand your data and
            improve your privacy and security.
          </TText>
        </View>

        <View
          style={{
            paddingBottom: 40,
            gap: 6,
          }}
        >
          <Button variant="primary" onPress={onPickFile}>
            <ButtonText weight="semibold">Choose Package</ButtonText>
          </Button>

          <Button
            variant="secondary"
            onPress={onMockData}
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
  container: {
    flex: 1,
    backgroundColor: "#1c1c22", // fallback
  },
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
    fontWeight: "medium",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  progressBadge: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  progressText: {
    fontSize: 13,
  },
});
