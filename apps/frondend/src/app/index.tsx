import { AppDispatch } from "@/services/store";
import { useAppSelector } from "@/services/store/hooks";
import {
  fetchSettings,
  selectSettings,
} from "@/services/store/slices/settings-slices";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

const RootRoute = () => {
  const router = useRouter();
  const settings = useAppSelector(selectSettings);
  const dispatch = useDispatch<AppDispatch>();

  console.log(settings);

  useEffect(() => {
    dispatch(fetchSettings());
  });

  useEffect(() => {
    if (settings.isLoading) return;

    if (!settings.data.isInitialized) {
      router.replace("/onboarding");
    } else {
      router.replace("/app");
    }
  }, [settings]);

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
