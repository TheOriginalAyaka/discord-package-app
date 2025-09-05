import type { EventCount, ExtractedData } from "@/modules/dpkg-module";

export type RootStackParamList = {
  Welcome: undefined;
  Overview: { data: ExtractedData };
  Analytics: { analytics: EventCount };
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
