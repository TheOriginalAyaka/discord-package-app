import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import mockData from "../../mock.json";
import dpkgModule, {
  type EventCount,
  type ExtractedData,
} from "../../modules/dpkg-module";

export function useDiscord() {
  const [data, setData] = useState<ExtractedData>();
  const [_, setAnalytics] = useState<EventCount>();
  const [progress, setProgress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dataEvent = dpkgModule.addListener("onComplete", (e) => {
      console.log("complete event:", JSON.stringify(e.result, null, 2));
      setData(e.result);
      setIsLoading(false);
      setProgress("");
    });

    const analyticsEvent = dpkgModule.addListener(
      "onAnalyticsComplete",
      (e) => {
        console.log("complete event:", JSON.stringify(e.result, null, 2));
        setAnalytics(e.result);
        setIsLoading(false);
        setProgress("");
      },
    );

    const errorEvent = dpkgModule.addListener("onError", (e) => {
      console.log("error event:", e.error.message);
      setIsLoading(false);
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
    const file = await DocumentPicker.getDocumentAsync({
      type: "application/zip",
    });
    if (!file.canceled && file.assets[0]) {
      console.log("uri", file.assets[0].uri);
      setIsLoading(true);
      setData(undefined);
      dpkgModule.startExtraction(file.assets[0].uri.replace("file://", ""));
    }
  };

  const useMockData = async () => {
    console.log("using mock data");
    setIsLoading(true);
    setData(undefined);
    setProgress("Loading demo...");

    setTimeout(() => {
      setData(mockData as ExtractedData);
      setIsLoading(false);
      setProgress("");
    }, 3000);
  };

  const resetData = () => {
    setData(undefined);
    setProgress("");
    setIsLoading(false);
  };

  return {
    data,
    progress,
    isLoading,
    pickAndProcessFile,
    useMockData,
    resetData,
  };
}
