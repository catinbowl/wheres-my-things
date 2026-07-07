import { Image } from "expo-image";
import { SymbolView } from "expo-symbols";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ExternalLink } from "@/components/external-link";
import { Text } from "@/components/text";
import { View } from "@/components/view";
import { Collapsible } from "@/components/ui/collapsible";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppSelector } from "@/services/store/hooks";
import { selectThings } from "@/services/store/slices/things-slice";
import { SafeAreaView } from "react-native-safe-area-context";
import ThingListItem from "@/components/thing-list-item";
import { selectAppState } from "@/services/store/slices/app-slice";
import { useEffect } from "react";
import { selectSettings } from "@/services/store/slices/settings-slices";
import Button from "@/components/ui/button";
import { useRouter } from "expo-router";

export default function SharedScreen() {
  const router = useRouter()
  const { data: things, isLoading: isThingsLoading } = useAppSelector(selectThings);
  const { data: appState, isLoading: isAppStateLoading } = useAppSelector(selectAppState)
  const { data: settings, isLoading: isSettingsLoading } = useAppSelector(selectSettings)

  if (isSettingsLoading) return

  if (settings.isOfflineMode) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ textAlign: "center" }}>Signin to access this feature</Text>
          <Button
            title="Sign In"
            onPress={() => { router.navigate("/signin"); }}
            style={{ marginTop: Spacing.three }}
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={{ gap: Spacing.two }}>
          {things.map((thing) => (
            <ThingListItem {...thing} key={thing.uid} />
          ))}
        </View>

        {isThingsLoading && (
          <ActivityIndicator style={styles.ActivityIndicator} size="large" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    paddingTop: Spacing.three
  },
  scrollView: {
    flex: 1,
  },
  ActivityIndicator: {
    position: "absolute",
    top: 100,
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
});
