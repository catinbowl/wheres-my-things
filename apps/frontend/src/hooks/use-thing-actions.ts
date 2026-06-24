import { useState } from "react";
import { Platform, Linking, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/services/store/hooks";
import { selectAuth } from "@/services/store/slices/auth-slice";
import { TThing } from "@/services/database/types";

export function useThingActions() {
  const router = useRouter();
  const {
    data: { user },
  } = useAppSelector(selectAuth);
  const [isSharing, setIsSharing] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);

  const handleOpenMaps = (thing: TThing | null) => {
    if (!thing) return;

    const { latitude, longitude, name } = thing;
    const url = Platform.select({
      ios: `maps:0,0?q=${name}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${name})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const handleShare = async (thing: TThing | null) => {
    if (!thing) return;

    if (!user?.isSubscribed) {
      router.push("/pricing");
      return;
    }

    setIsSharing(true);

    try {
      // Placeholder for actual sharing mechanism (e.g. expo-sharing) if implemented
    } catch (error) {
      console.error("useThingActions => handleShare:", error);
      setSnackBarMessage("Something went wrong while sharing this thing!");
      setShowSnackBar(true);
      Alert.alert("Error", "Something went wrong while sharing this thing!");
    } finally {
      setIsSharing(false);
    }
  };

  return {
    handleOpenMaps,
    handleShare,
    isSharing,
    showSnackBar,
    setShowSnackBar,
    snackBarMessage,
    setSnackBarMessage,
  };
}
