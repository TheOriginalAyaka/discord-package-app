import {
  createContext,
  type ReactNode,
  useCallback,
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
  processFile: (uri: string, options?: { generateAnalytics?: boolean }) => void;
  useMockData: () => void;
  resetData: () => void;
  cancelProcessing: () => void;
  analyticsError: string | null;
  enabledFeatures: Set<Feature>;
  setEnabledFeatures: (next: Set<Feature>) => void;
  isFeatureEnabled: (feature: Feature) => boolean;
}

// expand soon:tm:
export type Feature = "overview" | "analytics" | "messages";

const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

export function DiscordProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ExtractedData>();
  const [analytics, setAnalytics] = useState<EventCount>();
  const [progress, setProgress] = useState("");
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [mockDataTimeouts, setMockDataTimeouts] = useState<NodeJS.Timeout[]>(
    [],
  );
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [enabledFeatures, setEnabledFeaturesState] = useState<Set<Feature>>(
    new Set<Feature>(["overview", "analytics"]),
  );

  const isFeatureEnabled = useCallback(
    (feature: Feature) => enabledFeatures.has(feature),
    [enabledFeatures],
  );

  const setEnabledFeatures = useCallback((next: Set<Feature>) => {
    setEnabledFeaturesState(new Set(next));
  }, []);

  const cancelExtraction = useCallback(() => {
    if (!extractionId) return false;
    return dpkgModule.cancelExtraction(extractionId);
  }, [extractionId]);

  useEffect(() => {
    const dataEvent = dpkgModule.addListener("onComplete", (e) => {
      console.log("complete event:", JSON.stringify(e.result, null, 2));
      setData(e.result);
      setIsLoadingUserData(false);
      setAnalyticsError(null);

      if (!isFeatureEnabled("analytics")) {
        // only process analytics when enabled
        setIsLoadingAnalytics(false);
        setProgress("");
        setAnalytics(undefined);
        setExtractionId("");
        return;
      }

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

      if (e.error.step === "analytics") {
        setAnalyticsError(e.error.message);
        setIsLoadingAnalytics(false);
        setProgress("");
      } else {
        setIsLoadingUserData(false);
        setIsLoadingAnalytics(false);
        setProgress(`${e.error.title}: ${e.error.message}`);
      }
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
  }, [isFeatureEnabled]);

  useEffect(() => {
    return () => {
      mockDataTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [mockDataTimeouts]);

  const processFile = (
    uri: string,
    options?: { generateAnalytics?: boolean },
  ) => {
    if (isLoadingUserData || isLoadingAnalytics) {
      console.log("Already processing, skipping");
      return;
    }

    console.log("Processing file:", uri, "options:", options);
    const enableAnalytics = options?.generateAnalytics !== false;
    const next = new Set<Feature>(["overview"]);
    if (enableAnalytics) next.add("analytics");
    setEnabledFeatures(next);

    const extId = dpkgModule.startExtraction(
      uri.replace("file://", ""),
      enableAnalytics,
    );

    if (extId) {
      setIsLoadingUserData(true);
      setIsLoadingAnalytics(false);
      setData(undefined);
      setAnalytics(undefined);
      setProgress("Loading user data...");
      setExtractionId(extId);
      setAnalyticsError(null);
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

    const timeout1 = setTimeout(() => {
      setData(mockData.UserData as ExtractedData);
      setIsLoadingUserData(false);
      setIsLoadingAnalytics(true);
      setProgress("Loading analytics...");
    }, 3000);

    const timeout2 = setTimeout(() => {
      setAnalytics(mockData.EventCount as EventCount);
      setIsLoadingAnalytics(false);
      setProgress("");
    }, 10000);

    setMockDataTimeouts([timeout1, timeout2]);
  };

  const cancelProcessing = () => {
    console.log("cancelling processing...");

    mockDataTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    setMockDataTimeouts([]);

    cancelExtraction();

    setIsLoadingUserData(false);
    setIsLoadingAnalytics(false);
    setProgress("");
    setExtractionId("");
  };

  const resetData = () => {
    mockDataTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    setMockDataTimeouts([]);

    setData(undefined);
    setAnalytics(undefined);
    setProgress("");
    setIsLoadingUserData(false);
    setIsLoadingAnalytics(false);
    setExtractionId("");
    setAnalyticsError(null);
  };

  const value: DiscordContextType = {
    data,
    analytics,
    progress,
    isLoadingUserData,
    isLoadingAnalytics,
    analyticsError,
    processFile,
    useMockData,
    resetData,
    cancelProcessing,
    enabledFeatures,
    setEnabledFeatures,
    isFeatureEnabled,
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
