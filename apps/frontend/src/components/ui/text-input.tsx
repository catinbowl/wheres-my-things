import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

type Props = TextInputProps;

const TextInput = ({ ...props }: Props) => {
  return (
    <RNTextInput
      style={styles.container}
      placeholderTextColor="rgba(0, 0, 0, 0.7)"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(254, 213, 63, 1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 50,
  },
});

export default TextInput;
