import React from "react";
import Button from "@/components/ui/button";
import { Text } from "@/components/text";
import { useAppDispatch } from "@/services/store/hooks";
import { initApp } from "@/services/store/slices/app-slice";
import { initSettings } from "@/services/store/slices/settings-slices";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Compass } from "lucide-react-native";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleFinishOnboarding = async (isOfflineMode: boolean) => {
    await dispatch(initApp()).unwrap();
    await dispatch(initSettings(isOfflineMode)).unwrap();
    router.replace("/");
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Box size={44} color="#1A1A1A" />
          </LinearGradient>

          <Text type="h2" style={styles.title}>
            Where's My Things
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Track your belongings with ease. Never lose anything again.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Sign In"
            variant="primary"
            size="lg"
            onPress={() => router.navigate("/signin")}
          />
          <Button
            title="Create Account"
            variant="secondary"
            size="lg"
            onPress={() => router.navigate("/signup")}
          />
          <Button
            title="Continue Offline"
            variant="outline"
            size="lg"
            onPress={() => handleFinishOnboarding(true)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    justifyContent: "space-between",
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.two,
  },
  logoGradient: {
    width: 96,
    height: 96,
    borderRadius: Radius.xl * 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.two,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 280,
  },
  buttonsContainer: {
    gap: Spacing.three,
    width: "100%",
    marginBottom: Spacing.three,
  },
});
