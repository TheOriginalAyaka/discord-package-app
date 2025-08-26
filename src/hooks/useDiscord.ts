import * as DocumentPicker from "expo-document-picker";
import { useEffect, useState } from "react";
import dpkgModule, { type ExtractedData } from "../../modules/dpkg-module";

// import mockData from "../../mock.json";

const mock = false;

export function useDiscord() {
  const [data, setData] = useState<ExtractedData>();
  const [progress, setProgress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const complete = dpkgModule.addListener("onComplete", (e) => {
      console.log("complete event:", JSON.stringify(e.result, null, 2));
      setData(e.result);
      setIsLoading(false);
      setProgress("");
    });

    const error = dpkgModule.addListener("onError", (e) => {
      console.log("error event:", e.message);
      setIsLoading(false);
      setProgress(`Error: ${e.message}`);
    });

    const progressListener = dpkgModule.addListener("onProgress", (e) => {
      console.log("progress event:", e.step);
      setProgress(e.step);
    });

    return () => {
      complete.remove();
      error.remove();
      progressListener.remove();
    };
  }, []);

  const pickAndProcessFile = async () => {
    if (mock) {
      // mock
      console.log("using mock data for development");
      setIsLoading(true);
      setData(undefined);
      setProgress("Loading mock data...");

      // setData(mockData as ExtractedData);
      setIsLoading(false);
      setProgress("");
    } else {
      // Use real file processing
      const file = await DocumentPicker.getDocumentAsync({
        type: "application/zip",
      });
      if (!file.canceled && file.assets[0]) {
        console.log("uri", file.assets[0].uri);
        setIsLoading(true);
        setData(undefined);
        dpkgModule.process(file.assets[0].uri.replace("file://", ""));
      }
    }
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
    resetData,
  };
}
