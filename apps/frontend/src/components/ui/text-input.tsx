import React, { useState } from "react";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  View,
} from "react-native";

export type CustomTextInputProps = TextInputProps & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
};

const TextInput = ({
  style,
  leftIcon,
  rightIcon,
  error,
  onFocus,
  onBlur,
  placeholderTextColor,
  ...props
}: CustomTextInputProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.inputBackground,
          borderColor: error
            ? theme.danger
            : isFocused
            ? theme.primary
            : theme.borderColor,
          borderWidth: isFocused || error ? 1.5 : 1,
        },
        style as any,
      ]}
    >
      {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
      <RNTextInput
        style={[
          styles.input,
          {
            color: theme.text,
          },
        ]}
        placeholderTextColor={placeholderTextColor || theme.textSecondary}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    height: 52,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    paddingVertical: 0,
  },
  iconLeft: {
    marginRight: Spacing.two,
  },
  iconRight: {
    marginLeft: Spacing.two,
  },
});

export default TextInput;
