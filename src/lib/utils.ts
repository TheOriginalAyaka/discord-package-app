import { Linking } from "react-native";

export const handleLinkPress = (url: string) => {
  Linking.openURL(url);
};
