import * as Share from "expo-sharing";
import AnimatedRN from "react-native-reanimated";
import MiniMap from "@/components/mini-map";

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

const SomethingScreen = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const { uid, uri } = useLocalSearchParams<{
    uid: string | "preview";
    uri: string;
  }>();
  const [thing, setThing] = useState<TThing | null>(null);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const {
    data: { user },
  } = useAppSelector(selectAuth);

  useEffect(() => {
    fetchSomething();
  }, []);

  const fetchSomething = async () => {
    const result =
      uid === "preview"
        ? await importSFMTFile(uri)
        : await ThingsRepo.selectByUid(db, uid);

    if (!result) {
      setSnackBarMessage("Something went wrong while fetching this thing!");
      setShowSnackBar(true);
      return;
    }

    setSomething(result);
  };

  const handleDelete = async () => {
    try {
      const result = await ThingsRepo.deleteByUid(db, uid);
      if (result) {
        router.back();
      }
    } catch (error) {
      console.error("[uid]/index.tsx => handleDelete:", error);
      setSnackBarMessage("Something went wrong while deleting this thing!");
      setShowSnackBar(true);
    }
  };

  const handleOpenMaps = () => {
    if (!something) return;

    const { latitude, longitude, name } = something;
    const url = Platform.select({
      ios: `maps:0,0?q=${name}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${name})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const handleShare = async () => {
    if (!something) return;

    if (!user?.isSubscribed) {
      router.push("/subscription");
      return;
    }

    setIsSharing(true);

    try {
      const sfmtUri = await exportSFMTFile(something.imageURI, something);
      if (sfmtUri) {
        await Share.shareAsync(sfmtUri);
      }
    } catch (error) {
      console.error("[uid]/index.tsx => handleShare:", error);
      setSnackBarMessage("Something went wrong while sharing this thing!");
      setShowSnackBar(true);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <XStack
        paddingHorizontal={16}
        paddingVertical={12}
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderBottomColor="rgba(0, 0, 0, 0.3)"
      >
        <Button
          icon={ArrowLeft}
          circular
          chromeless
          size="$4"
          color="black"
          onPress={() => router.back()}
        />
        <H5 fontWeight="bold" flex={1} marginLeft={12} numberOfLines={1}>
          {something?.name || "Loading..."}
        </H5>
        <XStack gap={8}>
          <Button
            icon={MapPin}
            circular
            chromeless
            size="$4"
            color="black"
            onPress={handleOpenMaps}
          />
          {isSharing ? (
            <Button circular chromeless size="$4" color="black">
              <Spinner size="small" />
            </Button>
          ) : (
            <Button
              icon={Share2}
              circular
              chromeless
              size="$4"
              color="black"
              onPress={handleShare}
            />
          )}
          <Button
            icon={Trash2}
            circular
            chromeless
            size="$4"
            color="black"
            onPress={handleDelete}
          />
        </XStack>
      </XStack>

      <View style={style.splitContainer}>
        <View style={style.splitItem}>
          <Pressable
            onPress={() => {
              router.push(`/something/${uid}/image` as any);
            }}
            style={{ flex: 1 }}
          >
            <AnimatedRN.Image
              source={{ uri: something?.imageURI }}
              style={style.image}
            />
          </Pressable>
        </View>
        <View style={style.splitItem}>
          <MiniMap
            latitude={something?.latitude || 0}
            longitude={something?.longitude || 0}
            style={style.miniMap}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    padding: 16,
  },
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

export default SomethingScreen;
