import { TView, TText } from "../theme";
import { StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../theme";

interface LoadingScreenProps {
  progress: string;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const { isDark, theme } = useTheme();

  return (
    <TView variant="background" style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <TView style={styles.content}>
        <TView style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme.accent}
            style={styles.spinner}
          />
        </TView>

        <TText weight="medium" style={styles.progressText}>
          {progress}
        </TText>

        <TText variant="muted" style={styles.hintText}>
          This may take a moment...
        </TText>
      </TView>
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
    padding: 32,
  },
  loadingContainer: {
    width: 72,
    height: 72,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
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
});
