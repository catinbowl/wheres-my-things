import React, { useCallback, useRef, useState } from "react";
import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import Header from "@/components/ui/header";

import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator } from "expo-image-manipulator";
import { useFocusEffect, useRouter } from "expo-router";
import { View } from "@/components/view";
import { Text } from "@/components/text";
import { ActivityIndicator, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RefreshCw,
  Camera as CameraIcon,
  CameraOff,
} from "lucide-react-native";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const AddThingScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsCapturing(false);
    }, []),
  );

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.permissionSafeArea, { backgroundColor: theme.background }]}>
        <Header title="Add New Belonging" />

        <View style={styles.permissionContent}>
          <View
            style={[
              styles.permissionIconCircle,
              { backgroundColor: theme.backgroundElement },
            ]}
          >
            <CameraOff size={44} color={theme.textSecondary} />
          </View>

          <Text type="h3" style={styles.permissionTitle}>
            Camera Permission Needed
          </Text>

          <Text style={[styles.permissionSubtitle, { color: theme.textSecondary }]}>
            We need camera access so you can take a photo of your item and save it.
          </Text>

          <Button
            title="Grant Camera Access"
            variant="primary"
            size="lg"
            onPress={requestPermission}
            style={styles.grantBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleSwitchCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleTakePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);

      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (!photo) return;
        const imageCtx = ImageManipulator.manipulate(photo.uri);
        const result = await (
          await imageCtx.resize({ width: 1080 }).renderAsync()
        ).saveAsync();
        router.push({
          pathname: "/thing/add/preview",
          params: { uri: result.uri },
        });
      } catch (error) {
        console.error("Failed to take picture:", error);
        setIsCapturing(false);
      }
    }
  };

  return (
    <View style={styles.fullScreen}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      />

      <SafeAreaView style={styles.overlaySafeArea} pointerEvents="box-none">
        <View style={styles.topBar}>
          <IconButton
            variant="filled"
            onPress={() => router.back()}
            style={styles.glassButton}
          >
            <Header showBack={true} />
          </IconButton>
        </View>

        <View style={styles.bottomControls}>
          <IconButton
            variant="filled"
            onPress={handleSwitchCamera}
            style={styles.controlCircle}
          >
            <RefreshCw size={24} color="#FFFFFF" />
          </IconButton>

          <Pressable
            disabled={isCapturing}
            onPress={handleTakePicture}
            style={({ pressed }) => [
              styles.shutterOuterRing,
              pressed && styles.shutterPressed,
            ]}
          >
            <View style={styles.shutterInnerCircle}>
              {isCapturing ? (
                <ActivityIndicator size="small" color="#1A1A1A" />
              ) : (
                <CameraIcon size={28} color="#1A1A1A" />
              )}
            </View>
          </Pressable>

          <View style={styles.placeholderCircle} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionSafeArea: {
    flex: 1,
  },
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
  },
  permissionIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  permissionTitle: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: Spacing.two,
  },
  permissionSubtitle: {
    textAlign: "center",
    fontSize: 15,
    maxWidth: 280,
    marginBottom: Spacing.five,
  },
  grantBtn: {
    width: "100%",
  },
  overlaySafeArea: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
  },
  topBar: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  glassButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: Radius.lg,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  controlCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderCircle: {
    width: 52,
    height: 52,
  },
  shutterOuterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#FED43F",
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  shutterPressed: {
    transform: [{ scale: 0.94 }],
  },
  shutterInnerCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 34,
    backgroundColor: "#FED43F",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddThingScreen;
