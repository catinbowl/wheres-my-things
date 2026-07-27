import React from "react";
import TextInput from "./text-input";
import IconButton from "./icon-button";
import { StyleSheet, TextInputProps } from "react-native";
import { View } from "../view";
import { Search, X } from "lucide-react-native";
import { useTheme } from "@/hooks/use-theme";

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value = "",
  onChangeText,
  placeholder = "Search belongings...",
}: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon={<Search size={20} color={theme.textSecondary} />}
        rightIcon={
          value.length > 0 ? (
            <IconButton
              onPress={() => onChangeText?.("")}
              style={styles.clearButton}
            >
              <X size={18} color={theme.textSecondary} />
            </IconButton>
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  clearButton: {
    padding: 4,
  },
});
