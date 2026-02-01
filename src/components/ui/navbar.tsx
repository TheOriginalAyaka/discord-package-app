import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TText, TView, useTheme } from "@/src/theme";
import type { MaterialIconName } from "@/src/types";

interface TabConfig {
  id: string;
  label: string;
  icon: MaterialIconName;
  disabled?: boolean;
}

interface NavbarProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export default function Navbar({ tabs, activeTab, onTabPress }: NavbarProps) {
  const { theme } = useTheme();

  return (
    <TView
      variant="foreground"
      style={[
        styles.container,
        {
          paddingBottom: 22,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.border,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.disabled ?? false;
        const opacity = isDisabled ? 0.5 : isActive ? 1 : 0.7;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
            disabled={isDisabled}
          >
            <View style={[styles.tabContent, { opacity }]}>
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={isActive ? theme.primary : theme.secondary}
              />
              <TText
                variant={isActive ? "primary" : "secondary"}
                weight={isActive ? "semibold" : "regular"}
                style={styles.label}
              >
                {tab.label}
              </TText>
            </View>
          </TouchableOpacity>
        );
      })}
    </TView>
  );
}

export type { TabConfig };

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: -8,
    width: 32,
    height: 3,
    borderRadius: 2,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
