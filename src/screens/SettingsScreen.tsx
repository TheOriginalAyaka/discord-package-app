import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { StatusBar } from "expo-status-bar";
import { Linking, Platform, ScrollView, StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Checkbox, Header, TableRow, TableRowGroup } from "@/src/components/ui";
import type { RootStackParamList } from "@/src/navigation/types";
import { TText, TView, useTheme, useThemeControls } from "@/src/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Settings">;

export function SettingsScreen() {
  const { isDark, theme } = useTheme();
  const { toggleTheme } = useThemeControls();
  const navigation = useNavigation<NavigationProp>();

  const appVersion = Application.nativeApplicationVersion || "Unknown";
  const buildVersion = Application.nativeBuildVersion || "Unknown";
  const deviceModel = Device.modelName || "Unknown";
  const osVersion = `${Device.osName} ${Device.osVersion}`;
  const deviceType = Device.deviceType === 2 ? "Tablet" : "Phone";

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <TableRowGroup
          title="Appearance"
          description="Customize how the app looks"
        >
          <TableRow onPress={toggleTheme}>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons
                  name="brightness-6"
                  size={24}
                  color={theme.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Dark Mode
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  {isDark ? "Dark theme enabled" : "Light theme enabled"}
                </TText>
              </View>

              <Checkbox value={isDark} onValueChange={toggleTheme} />
            </View>
          </TableRow>
        </TableRowGroup>

        {/* Credits Section */}
        <TableRowGroup
          title="Credits"
          description="People who made this app possible"
        >
          <TableRow
            onPress={() => handleLinkPress("https://github.com/theoriginalayaka")}
          >
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons name="code" size={24} color={theme.primary} />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Developer
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  Main application developer
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
            onPress={() => handleLinkPress("https://github.com/theoriginalayaka/discord-package-app")}
          >
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name="github"
                  size={24}
                  color={theme.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Source Code
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  View on GitHub
                </TText>
              </View>

              <MaterialIcons
                name="open-in-new"
                size={20}
                color={theme.secondary}
              />
            </View>
          </TableRow>

          <TableRow>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons name="group" size={24} color={theme.primary} />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Contributors
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  Thanks to all open source contributors
                </TText>
              </View>
            </View>
          </TableRow>
        </TableRowGroup>

        {/* Device Information */}
        <TableRowGroup
          title="Device Information"
          description="Details about your device"
        >
          <TableRow disabled>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons
                  name="phone-android"
                  size={24}
                  color={theme.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Device Model
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  {deviceModel}
                </TText>
              </View>

              <TText variant="secondary" style={{ fontSize: 14 }}>
                {deviceType}
              </TText>
            </View>
          </TableRow>

          <TableRow disabled>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons
                  name="settings"
                  size={24}
                  color={theme.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Operating System
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  {osVersion}
                </TText>
              </View>
            </View>
          </TableRow>

          {Platform.OS === "ios" && (
            <TableRow disabled>
              <View style={styles.tableRowContent}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: `${theme.primary}20` },
                  ]}
                >
                  <MaterialIcons
                    name="smartphone"
                    size={24}
                    color={theme.primary}
                  />
                </View>

                <View style={styles.textContainer}>
                  <TText
                    variant="primary"
                    weight="semibold"
                    style={{ fontSize: 16, lineHeight: 20 }}
                  >
                    Device Name
                  </TText>
                  <TText
                    variant="secondary"
                    style={{ fontSize: 12, lineHeight: 16 }}
                  >
                    {Device.deviceName || "Unknown"}
                  </TText>
                </View>
              </View>
            </TableRow>
          )}
        </TableRowGroup>

        {/* App Information */}
        <TableRowGroup
          title="App Information"
          description="Version and build details"
        >
          <TableRow disabled>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons name="info" size={24} color={theme.primary} />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  App Version
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  Current version of the app
                </TText>
              </View>

              <TText variant="secondary" style={{ fontSize: 14 }}>
                v{appVersion}
              </TText>
            </View>
          </TableRow>

          <TableRow disabled>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons name="build" size={24} color={theme.primary} />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Build Number
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  Internal build identifier
                </TText>
              </View>

              <TText variant="secondary" style={{ fontSize: 14 }}>
                {buildVersion}
              </TText>
            </View>
          </TableRow>

          <TableRow disabled>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialIcons name="apps" size={24} color={theme.primary} />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Bundle ID
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {Application.applicationId || "Unknown"}
                </TText>
              </View>
            </View>
          </TableRow>

          <TableRow disabled>
            <View style={styles.tableRowContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${theme.primary}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name="react"
                  size={24}
                  color={theme.primary}
                />
              </View>

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Framework
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  React Native with Expo
                </TText>
              </View>
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
  content: {
    flex: 1,
  },
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
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
