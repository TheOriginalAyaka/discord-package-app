import { View, Text } from "react-native";
import { useDiscord } from "./hooks/useDiscord";
import { AnalysisScreen, LoadingScreen, WelcomeScreen } from "./screens";
import { ThemeProvider } from "./theme";
import { useCustomFonts } from "./theme/fonts";

export default function App() {
  const { data, progress, isLoading, pickAndProcessFile, resetData } =
    useDiscord();
  const fontsLoaded = useCustomFonts();

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1c1c22",
        }}
      >
        <Text style={{ color: "#ffffff" }}>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider defaultMode="dark">
      {isLoading ? (
        <LoadingScreen progress={progress} />
      ) : !data ? (
        <WelcomeScreen onPickFile={pickAndProcessFile} progress={progress} />
      ) : (
        <AnalysisScreen data={data} onBack={resetData} />
      )}
    </ThemeProvider>
  );
}
