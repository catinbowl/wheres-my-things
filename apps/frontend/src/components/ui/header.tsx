import React, { ReactNode } from "react";
import IconButton from "./icon-button";
import { View } from "../view";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Text } from "../text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";

type Props = {
  title?: string;
  showBack?: boolean;
  actionButtons?: ReactNode;
};

export default function Header({ title, showBack = true, actionButtons }: Props) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {showBack && (
        <IconButton onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color={theme.text} />
        </IconButton>
      )}

      {title ? (
        <Text type="h4" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}

      {actionButtons && <View style={styles.actionButtons}>{actionButtons}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    gap: Spacing.two,
  },
  backButton: {
    marginRight: Spacing.one,
  },
  title: {
    flex: 1,
    fontWeight: "700",
  },
  titleSpacer: {
    flex: 1,
  },
  actionButtons: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
