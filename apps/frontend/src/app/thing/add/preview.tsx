import React, { useEffect, useState } from "react";
import * as Crypto from "expo-crypto";
import * as Location from "expo-location";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import Header from "@/components/ui/header";

import { useAppDispatch } from "@/services/store/hooks";
import { fetchThings, insertThing } from "@/services/store/slices/things-slice";
import { Directory, File, Paths } from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View as RNView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "@/components/view";
import { Text } from "@/components/text";
import { Tag, MapPin, Check } from "lucide-react-native";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const PreviewThingScreen = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { uri: imageUri } = useLocalSearchParams<{ uri: string }>();

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(loc);
    } catch (err) {
      console.warn("Location fetch error:", err);
    }
  };

  const handleSave = async () => {
    if (!imageUri || isSaving || !name.trim()) return;

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

      await dispatch(
        insertThing({
          db,
          data: {
            uid,
            name: name.trim(),
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="Save Belonging" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.imageCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <TextInput
              placeholder="Item Name (e.g. House Keys, Passport)"
              value={name}
              onChangeText={setName}
              leftIcon={<Tag size={20} color={theme.textSecondary} />}
            />

            <RNView style={styles.locationBadgeRow}>
              <MapPin size={16} color={location ? theme.secondary : theme.textSecondary} />
              <Text
                style={[
                  styles.locationBadgeText,
                  { color: location ? theme.text : theme.textSecondary },
                ]}
              >
                {location
                  ? `Location tagged (${location.coords.latitude.toFixed(3)}, ${location.coords.longitude.toFixed(3)})`
                  : "Acquiring location..."}
              </Text>
            </RNView>

            <Button
              title="Save Belonging"
              variant="primary"
              size="lg"
              loading={isSaving}
              disabled={!name.trim() || isSaving}
              leftIcon={<Check size={20} color={theme.primaryText} />}
              onPress={handleSave}
              style={styles.saveBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    gap: Spacing.four,
  },
  imageCard: {
    borderRadius: Radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    height: 320,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  formCard: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
  },
  locationBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.one,
  },
  locationBadgeText: {
    fontSize: 13,
  },
  saveBtn: {
    marginTop: Spacing.two,
  },
});

export default PreviewThingScreen;
