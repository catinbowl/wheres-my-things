import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/text";
import { View } from "@/components/view";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppSelector } from "@/services/store/hooks";
import { selectThings } from "@/services/store/slices/things-slice";
import ThingListItem from "@/components/thing-list-item";
import { selectSettings } from "@/services/store/slices/settings-slices";
import Button from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Lock, Share2 } from "lucide-react-native";

export default function SharedScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data: things, isLoading: isThingsLoading } = useAppSelector(selectThings);
  const { data: settings, isLoading: isSettingsLoading } = useAppSelector(selectSettings);

  if (isSettingsLoading) return null;

  if (settings.isOfflineMode) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.safeArea}>


          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.backgroundElement },
              ]}
            >
              <Lock size={36} color={theme.textSecondary} />
            </View>

            <Text type="h5" style={styles.emptyTitle}>
              Sign In to View Shared Items
            </Text>

            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Offline mode only displays your local items. Sign in to collaborate and view items shared by others.
            </Text>

            <Button
              title="Sign In"
              variant="primary"
              size="md"
              onPress={() => router.navigate("/signin")}
              style={styles.signInBtn}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>


        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {things.length > 0 ? (
            <View style={styles.listGap}>
              {things.map((thing) => (
                <ThingListItem {...thing} key={thing.uid} />
              ))}
            </View>
          ) : !isThingsLoading ? (
            <View style={styles.emptyContainer}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <Share2 size={36} color={theme.textSecondary} />
              </View>

              <Text type="h5" style={styles.emptyTitle}>
                No Shared Items Yet
              </Text>

              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Belongings shared with you by family or friends will show up here.
              </Text>
            </View>
          ) : null}

          {isThingsLoading && (
            <ActivityIndicator style={styles.activityIndicator} size="large" color={theme.primary} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  headerTitle: {
    fontWeight: "700",
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  listGap: {
    gap: Spacing.one,
  },
  activityIndicator: {
    marginTop: Spacing.four,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  emptyTitle: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.one,
  },
  emptySubtitle: {
    textAlign: "center",
    fontSize: 15,
    maxWidth: 280,
    marginBottom: Spacing.four,
  },
  signInBtn: {
    marginTop: Spacing.two,
    paddingHorizontal: Spacing.five,
  },
});
