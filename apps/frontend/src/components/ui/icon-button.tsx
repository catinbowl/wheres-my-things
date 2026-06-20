import { Radius } from "@/constants/theme";
import { ReactNode } from "react";
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

type Props = PressableProps & {
  children: ReactNode;
};

export default function IconButton({ style, children, ...props }: Props) {
  return (
    <Pressable
      style={(state) => [
        styles.pressable,
        typeof style === "function" ? style(state) : style,
        state.pressed && styles.pressablePressed,
      ]}
      {...props}
    >
      <View>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 8,
    borderRadius: Radius.lg,
  },
  pressablePressed: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
