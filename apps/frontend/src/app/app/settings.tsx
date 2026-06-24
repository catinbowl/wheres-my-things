import { Text } from "@/components/text";
import { Spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView edges={["top"]} style={{ paddingHorizontal: Spacing.three }}>
      <Text type="h1">Settings</Text>
    </SafeAreaView>
  );
}
