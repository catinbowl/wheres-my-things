import React from "react";
import Button from "@/components/ui/button";
import { Text } from "@/components/text";
import { View } from "@/components/view";
import { Radius, Spacing } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/services/store/hooks";
import { selectAuth, logoutUser } from "@/services/store/slices/auth-slice";
import { selectSettings } from "@/services/store/slices/settings-slices";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/use-theme";
import { Crown, LogIn, LogOut, ShieldAlert, User } from "lucide-react-native";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const theme = useTheme();
  const settings = useAppSelector(selectSettings);
  const auth = useAppSelector(selectAuth);

  const isOfflineMode = settings.data.isOfflineMode;
  const user = auth.data.user;

  const handleSignIn = () => {
    router.navigate("/signin");
  };

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    router.replace("/signin");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>


        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Profile Card */}
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.avatarCircle,
                { backgroundColor: theme.primary },
              ]}
            >
              <User size={36} color={theme.primaryText} />
            </View>

            <Text type="h4" style={styles.userNameText}>
              {isOfflineMode
                ? "Offline Mode"
                : user?.username || "Guest User"}
            </Text>

            <Text style={[styles.userSubtext, { color: theme.textSecondary }]}>
              {isOfflineMode
                ? "Data saved locally on this device"
                : user?.email || "Signed in account"}
            </Text>
          </View>

          {/* Pricing Upgrade Card */}
          <View
            style={[
              styles.cardSection,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <View style={styles.cardHeaderRow}>
              <Crown size={24} color={theme.primary} />
              <View style={styles.cardTextCol}>
                <Text type="h5" style={styles.cardSectionTitle}>
                  Subscription & Plans
                </Text>
                <Text style={[styles.cardSectionSubtext, { color: theme.textSecondary }]}>
                  {user?.isSubscribed
                    ? "You are on Pro Plan"
                    : "Upgrade for unlimited items & AI search"}
                </Text>
              </View>
            </View>

            <Button
              title="View Subscription Plans"
              variant="primary"
              size="md"
              leftIcon={<Crown size={18} color={theme.primaryText} />}
              onPress={() => router.push("/pricing")}
              style={styles.actionBtn}
            />
          </View>

          {/* Account Actions */}
          <View
            style={[
              styles.cardSection,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor,
              },
            ]}
          >
            {isOfflineMode ? (
              <>
                <View style={styles.cardHeaderRow}>
                  <ShieldAlert size={24} color={theme.secondary} />
                  <View style={styles.cardTextCol}>
                    <Text type="h5" style={styles.cardSectionTitle}>
                      Account Sync
                    </Text>
                    <Text style={[styles.cardSectionSubtext, { color: theme.textSecondary }]}>
                      Sign in to enable cloud sync and item sharing.
                    </Text>
                  </View>
                </View>

                <Button
                  title="Sign In to Sync"
                  variant="secondary"
                  size="md"
                  leftIcon={<LogIn size={18} color={theme.text} />}
                  onPress={handleSignIn}
                  style={styles.actionBtn}
                />
              </>
            ) : (
              <Button
                title="Sign Out"
                variant="danger"
                size="md"
                leftIcon={<LogOut size={18} color="#FFFFFF" />}
                onPress={handleSignOut}
                style={styles.actionBtn}
              />
            )}
          </View>
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
    gap: Spacing.three,
    paddingBottom: 100,
  },
  profileCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    alignItems: "center",
    borderWidth: 1,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  userNameText: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.half,
  },
  userSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  cardSection: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    borderWidth: 1,
    gap: Spacing.three,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  cardTextCol: {
    flex: 1,
  },
  cardSectionTitle: {
    fontWeight: "700",
    marginBottom: 2,
  },
  cardSectionSubtext: {
    fontSize: 14,
  },
  actionBtn: {
    marginTop: Spacing.one,
  },
});
