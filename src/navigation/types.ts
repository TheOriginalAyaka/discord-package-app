import type { NavigatorScreenParams } from "@react-navigation/native";
import type { EventCount } from "@/modules/dpkg-module";

export type MainTabParamList = {
  Overview: undefined;
  Messages: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  Start: undefined;
  Process: { mode: "demo" | "package" };
  MainScreen: NavigatorScreenParams<MainTabParamList>;
  Analytics: { analytics: EventCount };
  Settings: undefined;
  Help: undefined;
  Privacy: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
