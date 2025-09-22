import { StatusBar } from "expo-status-bar";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import {
  AppearanceSection,
  AppInfo,
  CreditsSection,
  DeviceInfo,
  SupportSection,
} from "@/src/components/sections";
import { TView, useTheme } from "@/src/theme";

export function SettingsScreen() {
  const { isDark } = useTheme();

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, paddingTop: 16 }}>
        <AppearanceSection />
        <CreditsSection />
        <SupportSection />
        <AppInfo />
        <DeviceInfo />

        <View style={{ height: 24 }} />
      </ScrollView>

      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}
