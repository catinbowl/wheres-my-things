import * as Share from "expo-sharing";
import AnimatedRN from "react-native-reanimated";
import MiniMap from "@/components/mini-map";
import Button from "@/components/ui/button";

import { ThingsRepo } from "@/services/database/repos/things-repo";
import { TThing } from "@/services/database/types";
import { useAppSelector } from "@/services/store/hooks";
import { selectAuth } from "@/services/store/slices/auth-slice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ArrowLeft, MapPin, Share2, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

const ThingScreen = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const [thing, setThing] = useState<TThing | null>(null);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const { uid, uri } = useLocalSearchParams<{
    uid: string | "preview";
    uri: string;
  }>();
  const {
    data: { user },
  } = useAppSelector(selectAuth);

  const fetchThing = async (): Promise<void> => {
    try {
      const thing = await ThingsRepo.selectByUID(db, uid);
      setThing(thing);
    } catch (error) {
      console.error("thing/[uid]/index => fetchThing:", error);
      setSnackBarMessage("Something went wrong while fetching this thing!");
      setShowSnackBar(true);
    }
  };

  useEffect(() => {
    fetchThing();
  }, []);

  const handleDelete = async () => {
    try {
      const result = await ThingsRepo.deleteByUID(db, uid);
      if (result) {
        router.back();
      }
    } catch (error) {
      console.error("thing/[uid]/index => handleDelete:", error);
      setSnackBarMessage("Something went wrong while deleting this thing!");
      setShowSnackBar(true);
    }
  };

  const handleOpenMaps = () => {
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

  const handleShare = async () => {
    if (!thing) return;

    if (!user?.isSubscribed) {
      router.push("/pricing");
      return;
    }

    setIsSharing(true);

    try {
    } catch (error) {
      console.error("thing/[uid]/index => handleShare:", error);
      setSnackBarMessage("Something went wrong while sharing this thing!");
      setShowSnackBar(true);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Stack.Header />

      <View style={style.splitContainer}>
        <View style={style.splitItem}>
          <Pressable
            onPress={() => {
              router.push(`/something/${uid}/image` as any);
            }}
            style={{ flex: 1 }}
          >
            <AnimatedRN.Image
              source={{ uri: thing?.imageURI }}
              style={style.image}
            />
          </Pressable>
        </View>
        <View style={style.splitItem}>
          <MiniMap
            latitude={thing?.latitude || 0}
            longitude={thing?.longitude || 0}
            style={style.miniMap}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  splitContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  splitItem: {
    flex: 1,
    height: "50%",
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
    borderRadius: 16,
  },
  miniMap: {
    flex: 1,
  },
});

export default ThingScreen;
