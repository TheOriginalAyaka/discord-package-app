import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import {
  Radio,
  RadioGroup,
  RadioItem,
  TableRow,
  TableRowGroup,
  Toggle,
} from "@/src/components/ui";
import { TText, useTheme, useThemeControls } from "@/src/theme";

export function AppearanceSection() {
  const { theme, mode, actualTheme } = useTheme();
  const { setLightMode, setDarkMode, setSystemMode } = useThemeControls();

  const isSystemMode = mode === "system";

  // shows which theme is active but keep radios disabled
  const radioValue = isSystemMode ? actualTheme : mode;

  const handleThemeChange = (newMode: string) => {
    if (newMode === "light") {
      setLightMode();
    } else if (newMode === "dark") {
      setDarkMode();
    }
  };

  const toggleSystemMode = () => {
    if (isSystemMode) {
      // keep the current theme when turning off system
      if (actualTheme === "light") {
        setLightMode();
      } else {
        setDarkMode();
      }
    } else {
      setSystemMode();
    }
  };

  return (
    <RadioGroup
      value={radioValue}
      onValueChange={handleThemeChange}
      disabled={isSystemMode}
    >
      <TableRowGroup
        title="Appearance"
        description="Customize how the app looks"
      >
        <TableRow
          disabled={isSystemMode}
          onPress={() => !isSystemMode && handleThemeChange("light")}
        >
          <RadioItem value="light">
            <View style={styles.tableRowContent}>
              <MaterialIcons
                name="light-mode"
                size={24}
                color={theme.primary}
              />

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Light
                </TText>
                {isSystemMode && actualTheme === "light" && (
                  <TText
                    variant="muted"
                    style={{ fontSize: 12, lineHeight: 16 }}
                  >
                    Active (System)
                  </TText>
                )}
              </View>

              <Radio
                value={radioValue === "light"}
                onValueChange={() => {}}
                disabled={isSystemMode}
              />
            </View>
          </RadioItem>
        </TableRow>

        <TableRow
          disabled={isSystemMode}
          onPress={() => !isSystemMode && handleThemeChange("dark")}
        >
          <RadioItem value="dark">
            <View style={styles.tableRowContent}>
              <MaterialIcons name="dark-mode" size={24} color={theme.primary} />

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  Dark
                </TText>
                {isSystemMode && actualTheme === "dark" && (
                  <TText
                    variant="muted"
                    style={{ fontSize: 12, lineHeight: 16 }}
                  >
                    Active (System)
                  </TText>
                )}
              </View>

              <Radio
                value={radioValue === "dark"}
                onValueChange={() => {}}
                disabled={isSystemMode}
              />
            </View>
          </RadioItem>
        </TableRow>

        {/* this row is NOT wrapped in RadioItem, so won't be part of the radio group even if it is wrapped inside of it */}
        <TableRow onPress={toggleSystemMode}>
          <View style={styles.tableRowContent}>
            <MaterialIcons
              name="brightness-auto"
              size={24}
              color={theme.primary}
            />

            <View style={styles.textContainer}>
              <TText
                variant="primary"
                weight="semibold"
                style={{ fontSize: 16, lineHeight: 20 }}
              >
                Follow System Theme
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                {isSystemMode
                  ? `Currently using ${actualTheme} theme`
                  : "Automatically match your device theme settings"}
              </TText>
            </View>

            <Toggle value={isSystemMode} onValueChange={toggleSystemMode} />
          </View>
        </TableRow>
      </TableRowGroup>
    </RadioGroup>
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
