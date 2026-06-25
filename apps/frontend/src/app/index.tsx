import { useAppDispatch, useAppSelector } from "@/services/store/hooks";
import {
  fetchAppState,
  selectAppState,
} from "@/services/store/slices/app-slice";
import {
  selectAuth,
  validateSession,
} from "@/services/store/slices/auth-slice";
import {
  fetchSettings,
  selectSettings,
} from "@/services/store/slices/settings-slices";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const RootRoute = () => {
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const appState = useAppSelector(selectAppState);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  console.log("auth state", auth);
  console.log("app state", appState);
  console.log("settings state", settings);

  useEffect(() => {
    dispatch(fetchAppState());
    dispatch(fetchSettings());
  }, []);

  useEffect(() => {
    if (appState.isLoading) return;

    if (!appState.data.isInitialized) return router.replace("/onboarding");

    if (settings.isLoading) return;

    if (settings.data.isOfflineMode) return router.replace("/app");

    if (!auth.isLoading) {
      dispatch(validateSession());
      return;
    }

    if (auth.isLoading) return;

    if (auth.data.token) router.replace("/app");
  }, [auth, settings, appState]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RootRoute;
