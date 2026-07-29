import MiniMap from "@/components/mini-map";
import SlideUpModal from "@/components/slide-up-modal";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import IconButton from "@/components/ui/icon-button";
import Animated from "react-native-reanimated";

import { Text } from "@/components/text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useThingActions } from "@/hooks/use-thing-actions";
import { ThingsRepo } from "@/services/database/repos/things-repo";
import { TThing } from "@/services/database/types";
import { useAppDispatch } from "@/services/store/hooks";
import { fetchThings } from "@/services/store/slices/things-slice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { MapPin, Share2, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ThingScreen = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const theme = useTheme();
  const [thing, setThing] = useState<TThing | null>(null);
  const [isConfirmingDeletion, setIsConfirmingDeletion] = useState(false);
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const dispatch = useAppDispatch();

  const {
    handleOpenMaps,
    handleShare,
    setSnackBarMessage,
    setShowSnackBar,
  } = useThingActions();

  const fetchThing = async (): Promise<void> => {
    try {
      const result = await ThingsRepo.selectByUID(db, uid);
      setThing(result);
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
    <SafeAreaView style={[style.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style="dark" />

      <Header
        title={thing?.name || "Belonging Detail"}
        actionButtons={
          <>
            <IconButton onPress={() => setIsConfirmingDeletion(true)}>
              <Trash2 size={20} color={theme.danger} />
            </IconButton>
            <IconButton onPress={() => handleShare(thing)}>
              <Share2 size={20} color={theme.text} />
            </IconButton>
            <IconButton onPress={() => handleOpenMaps(thing)}>
              <MapPin size={20} color={theme.text} />
            </IconButton>
          </>
        }
      />

      <View style={style.splitContainer}>
        <View
          style={[
            style.cardWrapper,
            { backgroundColor: theme.cardBackground, borderColor: theme.borderColor },
          ]}
        >
          <Pressable
            onPress={() => {
              router.navigate({
                pathname: "/thing/[uid]/image",
                params: { uid },
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

        <View
          style={[
            style.cardWrapper,
            { backgroundColor: theme.cardBackground, borderColor: theme.borderColor },
          ]}
        >
          <MiniMap
            latitude={thing?.latitude || 0}
            longitude={thing?.longitude || 0}
            style={style.miniMap}
          />
        </View>
      </View>

      <SlideUpModal
        isOpen={isConfirmingDeletion}
        title="Delete Belonging"
        onClose={() => setIsConfirmingDeletion(false)}
      >
        <View style={style.modalContent}>
          <Text style={[style.modalText, { color: theme.textSecondary }]}>
            Are you sure you want to delete "{thing?.name}"? This action cannot be undone.
          </Text>
          <View style={style.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              size="md"
              onPress={() => setIsConfirmingDeletion(false)}
              style={{ flex: 1 }}
            />
            <Button
              title="Delete"
              variant="danger"
              size="md"
              onPress={handleDelete}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </SlideUpModal>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  splitContainer: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  cardWrapper: {
    flex: 1,
    borderRadius: Radius.xl,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  miniMap: {
    flex: 1,
  },
  modalContent: {
    gap: Spacing.four,
    paddingVertical: Spacing.two,
  },
  modalText: {
    fontSize: 15,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
});

export default ThingScreen;
