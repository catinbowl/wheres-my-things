import {
  Platform,
  StyleSheet,
  Text as RNText,
  type TextProps,
} from "react-native";
import { Fonts, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "title"
    | "subtitle"
    | "small"
    | "smallBold"
    | "link"
    | "linkPrimary"
    | "code";
  themeColor?: ThemeColor;
};

export function Text({
  style,
  type = "default",
  themeColor,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <RNText
      style={[
        { color: theme[themeColor ?? "text"] },
        type === "default" && styles.default,
        type === "h1" && styles.h1,
        type === "h2" && styles.h2,
        type === "h3" && styles.h3,
        type === "h4" && styles.h4,
        type === "h5" && styles.h5,
        type === "h6" && styles.h6,
        type === "title" && styles.h1,
        type === "subtitle" && styles.h2,
        type === "small" && styles.small,
        type === "smallBold" && styles.smallBold,
        type === "link" && styles.link,
        type === "linkPrimary" && styles.linkPrimary,
        type === "code" && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  h1: {
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
  },
  h2: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 600,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 600,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 600,
  },
  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 600,
  },
  h6: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: "#3c87f7",
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
