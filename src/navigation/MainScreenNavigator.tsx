import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { triggerSelection } from "@renegades/react-native-tickle";
import { Navbar } from "@/src/components/ui";
import type { TabConfig } from "@/src/components/ui/navbar";
import { MessagesScreen, OverviewScreen, SettingsScreen } from "@/src/screens";
import { useTheme } from "@/src/theme";
import type { MaterialIconName } from "@/src/types";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabList: Record<string, { label: string; icon: MaterialIconName }> = {
  Overview: { label: "Overview", icon: "home" },
  Messages: { label: "Messages", icon: "message" },
  Settings: { label: "Settings", icon: "settings" },
};

function TabBar({ state, navigation }: BottomTabBarProps) {
  const activeRoute = state.routes[state.index];

  const tabs: TabConfig[] = state.routes.map((route) => {
    const meta = tabList[route.name];
    return {
      id: route.key,
      label: meta?.label ?? route.name,
      icon: meta?.icon ?? "circle",
    };
  });

  const handleTabPress = (tabKey: string) => {
    const route = state.routes.find((r) => r.key === tabKey);
    if (!route) return;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (activeRoute.key !== tabKey && !event.defaultPrevented) {
      triggerSelection();
      navigation.navigate(route.name, route.params);
    }
  };

  const handleTabLongPress = (tabKey: string) => {
    navigation.emit({
      type: "tabLongPress",
      target: tabKey,
    });
    triggerSelection();
  };

  return (
    <Navbar
      tabs={tabs}
      activeTab={activeRoute.key}
      onTabPress={handleTabPress}
      onTabLongPress={handleTabLongPress}
    />
  );
}

export default function MainScreenNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.background },
      }}
      initialRouteName="Overview"
    >
      <Tab.Screen name="Overview" component={OverviewScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
