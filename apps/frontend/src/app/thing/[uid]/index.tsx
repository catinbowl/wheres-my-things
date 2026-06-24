import * as Share from "expo-sharing";
import Animated from "react-native-reanimated";
import MiniMap from "@/components/mini-map";
import Header from "@/components/ui/header";
import IconButton from "@/components/ui/icon-button";

import { ThingsRepo } from "@/services/database/repos/things-repo";
import { TThing } from "@/services/database/types";
import { useAppDispatch, useAppSelector } from "@/services/store/hooks";
import { selectAuth } from "@/services/store/slices/auth-slice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { MapPin, Share2, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchThings } from "@/services/store/slices/things-slice";
import SlideUpModal from "@/components/slide-up-modal";
import { Text } from "@/components/text";
import Button from "@/components/ui/button";

import { useThingActions } from "@/hooks/use-thing-actions";
import { Radius } from "@/constants/theme";

const ThingScreen = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const [thing, setThing] = useState<TThing | null>(null);
  const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);
  const { uid, uri } = useLocalSearchParams<{
    uid: string | "preview";
    uri: string;
  }>();
  const dispatch = useAppDispatch();

  const {
    handleOpenMaps,
    handleShare,
    showSnackBar,
    setShowSnackBar,
    snackBarMessage,
    setSnackBarMessage,
  } = useThingActions();

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
      await dispatch(fetchThings(db)).unwrap();
      if (result) {
        router.back();
      }
    } catch (error) {
      console.error("thing/[uid]/index => handleDelete:", error);
      setSnackBarMessage("Something went wrong while deleting this thing!");
      setShowSnackBar(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        title={thing?.name}
        actionButtons={
          <>
            <IconButton onPress={() => setIsConfirmingDeletion(true)}>
              <Trash2 size={20} />
            </IconButton>
            <IconButton onPress={() => handleShare(thing)}>
              <Share2 size={20} />
            </IconButton>
            <IconButton onPress={() => handleOpenMaps(thing)}>
              <MapPin size={20} />
            </IconButton>
          </>
        }
      />

      <View style={style.splitContainer}>
        <View style={style.splitItem}>
          <Pressable
            onPress={() => {
              router.navigate({
                pathname: "/thing/[uid]/image",
                params: {
                  uid,
                },
              });
            }}
            style={{ flex: 1 }}
          >
            <Animated.Image
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

      <SlideUpModal
        isOpen={isConfirmingDeletion}
        title="Are you sure?"
        onClose={() => setIsConfirmingDeletion(false)}
      >
        <Button title="Yes" onPress={handleDelete} />
      </SlideUpModal>
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
    borderRadius: Radius.lg,
  },
  miniMap: {
    flex: 1,
  },
});

export default ThingScreen;
