import { Image, Linking, StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TableRow, TableRowGroup } from "@/src/components/ui";
import { TText, useTheme } from "@/src/theme";

const developers = [
  {
    githubUsername: "theoriginalayaka",
    displayName: "TheOriginalAyaka",
    role: "Developer",
  },
  {
    githubUsername: "thereallo1026",
    displayName: "Thereallo",
    role: "Designer",
  },
  {
    githubUsername: "arikatsu",
    displayName: "Arikatsu",
    role: "Developer",
  },
];

export function CreditsSection() {
  const { theme } = useTheme();

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <TableRowGroup
      title="Credits"
      description="People who made this app possible"
    >
      {developers.map((dev) => (
        <TableRow
          key={dev.githubUsername}
          onPress={() =>
            handleLinkPress(`https://github.com/${dev.githubUsername}`)
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
                uri: `https://wsrv.nl/?url=https://github.com/${dev.githubUsername}.png&w=80&h=80&output=webp`,
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

      <TableRow
        onPress={() =>
          handleLinkPress(
            "https://github.com/theoriginalayaka/discord-package-app",
          )
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="github"
            size={24}
            color={theme.primary}
          />

          <View style={styles.textContainer}>
            <TText
              variant="primary"
              weight="semibold"
              style={{ fontSize: 16, lineHeight: 20 }}
            >
              View Source
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              theoriginalayaka/discord-package-app
            </TText>
          </View>

          <MaterialIcons name="open-in-new" size={20} color={theme.secondary} />
        </View>
      </TableRow>
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
