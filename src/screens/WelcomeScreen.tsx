import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Logo } from "@/src/components";
import { Button, ButtonText } from "../components/ui";
import { useDiscordContext } from "../context/DiscordContext";
import type { RootStackParamList } from "../navigation/types";
import { TText, TTitle } from "../theme";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

export function WelcomeScreen() {
  const { useMockData: startMockData } = useDiscordContext();
  const navigation = useNavigation<NavigationProp>();

  const handleDemo = () => {
    startMockData();
    navigation.navigate("Process", { mode: "demo" });
  };

  const handleChoosePackage = () => {
    navigation.navigate("Start");
  };

  return (
    <ImageBackground
      source={require("@/assets/bg.webp")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar style={"light"} />
      <View style={styles.content}>
        <View style={styles.centerSection}>
          <View style={styles.iconBadge}>
            <Logo width={100} height={100} />
          </View>
          <TTitle style={styles.title}>Welcome To Dispackage</TTitle>
          <TText style={styles.subtitle} variant="primary" weight="medium">
            Analyze your Discord data package, get insights, and understand your
            data better.
          </TText>
        </View>
        <View style={styles.footer}>
          <View style={styles.buttonsContainer}>
            <Button variant="secondary" onPress={handleDemo}>
              <ButtonText weight="semibold">Try Demo</ButtonText>
            </Button>
            <Button variant="primary" onPress={handleChoosePackage}>
              <ButtonText weight="semibold">Choose Package</ButtonText>
            </Button>
          </View>
          <TText
            variant="muted"
            style={{ textAlign: "center", color: "white", opacity: 0.8 }}
          >
            Not affiliated with Discord Inc.
          </TText>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centerSection: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    bottom: 128,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBadge: {
    width: 100,
    height: 100,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    textTransform: "uppercase",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
    color: "white",
  },
  buttonsContainer: {
    gap: 12,
    marginHorizontal: 16,
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    gap: 8,
  },
});
