import { StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TText, TView, useTheme } from "@/src/theme";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onExtra?: () => void;
  extraIcon?: string;
}

export default function Header({
  title,
  onBack,
  onExtra,
  extraIcon,
}: HeaderProps) {
  const { theme } = useTheme();
  return (
    <TView style={styles.header}>
      {onBack && (
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={theme.secondary}
          onPress={onBack}
        />
      )}
      <TText variant="primary" style={styles.headerTitle} weight="bold">
        {title}
      </TText>
      {onExtra && extraIcon ? (
        <MaterialIcons
          name={extraIcon}
          size={24}
          color={theme.secondary}
          onPress={onExtra}
        />
      ) : (
        <TView style={{ width: 24 }} />
      )}
    </TView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingTop: 60,
    minHeight: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
});
