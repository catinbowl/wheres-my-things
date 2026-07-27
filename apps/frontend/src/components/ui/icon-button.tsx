import { Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ReactNode } from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from "react-native";

type Props = PressableProps & {
  children: ReactNode;
  variant?: "default" | "filled" | "primary";
};

export default function IconButton({
  style,
  children,
  variant = "default",
  ...props
}: Props) {
  const theme = useTheme();

  return (
    <Pressable
      style={(state) => [
        styles.pressable,
        variant === "filled" && {
          backgroundColor: theme.backgroundElement,
        },
        variant === "primary" && {
          backgroundColor: theme.primary,
        },
        state.pressed && {
          backgroundColor:
            variant === "primary"
              ? theme.primaryPressed
              : theme.backgroundSelected,
          opacity: 0.85,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <View style={styles.iconWrapper}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    padding: 8,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
