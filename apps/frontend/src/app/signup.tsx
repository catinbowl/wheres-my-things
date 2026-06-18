import { ThemedText as Text } from "@/components/themed-text";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  // const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleSignIn = async () => {
  //   if (!email || !password) return;

  //   setLoading(true);

  //   try {
  //     const resultAction = await dispatch(signin({ email, password }));
  //     if (signin.rejected.match(resultAction)) {
  //       throw new Error((resultAction.payload as string) || "Sign in failed");
  //     }
  //   } catch (error: any) {
  //     alert(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <SafeAreaView edges={["top"]} style={[styles.safeArea]}>
      {/* <LinearGradient
        colors={["#2BB8B3", "#FED43F"]}
        style={styles.background}
      /> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Text type="subtitle" style={styles.title}>
          Create Account
        </Text>

        <View style={styles.formContainer}>
          <TextInput placeholder="Username" />
          <TextInput placeholder="Email" />
          <TextInput placeholder="Password" />
          <Button title="Sign up" />
        </View>

        <Text style={styles.footerText}>
          Already have account?{" "}
          <Link href="/signin" asChild>
            <Text type="linkPrimary">Sign In</Text>
          </Link>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingVertical: 128,
  },
  title: {
    textAlign: "center",
  },
  formContainer: {
    paddingHorizontal: 16,
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  footerText: {
    textAlign: "center",
    marginTop: 24,
  },
});
