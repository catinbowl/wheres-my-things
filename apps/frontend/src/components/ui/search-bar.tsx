import TextInput from "./text-input";
import IconButton from "./icon-button";

import { StyleSheet, TextInputProps } from "react-native";
import { View } from "../view";
import { Search, X } from "lucide-react-native";
import { useState } from "react";

type Props = {
  value?: string;
  onChangeText?: TextInputProps["onChangeText"];
};

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText ? onChangeText : undefined}
        placeholder="Search"
      />
      <IconButton
        style={styles.actionButton}
        onPress={
          value
            ? () => {
                if (value !== "") {
                }
              }
            : undefined
        }
      >
        {value ? (
          value === "" ? (
            <Search size={24} />
          ) : (
            <X size={24} />
          )
        ) : (
          <Search size={24} />
        )}
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  actionButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: "-50%" }],
  },
});
