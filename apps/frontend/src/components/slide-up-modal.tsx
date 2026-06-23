import { Modal, Pressable, StyleSheet } from "react-native";
import { View } from "./view";
import { Radius, Spacing } from "@/constants/theme";
import { Text } from "./text";
import { ReactNode } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import IconButton from "./ui/icon-button";
import { X } from "lucide-react-native";
import { useTheme } from "@/hooks/use-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  isOpen: boolean;
  title?: string;
  children?: ReactNode;
  onClose: () => void;
};

export default function SlideUpModal({
  isOpen,
  title,
  children,
  onClose,
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.container}>
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />

        {isOpen && (
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={[
              styles.innerContainer,
              {
                backgroundColor: theme.background,
                paddingBlockEnd: Math.max(insets.bottom, Spacing.three),
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: Spacing.two,
                marginBottom: Spacing.three,
                backgroundColor: "transparent",
              }}
            >
              <Text type="h3">{title}</Text>

              <IconButton onPress={onClose}>
                <X size={24} />
              </IconButton>
            </View>

            {children}
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  innerContainer: {
    paddingHorizontal: Spacing.three,
    borderTopStartRadius: Radius.lg,
    borderTopEndRadius: Radius.lg,
  },
});
