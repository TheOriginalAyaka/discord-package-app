import * as DocumentPicker from "expo-document-picker";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import mockData from "@/mock.json";
import dpkgModule, {
  type EventCount,
  type ExtractedData,
} from "@/modules/dpkg-module";

interface DiscordContextType {
  data: ExtractedData | undefined;
  analytics: EventCount | undefined;
  progress: string;
  isLoadingUserData: boolean;
  isLoadingAnalytics: boolean;
  pickAndProcessFile: () => Promise<void>;
  useMockData: () => void;
  resetData: () => void;
}

const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

export function DiscordProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ExtractedData>();
  const [analytics, setAnalytics] = useState<EventCount>();
  const [progress, setProgress] = useState("");
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  useEffect(() => {
    const dataEvent = dpkgModule.addListener("onComplete", (e) => {
      console.log("complete event:", JSON.stringify(e.result, null, 2));
      setData(e.result);
      setIsLoadingUserData(false);
      setIsLoadingAnalytics(true);
      setProgress("Loading analytics...");
    });

    const analyticsEvent = dpkgModule.addListener(
      "onAnalyticsComplete",
      (e) => {
        console.log(
          "analytics complete event:",
          JSON.stringify(e.result, null, 2),
        );
        setAnalytics(e.result);
        setIsLoadingAnalytics(false);
        setProgress("");
      },
    );

    const errorEvent = dpkgModule.addListener("onError", (e) => {
      console.log("error event:", e.error.message);
      setIsLoadingUserData(false);
      setIsLoadingAnalytics(false);
      setProgress(`${e.error.title}: ${e.error.message}`);
    });

    const progressEvent = dpkgModule.addListener("onProgress", (e) => {
      console.log("progress event:", e.progress.message);
      setProgress(e.progress.message);
    });

    return () => {
      dataEvent.remove();
      errorEvent.remove();
      progressEvent.remove();
      analyticsEvent.remove();
    };
  }, []);

  const pickAndProcessFile = async () => {
    if (isLoadingUserData || isLoadingAnalytics) {
      console.log("Already loading, skipping file pick");
      return;
    }

    const file = await DocumentPicker.getDocumentAsync({
      type: "application/zip",
    });

    if (!file.canceled && file.assets[0]) {
      console.log("uri", file.assets[0].uri);
      setIsLoadingUserData(true);
      setIsLoadingAnalytics(false);
      setData(undefined);
      setAnalytics(undefined);
      setProgress("Loading user data...");
      dpkgModule.startExtraction(file.assets[0].uri.replace("file://", ""));
    }
  };

  const useMockData = () => {
    if (isLoadingUserData || isLoadingAnalytics) {
      console.log("Already loading, skipping mock data");
      return;
    }

    console.log("using mock data");
    setIsLoadingUserData(true);
    setIsLoadingAnalytics(false);
    setData(undefined);
    setAnalytics(undefined);
    setProgress("Loading demo...");

    setTimeout(() => {
      setData(mockData.UserData as ExtractedData);
      setIsLoadingUserData(false);
      setIsLoadingAnalytics(true);
      setProgress("Loading analytics...");
    }, 3000);
    setTimeout(() => {
      setAnalytics(mockData.EventCount as EventCount);
      setIsLoadingAnalytics(false);
      setProgress("");
    }, 10000);
  };

  const resetData = () => {
    setData(undefined);
    setAnalytics(undefined);
    setProgress("");
    setIsLoadingUserData(false);
    setIsLoadingAnalytics(false);
  };

  const value: DiscordContextType = {
    data,
    analytics,
    progress,
    isLoadingUserData,
    isLoadingAnalytics,
    pickAndProcessFile,
    useMockData,
    resetData,
  };

  return (
    <DiscordContext.Provider value={value}>{children}</DiscordContext.Provider>
  );
}

export function useDiscordContext() {
  const context = useContext(DiscordContext);
  if (!context) {
    throw new Error("useDiscordContext must be used within DiscordProvider");
  }
  return context;
}
