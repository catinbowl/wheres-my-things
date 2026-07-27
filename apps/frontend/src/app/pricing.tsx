import React, { useState } from "react";
import { Text } from "@/components/text";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import { AppDispatch } from "@/services/store";
import {
  selectAuth,
  updateSubscription,
} from "@/services/store/slices/auth-slice";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Sparkles } from "lucide-react-native";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const PricingScreen = () => {
  const {
    data: { user },
  } = useSelector(selectAuth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const theme = useTheme();

  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (planId === "free") {
      Alert.alert("Info", "You are already on the free plan.");
      return;
    }

    setSubscribingPlan(planId);
    try {
      await dispatch(updateSubscription(planId)).unwrap();
      Alert.alert(
        "Success",
        `You have successfully subscribed to the ${planId} plan!`,
      );
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Subscription Error",
        error.message || "Failed to update subscription. Please try again.",
      );
    } finally {
      setSubscribingPlan(null);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "$0",
      period: "forever",
      features: ["Up to 5 items", "Standard sharing", "Basic search"],
      colors: [theme.cardBackground, theme.backgroundElement] as const,
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "$4.99",
      period: "/month",
      features: [
        "Unlimited items",
        "Priority sharing",
        "Advanced AI search",
        "Cloud backup",
      ],
      colors: ["#FED43F", "#F59E0B"] as const,
      popular: true,
    },
    {
      id: "premium",
      name: "Premium Annual",
      price: "$49.99",
      period: "/year",
      features: [
        "All Pro features",
        "Family sharing",
        "Offline mode",
        "24/7 Priority Support",
      ],
      colors: ["#2BB8B3", "#0D9488"] as const,
    },
  ];

  const isSubscribed = user?.isSubscribed;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="Choose Your Plan" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text type="h2" style={styles.heroTitle}>
            Unlock Full Access
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Find your things faster with AI search and unlimited cloud backup.
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => {
            const isCurrentPlan =
              (plan.id === "free" && !isSubscribed) ||
              (isSubscribed &&
                plan.id === "pro" &&
                !user?.subscriptionEnds?.includes("yr")) ||
              (isSubscribed && plan.id === "premium");

            const isProGradient = plan.popular;

            return (
              <View
                key={plan.id}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: plan.popular ? theme.primary : theme.borderColor,
                    borderWidth: plan.popular ? 2 : 1,
                  },
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Sparkles size={12} color="#1A1A1A" />
                    <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <Text type="h4" style={styles.planName}>
                    {plan.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text type="h2" style={styles.planPrice}>
                      {plan.price}
                    </Text>
                    <Text style={[styles.planPeriod, { color: theme.textSecondary }]}>
                      {plan.period}
                    </Text>
                  </View>
                </View>

                <View style={styles.featureList}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <CheckCircle2
                        size={18}
                        color={plan.popular ? theme.primary : theme.secondary}
                      />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <Button
                  title={isCurrentPlan ? "Current Plan" : "Select Plan"}
                  variant={plan.popular ? "primary" : isCurrentPlan ? "outline" : "secondary"}
                  size="md"
                  loading={subscribingPlan === plan.id}
                  disabled={subscribingPlan !== null || isCurrentPlan}
                  onPress={() => handleSubscribe(plan.id)}
                  style={styles.subscribeBtn}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: Spacing.three,
  },
  heroTitle: {
    textAlign: "center",
    fontWeight: "700",
  },
  heroSubtitle: {
    textAlign: "center",
    marginTop: Spacing.one,
    fontSize: 15,
    maxWidth: 300,
  },
  plansContainer: {
    gap: Spacing.four,
    marginTop: Spacing.two,
  },
  planCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: Spacing.four,
    backgroundColor: "#FED43F",
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1A1A1A",
  },
  planHeader: {
    marginBottom: Spacing.three,
  },
  planName: {
    fontWeight: "700",
    marginBottom: Spacing.one,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  planPrice: {
    fontWeight: "800",
  },
  planPeriod: {
    fontSize: 14,
  },
  featureList: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  featureText: {
    fontSize: 15,
  },
  subscribeBtn: {
    marginTop: Spacing.one,
  },
});

export default PricingScreen;
