import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HapticProvider } from "@renegades/react-native-tickle";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Header, ToastProvider } from "./components/ui";
import { DiscordProvider } from "./context/DiscordContext";
import type { RootStackParamList } from "./navigation/types";
import {
  AnalyticsScreen,
  HelpScreen,
  OverviewScreen,
  PrivacyScreen,
  ProcessScreen,
  SettingsScreen,
  StartScreen,
  WelcomeScreen,
} from "./screens";
import { ThemeProvider, useTheme } from "./theme";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { theme, isLoading } = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // don't render nav until theme is ready
  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route, options, back }) => {
          const disabled = ["Welcome", "Process"];
          if (disabled.includes(route.name)) return null;

          return (
            <Header
              title={options.title ?? route.name}
              onBack={back ? () => navigation.goBack() : undefined}
              onExtra={
                route.name === "Overview"
                  ? () => navigation.navigate("Settings")
                  : route.name === "Start"
                    ? () => navigation.navigate("Help")
                    : undefined
              }
              extraIcon={
                route.name === "Overview"
                  ? "settings"
                  : route.name === "Start"
                    ? "help-outline"
                    : undefined
              }
            />
          );
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false, headerBackButtonMenuEnabled: false }}
      />
      <Stack.Screen
        name="Start"
        component={StartScreen}
        options={{ title: "Configure Package" }}
      />
      <Stack.Screen
        name="Process"
        component={ProcessScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Overview"
        component={OverviewScreen}
        options={{ title: "Overview" }}
      />
      <Stack.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: "Analytics" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: "Help" }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: "Privacy" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <HapticProvider>
      <SafeAreaProvider>
        <ThemeProvider defaultMode="dark">
          <DiscordProvider>
            <ToastProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </ToastProvider>
          </DiscordProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </HapticProvider>
  );
}
