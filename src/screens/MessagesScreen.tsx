import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { TText, TView, useTheme } from "@/src/theme";

export function MessagesScreen() {
  const { isDark } = useTheme();

  return (
    <TView variant="background" style={styles.container}>
      <View style={styles.content}>
        <TText variant="primary" weight="bold" style={styles.title}>
          Messages
        </TText>
        <TText variant="secondary" style={styles.subtitle}>
          Coming soon
        </TText>
      </View>
      <StatusBar style={isDark ? "light" : "dark"} />
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
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});
