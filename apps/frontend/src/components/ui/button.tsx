import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "../text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type Props = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const Button = ({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: Props) => {
  const theme = useTheme();

  const getVariantStyles = (pressed: boolean) => {
    switch (variant) {
      case "secondary":
        return {
          container: {
            backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement,
            borderColor: "transparent",
            borderWidth: 1.5,
          },
          text: {
            color: theme.text,
            fontWeight: "600" as const,
          },
        };
      case "outline":
        return {
          container: {
            backgroundColor: pressed ? theme.backgroundElement : "transparent",
            borderColor: theme.borderColor,
            borderWidth: 1.5,
          },
          text: {
            color: theme.text,
            fontWeight: "600" as const,
          },
        };
      case "ghost":
        return {
          container: {
            backgroundColor: pressed ? theme.backgroundElement : "transparent",
            borderColor: "transparent",
            borderWidth: 1.5,
          },
          text: {
            color: theme.text,
            fontWeight: "600" as const,
          },
        };
      case "danger":
        return {
          container: {
            backgroundColor: pressed ? theme.dangerPressed : theme.danger,
            borderColor: "transparent",
            borderWidth: 1.5,
          },
          text: {
            color: "#FFFFFF",
            fontWeight: "700" as const,
          },
        };
      case "primary":
      default:
        return {
          container: {
            backgroundColor: pressed ? theme.primaryPressed : theme.primary,
            borderColor: "transparent",
            borderWidth: 1.5,
          },
          text: {
            color: theme.primaryText,
            fontWeight: "700" as const,
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: Radius.md,
          fontSize: 14,
        };
      case "lg":
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: Radius.xl,
          fontSize: 17,
        };
      case "md":
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: Radius.lg,
          fontSize: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      disabled={disabled || loading}
      style={(state) => {
        const variantStyle = getVariantStyles(state.pressed);
        const resolvedStyle =
          typeof style === "function" ? style(state) : style;

        return [
          styles.container,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            borderRadius: sizeStyles.borderRadius,
          },
          variantStyle.container,
          disabled && styles.disabledContainer,
          resolvedStyle,
        ];
      }}
      {...props}
    >
      {({ pressed }) => {
        const variantStyle = getVariantStyles(pressed);
        return (
          <View style={styles.contentRow}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={variantStyle.text.color}
                style={styles.spinner}
              />
            ) : (
              <>
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                <Text
                  style={[
                    styles.title,
                    {
                      fontSize: sizeStyles.fontSize,
                      color: variantStyle.text.color,
                      fontWeight: variantStyle.text.fontWeight,
                    },
                  ]}
                >
                  {title}
                </Text>
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
              </>
            )}
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  disabledContainer: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  spinner: {
    marginVertical: 2,
  },
  iconLeft: {
    marginRight: Spacing.two,
  },
  iconRight: {
    marginLeft: Spacing.two,
  },
});

export default Button;
