import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { store } from "@/services/store";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
} from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="wheresmythings.db">
        <Provider store={store}>
          <AnimatedSplashOverlay />

          <SafeAreaProvider>
            <Stack
              screenOptions={{ headerShown: false }}
              initialRouteName="index"
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="app" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="signin" />
              <Stack.Screen name="signup" />
            </Stack>
          </SafeAreaProvider>
        </Provider>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
