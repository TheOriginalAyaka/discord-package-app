import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { DiscordProvider } from "./context/DiscordContext";
import type { RootStackParamList } from "./navigation/types";
import { AnalyticsScreen, OverviewScreen, WelcomeScreen } from "./screens";
import { ThemeProvider, useTheme } from "./theme";
import { useCustomFonts } from "./theme/fonts";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { theme } = useTheme();

  // set system UI with Theme hook
  // https://docs.expo.dev/versions/latest/sdk/system-ui/
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider defaultMode="dark">
      <DiscordProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </DiscordProvider>
    </ThemeProvider>
  );
}
