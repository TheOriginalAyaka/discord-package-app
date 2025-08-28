import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import type { ExtractedData } from "@/modules/dpkg-module";
import { type Theme, TText, useTheme } from "../../theme";
import { TableRow, TableRowGroup } from "../ui";

export function FavDmsList({ data }: { data: ExtractedData }) {
  const { theme } = useTheme();

  if (data.topDms.length === 0) return null;

  return (
    <TableRowGroup
      title="Top DMs"
      description="The people you've exchanged the most direct messages with on Discord."
    >
      {data.topDms.slice(0, 5).map((dm) => {
        const user = data.user?.relationships.find(
          (r) => r.user.id === dm.dmUserId,
        )?.user;

        const customAvatarUrl = user?.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`
          : undefined;

        const defaultAvatarUrl = user
          ? getDefaultAvatarUrl(user.id, user.discriminator)
          : undefined;

        return (
          <TableRow key={dm.id}>
            <View style={styles.tableRowContent}>
              <Avatar
                customUrl={customAvatarUrl}
                fallbackUrl={defaultAvatarUrl}
                theme={theme}
              />

              <View style={styles.textContainer}>
                <TText
                  variant="primary"
                  weight="semibold"
                  style={{ fontSize: 16, lineHeight: 20 }}
                >
                  {user?.globalName ?? "Unknown User"}
                </TText>
                <TText
                  variant="secondary"
                  style={{ fontSize: 12, lineHeight: 16 }}
                >
                  @{user?.username ?? "unknown"}
                </TText>
              </View>

              <TText
                variant="secondary"
                style={{ fontSize: 14, lineHeight: 16 }}
              >
                {dm.messageCount.toLocaleString()} messages
              </TText>
            </View>
          </TableRow>
        );
      })}
    </TableRowGroup>
  );
}

function Avatar({
  customUrl,
  fallbackUrl,
  theme,
}: {
  customUrl: string | undefined;
  fallbackUrl: string | undefined;
  theme: Theme;
}) {
  const [imageError, setImageError] = useState(false);

  // if custom avatar not error, use
  const avatarUrl = customUrl && !imageError ? customUrl : fallbackUrl;

  if (!avatarUrl) {
    return (
      <MaterialIcons name="account-circle" size={40} color={theme.primary} />
    );
  }

  return (
    <Image
      source={{ uri: avatarUrl }}
      style={{ width: 40, height: 40, borderRadius: 100 }}
      resizeMode="cover"
      onError={() => {
        if (customUrl && !imageError) {
          setImageError(true); // trigger that re-render with fallback
        }
      }}
    />
  );
}

function getDefaultAvatarUrl(userId: string, discriminator?: string) {
  // old username
  if (discriminator && discriminator !== "0") {
    const avatarIndex = parseInt(discriminator, 10) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${avatarIndex}.png`;
  } else {
    // new username
    const avatarIndex = (BigInt(userId) >> 22n) % 6n;
    return `https://cdn.discordapp.com/embed/avatars/${avatarIndex}.png`;
  }
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
});
