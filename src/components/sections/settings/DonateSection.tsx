import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { handleLinkPress } from "@/src/lib/utils";
import { TText, useTheme } from "@/src/theme";

export function DonateSection() {
  const { theme } = useTheme();

  return (
    <TableRowGroup
      title="Support the App"
      description="If this app helped you, consider supporting development through voluntary donations!"
    >
      <TableRow
        onPress={() => handleLinkPress("https://ko-fi.com/theoriginalayaka")}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="coffee"
            size={24}
            color={theme.primary}
          />

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              marginLeft: 16,
            }}
          >
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              Buy me a coffee
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              theoriginalayaka
            </TText>
          </View>

          <MaterialIcons name="open-in-new" size={20} color={theme.secondary} />
        </View>
      </TableRow>

      <TableRow
        onPress={() =>
          handleLinkPress("https://github.com/sponsors/TheOriginalAyaka")
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name="github"
            size={24}
            color={theme.primary}
          />

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              marginLeft: 16,
            }}
          >
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              GitHub Sponsors
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              TheOriginalAyaka
            </TText>
          </View>

          <MaterialIcons name="open-in-new" size={20} color={theme.secondary} />
        </View>
      </TableRow>
    </TableRowGroup>
  );
}
