import { ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import type { ExtractedData } from "../../modules/dpkg-module";
import { TText, TView, useTheme, useThemeControls } from "../theme";

import { Header, TableRow, TableRowGroup } from "../components/ui";
import {
  FavTextList,
  ProfileList,
  FavDmsList,
  FavChannelsList,
} from "../components";

interface AnalysisScreenProps {
  data: ExtractedData;
  onBack: () => void;
}

export function AnalysisScreen({ data, onBack }: AnalysisScreenProps) {
  const { isDark } = useTheme();
  const { toggleTheme, mode } = useThemeControls();

  return (
    <TView variant="background" style={{ flex: 1 }}>
      <Header title="Analysis" onBack={onBack} />

      <ScrollView style={{ flex: 1 }}>
        <ProfileList data={data} />
        <FavTextList data={data} />
        <FavDmsList data={data} />
        <FavChannelsList data={data} />

        <TableRowGroup title="Settings">
          <TableRow onPress={toggleTheme}>
            <TText>Theme</TText>
            <TText>{mode}</TText>
          </TableRow>
        </TableRowGroup>
      </ScrollView>

      <StatusBar style={isDark ? "light" : "dark"} />
    </TView>
  );
}
