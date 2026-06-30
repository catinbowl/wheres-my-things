import Button from "@/components/ui/button";

import { Text } from "@/components/text";
import { View } from "@/components/view";
import { Spacing } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/services/store/hooks";
import { selectAuth, logoutUser } from "@/services/store/slices/auth-slice";
import { selectSettings } from "@/services/store/slices/settings-slices";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Text type="h1" style={styles.title}>
        Settings
      </Text>

      <View style={styles.content}>
        {isOfflineMode ? (
          <View style={styles.section}>
            <Text style={styles.message}>
              You are currently in Offline Mode.
            </Text>
            <Button
              title="Sign In"
              onPress={handleSignIn}
              style={styles.button}
            />
          </View>
        ) : (
          <View style={styles.section}>
            {user?.username && (
              <Text type="subtitle" style={styles.username}>
                Logged in as: {user.username}
              </Text>
            )}
            <Button
              title="Sign Out"
              onPress={handleSignOut}
              style={styles.button}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  title: {
    marginBottom: Spacing.four,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    width: "100%",
    gap: Spacing.three,
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: Spacing.two,
  },
  username: {
    textAlign: "center",
    marginBottom: Spacing.two,
  },
  button: {
    width: "80%",
    maxWidth: 300,
  },
});
