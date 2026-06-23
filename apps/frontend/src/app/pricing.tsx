import { Text } from "@/components/text";
import { AppDispatch } from "@/services/store";
import {
  selectAuth,
  updateSubscription,
} from "@/services/store/slices/auth-slice";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const PricingScreen = () => {
  const {
    data: { user },
  } = useSelector(selectAuth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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
      name: "Free",
      price: "$0",
      features: ["Up to 5 items", "Standard sharing", "Basic search"],
      color: ["#4c669f", "#3b5998", "#192f6a"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$4.99/mo",
      features: [
        "Unlimited items",
        "Priority sharing",
        "Advanced AI search",
        "Cloud backup",
      ],
      color: ["#8e2de2", "#4a00e0"],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$49.99/yr",
      features: [
        "All Pro features",
        "Family sharing",
        "Offline mode",
        "24/7 Support",
      ],
      color: ["#f12711", "#f5af19"],
    },
  ];

  const isSubscribed = user?.isSubscribed;

  return (
    <ScrollView style={[styles.container]}>
      <LinearGradient colors={["#FED43F", "#2BB8B3"]} style={styles.header}>
        {/* <IconButton
          icon="close"
          size={24}
          onPress={() => router.back()}
          style={styles.closeButton}
        /> */}
        <Text type="title">Choose Your Plan</Text>
        <Text style={{ textAlign: "center" }}>
          Unlock all features and find your things faster.
        </Text>
      </LinearGradient>

      {/* <View style={styles.plansContainer}>
        {plans.map((plan) => {
          const isCurrentPlan =
            (plan.id === "free" && !isSubscribed) ||
            (isSubscribed &&
              plan.id === "pro" &&
              !user?.subscriptionEnds.includes("yr")) ||
            (isSubscribed && plan.id === "premium");

          return (
            <Card key={plan.id} style={styles.planCard}>
              <LinearGradient
                colors={plan.color as [string, string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.planGradient}
              >
                <View style={styles.planHeader}>
                  <View>
                    <Host>
                      <Text
                        style={{ typography: "titleLarge", fontWeight: "bold" }}
                      >
                        {plan.name}
                      </Text>
                    </Host>
                    {plan.popular && (
                      <Surface style={styles.popularBadge} elevation={1}>
                        <Host>
                          <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                            POPULAR
                          </Text>
                        </Host>
                      </Surface>
                    )}
                  </View>
                  <Host>
                    <Text
                      style={{
                        typography: "headlineSmall",
                        fontWeight: "bold",
                      }}
                    >
                      {plan.price}
                    </Text>
                  </Host>
                </View>
              </LinearGradient>
              <Card.Content style={styles.planContent}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <IconButton
                      icon="check-circle"
                      iconColor={theme.colors.primary}
                      size={18}
                    />
                    <Host>
                      <Text style={{ typography: "bodyMedium" }}>
                        {feature}
                      </Text>
                    </Host>
                  </View>
                ))}
                <Divider style={styles.divider} />
                <Button
                  mode={plan.popular ? "contained" : "outlined"}
                  onPress={() => handleSubscribe(plan.id)}
                  loading={subscribingPlan === plan.id}
                  disabled={subscribingPlan !== null || isCurrentPlan}
                  style={styles.subscribeButton}
                >
                  {isCurrentPlan ? "Current Plan" : "Select Plan"}
                </Button>
              </Card.Content>
            </Card>
          );
        })}
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 10,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 16,
  },
  plansContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  planCard: {
    marginBottom: 24,
    overflow: "hidden",
    borderRadius: 16,
  },
  planGradient: {
    padding: 20,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    color: "white",
    fontWeight: "bold",
  },
  planPrice: {
    color: "white",
    fontWeight: "bold",
  },
  planContent: {
    paddingTop: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  subscribeButton: {
    borderRadius: 8,
  },
  popularBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  popularText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default PricingScreen;
