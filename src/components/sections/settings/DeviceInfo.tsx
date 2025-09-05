import * as Clipboard from "expo-clipboard";
import * as Device from "expo-device";
import { Platform, StyleSheet, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TableRow, TableRowGroup, useToast } from "@/src/components/ui";
import { TText, useTheme } from "@/src/theme";

const deviceModel = Device.modelName || "Unknown";
const osVersion = `${Device.osName} ${Device.osVersion}`;
const deviceType = Device.deviceType === 2 ? "Tablet" : "Phone";

const deviceInfoData = [
  {
    label: "Device Model",
    value: `${deviceModel} (${deviceType})`,
    icon: "phone-android",
  },
  {
    label: "Operating System",
    value: osVersion,
    icon: "settings",
  },
  // idk why i did this i just wanted to check device name only if it's ios
  ...(Platform.OS === "ios"
    ? [
        {
          label: "Device Name",
          value: Device.deviceName || "Unknown",
          icon: "label",
        },
      ]
    : []),
];

export function DeviceInfo() {
  const { theme } = useTheme();
  const { showToast } = useToast();

  return (
    <TableRowGroup title="Device Information">
      {deviceInfoData.map((item) => (
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
            <MaterialIcons name={item.icon} size={24} color={theme.primary} />

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
