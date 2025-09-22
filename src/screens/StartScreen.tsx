import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  ButtonText,
  Checkbox,
  CheckboxGroup,
  CheckboxItem,
  TableRow,
  TableRowGroup,
} from "../components/ui";
import { type Feature, useDiscordContext } from "../context/DiscordContext";
import type { RootStackParamList } from "../navigation/types";
import { TText, TView, useTheme } from "../theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Start">;

export function StartScreen() {
  const { isDark, theme } = useTheme();
  const { processFile, setEnabledFeatures } = useDiscordContext();
  const navigation = useNavigation<NavigationProp>();

  const [selectedFileUri, setFileUri] = useState<string | null>(null);
  const [selectedFileName, setFileName] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "overview",
    "analytics",
  ]);

  // reset state on unmount
  useEffect(() => {
    return () => {
      setFileUri(null);
      setFileName(null);
      setSelectedOptions(["overview", "analytics"]);
    };
  }, []);

  const handleChooseFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/zip",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const file = result.assets[0];
        setFileUri(file.uri);
        setFileName(file.name);
      }
    } catch (error) {
      console.log("Document picker error:", error);
    }
  };

  const handleProcess = async () => {
    if (!selectedFileUri) return;

    const next = new Set<Feature>(["overview"]);
    if (selectedOptions.includes("analytics")) next.add("analytics");
    setEnabledFeatures(next);

    processFile(selectedFileUri, {
      // TODO: polished DX for toggling parsing
      generateAnalytics: next.has("analytics"),
    });
    navigation.replace("Process", { mode: "package" });
  };

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView style={{ flex: 1, paddingTop: 16 }}>
        <TableRowGroup
          title="Package"
          description="Select your Discord data package"
        >
          <TableRow onPress={handleChooseFile}>
            <View style={styles.tableRowContent}>
              <MaterialIcons
                name="folder-zip"
                size={24}
                color={theme.primary}
              />

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Choose ZIP file
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  {selectedFileName || "No file selected"}
                </TText>
              </View>

              <View>
                <Button
                  variant="primary"
                  onPress={handleChooseFile}
                  style={{ height: 32 }}
                >
                  <ButtonText weight="semibold">Choose ZIP file</ButtonText>
                </Button>
              </View>
            </View>
          </TableRow>
        </TableRowGroup>

        <CheckboxGroup
          value={selectedOptions}
          onValueChange={setSelectedOptions}
        >
          <TableRowGroup
            title="What to include"
            description="Choose which data to process"
          >
            <TableRow disabled>
              <CheckboxItem value="overview">
                <View style={styles.tableRowContent}>
                  <MaterialIcons
                    name="dashboard"
                    size={24}
                    color={theme.primary}
                  />

                  <View style={styles.textContainer}>
                    <TText
                      variant="primary"
                      weight="semibold"
                      style={{ fontSize: 16, lineHeight: 20 }}
                    >
                      Overview
                    </TText>
                    <TText
                      variant="secondary"
                      style={{ fontSize: 12, lineHeight: 16 }}
                    >
                      Basic profile and activity overview
                    </TText>
                  </View>

                  <Checkbox
                    value={selectedOptions.includes("overview")}
                    onValueChange={() => {}}
                    disabled
                  />
                </View>
              </CheckboxItem>
            </TableRow>

            <TableRow
              onPress={() => {
                if (selectedOptions.includes("analytics")) {
                  setSelectedOptions(
                    selectedOptions.filter((o) => o !== "analytics"),
                  );
                } else {
                  setSelectedOptions([...selectedOptions, "analytics"]);
                }
              }}
            >
              <CheckboxItem value="analytics">
                <View style={styles.tableRowContent}>
                  <MaterialIcons
                    name="show-chart"
                    size={24}
                    color={theme.primary}
                  />

                  <View style={styles.textContainer}>
                    <TText
                      variant="primary"
                      weight="semibold"
                      style={{ fontSize: 16, lineHeight: 20 }}
                    >
                      Analytics
                    </TText>
                    <TText
                      variant="secondary"
                      style={{ fontSize: 12, lineHeight: 16 }}
                    >
                      Analytics data collected by Discord
                    </TText>
                  </View>

                  <Checkbox
                    value={selectedOptions.includes("analytics")}
                    onValueChange={() => {}}
                  />
                </View>
              </CheckboxItem>
            </TableRow>
          </TableRowGroup>
        </CheckboxGroup>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          onPress={handleProcess}
          disabled={!selectedFileUri}
        >
          <ButtonText weight="semibold">Process</ButtonText>
        </Button>
      </View>
    </TView>
  );
}

const styles = StyleSheet.create({
  tableRowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    marginLeft: 16,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 12,
  },
});
