import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { handleLinkPress } from "@/src/lib/utils";
import { TText, TView, useTheme } from "@/src/theme";

export function PrivacyScreen() {
  const { isDark, theme } = useTheme();

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, paddingTop: 16 }}>
        <TableRowGroup
          title="Your Data Stays on Your Device"
          description="Dispackage is designed with privacy as a core principle. Your Discord data never leaves your device."
        >
          <TableRow>
            <View style={styles.tableRowContent}>
              <MaterialIcons
                name="phonelink-lock"
                size={24}
                color={theme.primary}
              />
              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Local Processing
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  All data processing happens entirely on your device. Your
                  Discord package is never uploaded to any server.
                </TText>
              </View>
            </View>
          </TableRow>
          <TableRow>
            <View style={styles.tableRowContent}>
              <MaterialIcons name="cloud-off" size={24} color={theme.primary} />
              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  No Server Connection
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  The app works completely offline. No internet connection is
                  required to analyze your data.
                </TText>
              </View>
            </View>
          </TableRow>
          <TableRow>
            <View style={styles.tableRowContent}>
              <MaterialIcons
                name="delete-forever"
                size={24}
                color={theme.primary}
              />
              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  No Data Retention
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  Your data is only held in memory while viewing. Closing the
                  app clears everything.
                </TText>
              </View>
            </View>
          </TableRow>
        </TableRowGroup>

        <TableRowGroup
          title="What We Access"
          description="Transparency about what the app reads from your Discord data package."
        >
          <TableRow>
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
                  Your Data Package
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  The app reads the ZIP file you select to extract and display
                  your Discord data.
                </TText>
              </View>
            </View>
          </TableRow>
          <TableRow>
            <View style={styles.tableRowContent}>
              <MaterialIcons name="storage" size={24} color={theme.primary} />
              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Local Storage
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  Only your theme preference is stored locally. No personal data
                  is persisted.
                </TText>
              </View>
            </View>
          </TableRow>
        </TableRowGroup>

        <TableRowGroup
          title="Open Source"
          description="Verify our privacy claims by reviewing the source code yourself."
        >
          <TableRow
            onPress={() =>
              handleLinkPress(
                "https://github.com/TheOriginalAyaka/discord-package-app",
              )
            }
          >
            <View style={styles.tableRowContent}>
              <MaterialIcons name="code" size={24} color={theme.primary} />
              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  View Source Code
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  Both the app and Rust parser are open source on GitHub.
                </TText>
              </View>
              <MaterialIcons
                name="open-in-new"
                size={20}
                color={theme.secondary}
              />
            </View>
          </TableRow>
          <TableRow
            onPress={() =>
              handleLinkPress("https://dispackage.thereallo.dev/privacy")
            }
          >
            <View style={styles.tableRowContent}>
              <MaterialIcons
                name="description"
                size={24}
                color={theme.primary}
              />
              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Full Privacy Policy
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  Read the complete privacy policy on our website.
                </TText>
              </View>
              <MaterialIcons
                name="open-in-new"
                size={20}
                color={theme.secondary}
              />
            </View>
          </TableRow>
        </TableRowGroup>

        <View style={{ height: 24 }} />
      </ScrollView>
      <StatusBar style={isDark ? "light" : "dark"} />
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
});
