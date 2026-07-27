import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#000000",
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
    transparent: "transparent",
    primary: "#FED43F",
    primaryPressed: "#E5BE34",
    primaryText: "#1A1A1A",
    secondary: "#2BB8B3",
    secondaryPressed: "#239793",
    cardBackground: "#F8F9FA",
    borderColor: "#E4E4E7",
    danger: "#EF4444",
    dangerPressed: "#DC2626",
    inputBackground: "#F0F0F3",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
    transparent: "transparent",
    primary: "#FED43F",
    primaryPressed: "#E5BE34",
    primaryText: "#1A1A1A",
    secondary: "#2BB8B3",
    secondaryPressed: "#239793",
    cardBackground: "#1A1B1E",
    borderColor: "#2E3135",
    danger: "#EF4444",
    dangerPressed: "#DC2626",
    inputBackground: "#212225",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 27,
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
