import { View as RNView, type ViewProps } from "react-native";
import { Radius, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function View({
  style,
  lightColor,
  darkColor,
  type,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  return (
    <RNView
      style={[
        {
          backgroundColor: theme[type ?? "background"],
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
