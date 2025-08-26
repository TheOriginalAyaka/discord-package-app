import { TView, TText, useTheme } from "../theme";
import { StyleSheet, Button } from "react-native";
import { StatusBar } from "expo-status-bar";

interface WelcomeScreenProps {
  onPickFile: () => void;
  progress: string;
}

export function WelcomeScreen({ onPickFile, progress }: WelcomeScreenProps) {
  const { isDark } = useTheme();

  return (
    <TView variant="background" style={styles.centerContainer}>
      <TText variant="primary" style={styles.title}>
        Discord Data Analyzer
      </TText>
      <TText variant="secondary" style={styles.subtitle}>
        Select your Discord data package to get started
      </TText>
      <TView style={styles.buttonContainer}>
        <Button title="Pick Data Package" onPress={onPickFile} />
      </TView>
      {progress && (
        <TText variant="tertiary" style={styles.progressText}>
          {progress}
        </TText>
      )}
      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 15,
  },
  devNote: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});
