import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

import { TableRow, TableRowGroup } from "@/src/components/ui";
import { handleLinkPress } from "@/src/lib/utils";
import { TText, useTheme } from "@/src/theme";

const developers = [
  {
    githubName: "theoriginalayaka",
    displayName: "TheOriginalAyaka",
    role: "Developer",
  },
  {
    githubName: "thereallo1026",
    displayName: "Thereallo",
    role: "Designer",
  },
  {
    githubName: "arikatsu",
    displayName: "Arikatsu",
    role: "Developer",
  },
];

export function CreditsSection() {
  const { theme } = useTheme();

  return (
    <TableRowGroup
      title="Credits"
      description="Creators and contributors who made this app possible"
    >
      {developers.map((dev) => (
        <TableRow
          key={dev.githubName}
          onPress={() =>
            handleLinkPress(`https://github.com/${dev.githubName}`)
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: `https://wsrv.nl/?url=https://github.com/${dev.githubName}.png&w=80&h=80&output=webp`,
              }}
              style={styles.avatar}
              resizeMode="cover"
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
                {dev.displayName}
              </TText>
              <TText
                variant="secondary"
                style={{ fontSize: 12, lineHeight: 16 }}
              >
                {dev.role}
              </TText>
            </View>

            <MaterialIcons
              name="open-in-new"
              size={20}
              color={theme.secondary}
            />
          </View>
        </TableRow>
      ))}
    </TableRowGroup>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
    marginLeft: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 9999,
  },
});
