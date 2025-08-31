import { StyleSheet, View } from "react-native";
import type { ExtractedData } from "@/modules/dpkg-module";
import { TText } from "../../theme";
import { TableRow, TableRowGroup } from "../ui";

export function FavTextList({ data }: { data: ExtractedData }) {
  if (!data.favoriteWords || data.favoriteWords.length === 0) return null;

  return (
    <TableRowGroup
      title="Most used phrases"
      description="Text and emotes that you have used the most across all of your messages on Discord."
    >
      {data.favoriteWords.map((word) => {
        return (
          <TableRow key={word.word}>
            <View style={styles.tableRowContent}>
              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  {word.word}
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
  },
});
