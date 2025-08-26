import { TView, TText } from "../theme";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../theme";
import { Button, ButtonText } from "../components/ui";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface WelcomeScreenProps {
  onPickFile: () => void;
  progress: string;
}

export function WelcomeScreen({ onPickFile, progress }: WelcomeScreenProps) {
  const { isDark, theme } = useTheme();

  return (
    <TView variant="background" style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.content}>
        <View style={[styles.iconBadge, { backgroundColor: theme.accent }]}>
          <MaterialIcons name="discord" size={40} color="#ffffff" />
        </View>

        <TText weight="bold" style={styles.title}>
          Data Package Analyzer
        </TText>
        <TText variant="secondary" style={styles.subtitle}>
          Select your Discord data package to begin analysis
        </TText>

        <Button variant="primary" onPress={onPickFile}>
          <ButtonText weight="semibold">Choose Package</ButtonText>
        </Button>

        {progress && (
          <View style={styles.progressBadge}>
            <TText variant="tertiary" style={styles.progressText}>
              {progress}
            </TText>
          </View>
        )}
      </View>
    </TView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
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
