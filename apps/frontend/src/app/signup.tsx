import React, { useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import Header from "@/components/ui/header";
import { Text } from "@/components/text";
import { Link, useRouter, useNavigation } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mail, Lock, User } from "lucide-react-native";
import { Spacing, Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function SignUpScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              leftIcon={<User size={20} color={theme.textSecondary} />}
            />

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
