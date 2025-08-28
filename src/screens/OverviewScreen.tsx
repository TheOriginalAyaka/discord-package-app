// src/screens/OverviewScreen.tsx
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  FavChannelsList,
  FavDmsList,
  FavTextList,
  ProfileList,
} from "@/src/components";
import { Header, TableRow, TableRowGroup } from "@/src/components/ui";
import { useDiscordContext } from "@/src/context/DiscordContext";
import type { RootStackParamList } from "@/src/navigation/types";
import { TText, TView, useTheme, useThemeControls } from "@/src/theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Overview">;

export function OverviewScreen() {
  const { isDark, theme } = useTheme();
  const { toggleTheme, mode } = useThemeControls();
  const { data, analytics, isLoadingAnalytics, resetData } =
    useDiscordContext();
  const navigation = useNavigation<NavigationProp>();

  if (!data) {
    navigation.navigate("Welcome");
    return null;
  }

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <Header
        title="Analysis"
        onBack={() => {
          resetData();
          navigation.navigate("Welcome");
        }}
      />

      <ScrollView style={{ flex: 1 }}>
        <ProfileList
          data={data}
          analytics={analytics}
          isLoadingAnalytics={isLoadingAnalytics}
        />
        <FavTextList data={data} />
        <FavDmsList data={data} />
        <FavChannelsList data={data} />

        <TableRowGroup title="Settings">
          <TableRow onPress={toggleTheme}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <MaterialIcons
                name="brightness-6"
                size={24}
                color={theme.primary}
              />
              <TText style={{ marginLeft: 16 }}>Theme</TText>
            </View>
            <TText variant="secondary">{mode}</TText>
          </TableRow>
        </TableRowGroup>

        <View style={{ height: 24 }} />
      </ScrollView>

      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}
