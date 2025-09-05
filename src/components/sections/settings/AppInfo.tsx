import * as Application from "expo-application";
import * as Clipboard from "expo-clipboard";
import { StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TableRow, TableRowGroup, useToast } from "@/src/components/ui";
import { TText, useTheme } from "@/src/theme";

const appInfoData = [
  {
    label: "App Version",
    value: Application.nativeApplicationVersion || "Unknown",
    icon: "info",
    iconType: "material",
  },
  {
    label: "Build Number",
    value: Application.nativeBuildVersion || "Unknown",
    icon: "hammer",
    iconType: "material-community",
  },
  {
    label: "Bundle ID",
    value: Application.applicationId || "Unknown",
    icon: "apps",
    iconType: "material",
  },
  {
    label: "Framework",
    value: "Expo",
    icon: "image-filter-center-focus-weak",
    iconType: "material-community",
  },
];

export function AppInfo() {
  const { theme } = useTheme();
  const { showToast } = useToast();

  // dumb icon handler
  const renderIcon = (item: (typeof appInfoData)[0]) => {
    if (item.iconType === "material-community") {
      return (
        <MaterialCommunityIcons
          name={item.icon}
          size={24}
          color={theme.primary}
        />
      );
    }
    return <MaterialIcons name={item.icon} size={24} color={theme.primary} />;
  };

  return (
    <TableRowGroup title="App Information">
      {appInfoData.map((item) => (
        <TableRow
          key={item.label}
          onPress={() => {
            Clipboard.setStringAsync(`${item.label}: ${item.value}`);
            showToast({
              icon: "copy-all",
              text: "Copied to clipboard",
            });
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {renderIcon(item)}

            <TText variant="primary" weight="semibold" style={styles.labelText}>
              {item.label}
            </TText>

            <TText
              variant="secondary"
              style={styles.valueText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.value}
            </TText>
          </View>
        </TableRow>
      ))}
    </TableRowGroup>
  );
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
    marginLeft: 16,
  },
  valueText: {
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 150,
  },
});
