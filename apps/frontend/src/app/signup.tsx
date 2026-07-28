import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import Header from "@/components/ui/header";

import { useEffect, useState } from "react";
import { Text } from "@/components/text";
import { Link, useRouter, useNavigation } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock, User, Check, XCircle } from "lucide-react-native";
import { Spacing, Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function SignUpScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameStatus(null);
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    setUsernameStatus(null);

    const timer = setTimeout(async () => {
      try {
        const apiHost = process.env.API_HOST_URL || "";
        const res = await fetch(
          `${apiHost}/check-username?username=${encodeURIComponent(trimmed)}`
        );

        if (res.ok) {
          const data = await res.json();
          setUsernameStatus({
            available: data.available,
            message: data.message,
          });
        } else {
          setUsernameStatus({
            available: false,
            message: "Unable to check username availability",
          });
        }
      } catch (error) {
        setUsernameStatus({
          available: false,
          message: "Error connecting to server",
        });
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <Text type="h2" style={styles.title}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Join and keep track of all your things effortlessly
            </Text>
          </View>

          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <View style={styles.inputGroup}>
              <TextInput
                placeholder="Username"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
                leftIcon={<User size={20} color={theme.textSecondary} />}
                error={usernameStatus !== null && !usernameStatus.available}
                rightIcon={
                  isCheckingUsername ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                  ) : usernameStatus ? (
                    usernameStatus.available ? (
                      <Check size={20} color="#10B981" />
                    ) : (
                      <XCircle size={20} color={theme.danger} />
                    )
                  ) : null
                }
              />
              {usernameStatus && (
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: usernameStatus.available
                        ? "#10B981"
                        : theme.danger,
                    },
                  ]}
                >
                  {usernameStatus.message}
                </Text>
              )}
            </View>

            <TextInput
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Mail size={20} color={theme.textSecondary} />}
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color={theme.textSecondary} />}
            />

            <Button
              title="Create Account"
              variant="primary"
              size="lg"
              style={styles.submitBtn}
            />
          </View>

          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Already have an account?{" "}
            <Link
              href="/signin"
              asChild
              onPress={(e) => {
                const state = navigation.getState();
                const routes = state?.routes || [];
                const previousRoute = routes[routes.length - 2];
                if (previousRoute && previousRoute.name === "signin") {
                  e.preventDefault();
                  router.back();
                }
              }}
            >
              <Text type="linkPrimary" style={styles.linkText}>
                Sign In
              </Text>
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: "center",
    paddingBottom: Spacing.six,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: Spacing.five,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: Spacing.one,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
  },
  cardContainer: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
  },
  inputGroup: {
    gap: Spacing.one,
  },
  statusText: {
    fontSize: 13,
    marginLeft: Spacing.one,
  },
  submitBtn: {
    marginTop: Spacing.two,
  },
  footerText: {
    textAlign: "center",
    marginTop: Spacing.four,
    fontSize: 15,
  },
  linkText: {
    fontWeight: "700",
  },
});

