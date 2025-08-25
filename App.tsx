import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import dpkgModule, { type ExtractedData } from "./modules/dpkg-module";

export default function App() {
  const [data, setData] = useState<ExtractedData>();
  const [progress, setProgress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const complete = dpkgModule.addListener("onComplete", (e) => {
      console.log("complete event:", JSON.stringify(e.result, null, 2));
      setData(e.result);
      setIsLoading(false);
      setProgress("");
    });

    const error = dpkgModule.addListener("onError", (e) => {
      console.log("error event:", e.message);
      setIsLoading(false);
      setProgress(`Error: ${e.message}`);
    });

    const progressListener = dpkgModule.addListener("onProgress", (e) => {
      console.log("progress event:", e.step);
      setProgress(e.step);
    });

    return () => {
      complete.remove();
      error.remove();
      progressListener.remove();
    };
  }, []);

  const onClick = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: "application/zip",
    });
    if (!file.canceled && file.assets[0]) {
      console.log("uri", file.assets[0].uri);
      setIsLoading(true);
      setData(undefined);
      dpkgModule.process(file.assets[0].uri.replace("file://", ""));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.progressText}>{progress}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Discord Data Analyzer</Text>
        <Text style={styles.subtitle}>
          Select your Discord data package to get started
        </Text>
        <Button title="Pick Data Package" onPress={onClick} />
        {progress && <Text style={styles.progressText}>{progress}</Text>}
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discord Data Analysis</Text>
        <Button title="Analyze New Package" onPress={onClick} />
      </View>

      {data.user && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Profile</Text>
          <Text style={styles.userInfo}>
            {`${data.user.globalName} (@${data.user.username}#${data.user.discriminator})`}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Messages Sent"
            value={data.messageCount.toLocaleString()}
          />
          <StatCard
            title="Characters"
            value={data.characterCount.toLocaleString()}
          />
          <StatCard title="Guilds" value={data.guildCount.toLocaleString()} />
          <StatCard
            title="DM Channels"
            value={data.dmChannelCount.toLocaleString()}
          />
          <StatCard
            title="Total Channels"
            value={data.channelCount.toLocaleString()}
          />
          <StatCard
            title="Total Spent"
            value={`$${(
              (data.user?.payments
                ?.map((payment) => (payment.status === 1 ? payment.amount : 0))
                .reduce((acc, cur) => acc + cur, 0) ?? 0) / 100
            ).toFixed(2)}`}
          />
        </View>
      </View>

      {data.topDms.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top DMs</Text>
          {data.topDms.slice(0, 5).map((dm) => {
            const user = data.user?.relationships.find(
              (r) => r.user.id === dm.dmUserId,
            )?.user;
            return (
              <AvatarListItem
                key={dm.id}
                title={user?.globalName ?? "DM"}
                subtitle={`${dm.messageCount} messages`}
                avatarUrl={
                  user?.avatar
                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
                    : undefined
                }
                userId={user?.id}
              />
            );
          })}
        </View>
      )}

      {data.topChannels.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Channels</Text>
          {data.topChannels.slice(0, 5).map((channel, index) => (
            <ListItem
              key={`${channel.name}-${index}`}
              title={channel.name}
              subtitle={`${channel.messageCount} messages${
                channel.guildName ? ` in ${channel.guildName}` : ""
              }`}
            />
          ))}
        </View>
      )}

      {data.favoriteWords.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Used Words</Text>
          {data.favoriteWords.slice(0, 10).map((word) => (
            <EmojiListItem
              key={word.word}
              title={word.word}
              subtitle={`Used ${word.count} times`}
            />
          ))}
        </View>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}
function ListItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listTitle}>{title}</Text>
      <Text style={styles.listSubtitle}>{subtitle}</Text>
    </View>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function AvatarListItem({
  title,
  subtitle,
  avatarUrl,
  userId,
}: {
  title: string;
  subtitle: string;
  avatarUrl?: string;
  userId?: string;
}) {
  const [imageError, setImageError] = useState(false);

  const getDefaultAvatarUrl = (userId: string) => {
    const discriminator = (BigInt(userId) >> BigInt(22)) % BigInt(6);
    return `https://cdn.discordapp.com/embed/avatars/${discriminator}.png`;
  };

  const defaultAvatarUrl = userId ? getDefaultAvatarUrl(userId) : undefined;

  return (
    <View style={styles.avatarListItem}>
      <View style={styles.avatarContainer}>
        {avatarUrl && !imageError ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            onError={() => setImageError(true)}
          />
        ) : defaultAvatarUrl ? (
          <Image source={{ uri: defaultAvatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {title.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.avatarListContent}>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function EmojiListItem({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const emojiData = parseDiscordEmoji(title);

  return (
    <View style={styles.listItem}>
      <View style={styles.emojiTitleContainer}>
        {emojiData.isEmoji ? (
          <>
            {emojiData.url ? (
              <Image
                source={{ uri: emojiData.url }}
                style={styles.emojiImage}
              />
            ) : (
              <Text style={styles.unicodeEmoji}>{emojiData.unicode}</Text>
            )}
            <Text style={styles.emojiName}>:{emojiData.name}:</Text>
          </>
        ) : (
          <Text style={styles.listTitle}>{title}</Text>
        )}
      </View>
      <Text style={styles.listSubtitle}>{subtitle}</Text>
    </View>
  );
}

function parseDiscordEmoji(text: string) {
  // Check if it's a custom Discord emoji: <:name:id> or <a:name:id>
  const customEmojiMatch = text.match(/^<(a?):([^:]+):(\d+)>$/);
  if (customEmojiMatch) {
    const [, animated, name, id] = customEmojiMatch;
    const extension = animated ? "gif" : "png";
    return {
      isEmoji: true,
      url: `https://cdn.discordapp.com/emojis/${id}.${extension}?size=32`,
      name: name,
    };
  }

  // Check if it's a Unicode emoji (contains emoji characters)
  const emojiRegex =
    /^[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]+$/u;
  if (emojiRegex.test(text)) {
    return {
      isEmoji: true,
      unicode: text,
      name: text,
    };
  }

  return { isEmoji: false, text };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  userInfo: {
    fontSize: 16,
    color: "#666",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 6,
    width: "48%",
    marginBottom: 8,
    alignItems: "center",
  },
  statTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  listSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  avatarListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#5865F2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarListContent: {
    flex: 1,
  },
  emojiTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  unicodeEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  emojiName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});
