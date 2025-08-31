import { Image, StyleSheet, View } from "react-native";
import type { ExtractedData } from "@/modules/dpkg-module";
import { TText } from "../../theme";
import { TableRow, TableRowGroup } from "../ui";

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

export function FavEmoteList({ data }: { data: ExtractedData }) {
  const { favoriteEmotes } = data;

  if (!favoriteEmotes || favoriteEmotes.length === 0) return null;

  return (
    <TableRowGroup
      title="Most used emotes"
      description="Custom emotes that you have used the most across all of your messages on Discord."
    >
      {favoriteEmotes.map((emote) => {
        const emojiData = extractEmote(emote.word);
        if (!emojiData) return null;

        return (
          <TableRow key={emote.word}>
            <View style={styles.tableRowContent}>
              <Image
                source={{ uri: emojiData.url }}
                style={styles.emojiImage}
                resizeMode="contain"
              />

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  {emojiData.name}
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  {emojiData.animated ? "Animated Emote" : "Emote"}
                </TText>
              </View>

              <TText
                variant="secondary"
                style={{ fontSize: 14, lineHeight: 16 }}
              >
                {emote.count.toLocaleString()} times
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
