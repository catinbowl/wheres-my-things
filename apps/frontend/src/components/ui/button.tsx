import { Pressable, PressableProps, StyleSheet } from "react-native";
import { Text as Text } from "../text";

type Props = PressableProps & {
  title: string;
};

const Button = ({ title, style, ...props }: Props) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { ...style },
        pressed && styles.containerPressed,
      ]}
      {...props}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(254, 213, 63, 1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderColor: "rgba(254, 213, 63, 1)",
    borderWidth: 2,
  },
  containerPressed: {
    backgroundColor: "rgba(254, 213, 63, 0.7)",
  },
  title: {
    textAlign: "center",
  },
});

export default Button;
