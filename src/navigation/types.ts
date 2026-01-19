import type { EventCount, ExtractedData } from "@/modules/dpkg-module";

export type RootStackParamList = {
  Welcome: undefined;
  Start: undefined;
  Process: { mode: "demo" | "package" };
  Overview: { data: ExtractedData };
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
