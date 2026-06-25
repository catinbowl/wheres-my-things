import Button from "@/components/ui/button";

import { Text as Text } from "@/components/text";
import { useAppDispatch } from "@/services/store/hooks";
import { initApp } from "@/services/store/slices/app-slice";
import { initSettings } from "@/services/store/slices/settings-slices";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleFinishOnboarding = async (isOfflineMode: boolean) => {
    await dispatch(initApp()).unwrap();
    await dispatch(initSettings(isOfflineMode)).unwrap();

    router.replace("/");
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
        <Button title="Sign in" onPress={() => router.navigate("/signin")} />
        <Button title="Sign up" onPress={() => router.navigate("/signup")} />
        <Button
          title="Offline Mode"
          onPress={() => handleFinishOnboarding(true)}
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
