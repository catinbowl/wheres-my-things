import { ThemedText as Text } from "@/components/themed-text";
import Button from "@/components/ui/button";
import { useAppDispatch } from "@/services/store/hooks";
import { initialize } from "@/services/store/slices/settings-slices";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleFinishOnboarding = (isOfflineMode: boolean) => {
    dispatch(initialize(isOfflineMode));
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {/* <LinearGradient
        colors={["#2BB8B3", "#FED43F"]}
        style={styles.background}
      /> */}

      <Text type="subtitle" style={styles.title}>
        Where's My Things
      </Text>

      <Text style={styles.subtitle}>
        Track your belongings with ease. Never lose anything again.
      </Text>

      <View style={styles.buttonsContainer}>
        {/* <Button title="Sign In" onPress={() => console.log("To Sign in")} />
          <Button title="Sign Up" onPress={() => console.log("To Sign up")} />
          <Button
            title="Offline Mode"
            onPress={() => console.log("To Offline Mode")}
          /> */}
        <Button title="Sign in" onPress={() => router.navigate("/signin")} />
        <Button title="Sign up" onPress={() => router.navigate("/signup")} />
        <Button
          title="Offline Mode"
          onPress={() => handleFinishOnboarding(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 128,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 16,
  },
  buttonsContainer: {
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
});
