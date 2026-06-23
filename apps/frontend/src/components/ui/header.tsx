import IconButton from "./icon-button";

import { View } from "../view";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Text } from "../text";
import { Spacing } from "@/constants/theme";
import { ReactNode } from "react";
import { useRouter } from "expo-router";

type Props = {
  title?: string;
  actionButtons?: ReactNode;
};

export default function Header({ title, actionButtons }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <IconButton onPress={() => router.back()}>
        <ArrowLeft size={24} />
      </IconButton>

      <Text type="h3" style={styles.title}>
        {title}
      </Text>

      <View style={styles.actionButtons}>{actionButtons}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  title: {
    flex: 1,
  },
  actionButtons: {
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: Spacing.two,
  },
});
