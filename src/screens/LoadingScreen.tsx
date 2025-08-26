import { TView, TText, useTheme } from "../theme";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

interface LoadingScreenProps {
  progress: string;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const { isDark } = useTheme();

  return (
    <TView variant="background" style={styles.centerContainer}>
      <TText variant="primary" style={styles.progressText}>
        {progress}
      </TText>
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
  progressText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
});
