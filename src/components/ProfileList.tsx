import { View, Image, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { TText } from "../theme";
import { TableRow, TableRowGroup } from "./ui";

import { useTheme } from "../theme";

import type { ExtractedData } from "../../modules/dpkg-module";

export function ProfileList({ data }: { data: ExtractedData }) {
  const { theme } = useTheme();

  if (!data.user) return null;

  const avatarUrl = `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatarHash}.png?size=256`;

  return (
    <TableRowGroup title="Profile" description="About your Discord account">
      <TableRow>
        <View style={styles.tableRowContent}>
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: 40, height: 40, borderRadius: 100 }}
            resizeMode="contain"
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
              Welcome back, {data.user?.globalName}!
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              @{data.user?.username}
            </TText>
          </View>
        </View>
      </TableRow>
      <TableRow>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="message" size={24} color={theme.primary} />

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
              Messages Sent
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              The amount of messages sent by you
            </TText>
          </View>

          <TText
            variant="secondary"
            weight="medium"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            {data.messageCount.toLocaleString()} messages
          </TText>
        </View>
      </TableRow>
      <TableRow>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="text-fields" size={24} color={theme.primary} />

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
              Characters
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              Total message character count
            </TText>
          </View>

          <TText
            variant="secondary"
            weight="medium"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            {data.characterCount.toLocaleString()} characters
          </TText>
        </View>
      </TableRow>
      <TableRow>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="home" size={24} color={theme.primary} />

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
              Servers
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              The amount of servers you are a member of
            </TText>
          </View>

          <TText
            variant="secondary"
            weight="medium"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            {data.guildCount.toLocaleString()} servers
          </TText>
        </View>
      </TableRow>
      <TableRow>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="list" size={24} color={theme.primary} />

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
              Channels
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              The amount of channels you have interacted with
            </TText>
          </View>

          <TText
            variant="secondary"
            weight="medium"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            {data.channelCount.toLocaleString()} channels
          </TText>
        </View>
      </TableRow>
      <TableRow>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="message" size={24} color={theme.primary} />

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
              Messages Sent
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              The amount of messages sent by you
            </TText>
          </View>

          <TText
            variant="secondary"
            weight="medium"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            {data.messageCount.toLocaleString()} messages
          </TText>
        </View>
      </TableRow>
      <TableRow>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="messenger" size={24} color={theme.primary} />

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
              DM Channels
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              The amount of direct messages you have sent
            </TText>
          </View>

          <TText
            variant="secondary"
            weight="medium"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            {data.dmChannelCount.toLocaleString()} DMs
          </TText>
        </View>
      </TableRow>
      <TableRow>
        <View style={styles.tableRowContent}>
          <MaterialIcons name="payments" size={24} color={theme.primary} />

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
              Purchases
            </TText>
            <TText variant="secondary" style={{ fontSize: 12, lineHeight: 16 }}>
              How much you have spent on Discord
            </TText>
          </View>

          <TText
            variant="secondary"
            weight="medium"
            style={{ fontSize: 14, lineHeight: 20 }}
          >
            {`$${(
              (data.user?.payments
                ?.map((payment) => (payment.status === 1 ? payment.amount : 0))
                .reduce((acc, cur) => acc + cur, 0) ?? 0) / 100
            ).toFixed(2)}`}
          </TText>
        </View>
      </TableRow>
    </TableRowGroup>
  );
}

const styles = StyleSheet.create({
  tableRowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
