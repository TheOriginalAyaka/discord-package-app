import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import {
  AppearanceSection,
  AppInfo,
  CreditsSection,
  DeviceInfo,
} from "@/src/components/sections";
import { Header } from "@/src/components/ui";
import type { RootStackParamList } from "@/src/navigation/types";
import { TView, useTheme } from "@/src/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Settings">;

export function SettingsScreen() {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <AppearanceSection />
        <CreditsSection />
        <AppInfo />
        <DeviceInfo />

        <View style={{ height: 24 }} />
      </ScrollView>

      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}
