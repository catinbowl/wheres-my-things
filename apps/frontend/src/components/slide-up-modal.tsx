import IconButton from "./ui/icon-button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { Modal, Pressable, StyleSheet } from "react-native";
import { View } from "./view";
import { Radius, Spacing } from "@/constants/theme";
import { Text } from "./text";
import { ReactNode, useEffect, useRef, useState } from "react";
import { X } from "lucide-react-native";
import { useTheme } from "@/hooks/use-theme";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(1); // 1 = 100%, 0 = 0%
  const [active, setActive] = useState(isOpen);
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasAnimatedIn.current = false;
      opacity.value = 0;
      translateY.value = 1;
      setActive(true);
    } else if (active) {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(1, { duration: 300 }, (finished) => {
        if (finished) {
          scheduleOnRN(setActive, false);
        }
      });
    }
  }, [isOpen]);

  const handleLayout = () => {
    if (isOpen && !hasAnimatedIn.current) {
      hasAnimatedIn.current = true;
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
    }
  };

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedInnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: `${translateY.value * 100}%` as any }],
    };
  });

  return (
    <Modal visible={active} transparent>
      <View style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFill, animatedBackdropStyle]}>
          <Pressable onPress={onClose} style={styles.backdrop} />
        </Animated.View>

        <Animated.View
          onLayout={handleLayout}
          style={[
            styles.innerContainer,
            {
              backgroundColor: theme.background,
            },
            animatedInnerStyle,
          ]}
        >
          <SafeAreaView edges={["top"]} style={styles.safeArea}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: Spacing.three,
                backgroundColor: "transparent",
              }}
            >
              <Text type="h3">{title}</Text>

              <IconButton onPress={onClose}>
                <X size={24} />
              </IconButton>
            </View>

            {children}
          </SafeAreaView>
        </Animated.View>
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  innerContainer: {
    borderTopStartRadius: Radius.lg,
    borderTopEndRadius: Radius.lg,
    maxHeight: "90%",
    paddingBlockEnd: Spacing.three,
    transform: [{ translateY: "100%" }],
  },
  safeArea: {
    paddingHorizontal: Spacing.three,
  },
});
