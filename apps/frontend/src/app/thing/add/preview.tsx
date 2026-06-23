import * as Crypto from "expo-crypto";
import * as Location from "expo-location";

import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";

import { useAppDispatch } from "@/services/store/hooks";
import { fetchThings, insertThing } from "@/services/store/slices/things-slice";
import { Directory, File, Paths } from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "@/components/view";

const PreviewThingScreen = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const dispatch = useAppDispatch();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { uri: imageUri } = useLocalSearchParams<{ uri: string }>();

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Permission to access location was denied");

      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    setLocation(location);
  };

  const handleSave = async () => {
    if (!imageUri || isSaving) return;

    try {
      setIsSaving(true);

      const uid = Crypto.randomUUID();
      const imagesDir = new Directory(Paths.document, "images");

      if (!imagesDir.exists) {
        imagesDir.create();
      }

      const sourceFile = new File(imageUri);
      const targetFile = new File(imagesDir, `${uid}${sourceFile.extension}`);

      sourceFile.move(targetFile);

      console.log(targetFile.uri);

      await dispatch(
        insertThing({
          db,
          data: {
            uid,
            name,
            imageURI: targetFile.uri,
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
          },
        }),
      ).unwrap();

      await dispatch(fetchThings(db)).unwrap();

      router.replace("/app");
    } catch (error) {
      console.error("Failed to save something:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        paddingTop: 16,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="red" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              marginBottom: 32,
              paddingHorizontal: 16,
              gap: 16,
            }}
          >
            <Image
              source={{ uri: imageUri }}
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                borderRadius: 20,
              }}
              resizeMode="contain"
            />

            <TextInput placeholder="Name" value={name} onChangeText={setName} />

            <Button title="Save" onPress={handleSave} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PreviewThingScreen;
