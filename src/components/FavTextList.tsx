import { TText } from "../theme";
import { StyleSheet, View, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TableRow, TableRowGroup } from "./ui";

import { useTheme } from "../theme";

import type { ExtractedData } from "../../modules/dpkg-module";

function isEmote(word: string): boolean {
  return (
    (word.startsWith("<:") || word.startsWith("<a:")) && word.endsWith(">")
  );
}

function extractEmote(
  emojiString: string,
): { name: string; id: string; animated: boolean; url: string } | null {
  // emote format: <:name:id> or <a:name:id>
  const match = emojiString.match(/<(a?):([^:]+):(\d+)>/);
  if (!match) return null;

  const [, animatedFlag, name, id] = match;
  const animated = animatedFlag === "a";
  const extension = animated ? "gif" : "webp";
  const url = `https://cdn.discordapp.com/emojis/${id}.${extension}`;

  return { name: `:${name}:`, id, animated, url };
}

export function FavTextList({ data }: { data: ExtractedData }) {
  const { theme } = useTheme();

  if (data.favoriteWords.length === 0) return null;

  return (
    <TableRowGroup
      title="Most used phrases"
      description="Text and emotes that you have used the most across all of your messages on Discord."
    >
      {data.favoriteWords.map((word) => {
        const emojiData = isEmote(word.word) ? extractEmote(word.word) : null;
        const displayText = emojiData ? emojiData.name : word.word;

        return (
          <TableRow key={word.word}>
            <View style={styles.tableRowContent}>
              {emojiData ? (
                <Image
                  source={{ uri: emojiData.url }}
                  style={styles.emojiImage}
                  resizeMode="contain"
                />
              ) : (
                <MaterialIcons
                  name="text-fields"
                  size={24}
                  color={theme.primary}
                />
              )}

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  {displayText}
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  {emojiData ? "Emote" : "Text"}
                </TText>
              </View>

              <TText
                variant="secondary"
                style={{ fontSize: 14, lineHeight: 16 }}
              >
                {word.count.toLocaleString()} times
              </TText>
            </View>
          </TableRow>
        );
      })}
    </TableRowGroup>
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
  emojiImage: {
    width: 24,
    height: 24,
  },
});
