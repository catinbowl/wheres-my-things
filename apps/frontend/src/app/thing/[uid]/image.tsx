import { ThingsRepo } from "@/services/database/repos/things-repo";
import { TThing } from "@/services/database/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const FullscreenImageScreen = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const [something, setSomething] = useState<TThing | null>(null);
  const { uid } = useLocalSearchParams<{ uid: string }>();

  useEffect(() => {
    const fetchSomething = async () => {
      const result = await ThingsRepo.selectByUID(db, uid);
      setSomething(result);
    };
    fetchSomething();
  }, [uid, db]);

  if (!something) return <View style={style.container} />;

  return (
    <View style={style.container}>
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        style={StyleSheet.absoluteFill}
      >
        <Pressable style={style.overlay} onPress={() => router.back()} />
      </Animated.View>

      <Pressable style={style.imageContainer} onPress={() => router.back()}>
        <Animated.Image
          source={{ uri: something.imageURI }}
          style={style.image}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default FullscreenImageScreen;
