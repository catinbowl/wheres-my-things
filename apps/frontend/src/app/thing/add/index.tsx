import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";

import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator } from "expo-image-manipulator";
import { useFocusEffect, useRouter } from "expo-router";
import { View } from "@/components/view";
import { Text } from "@/components/text";
import { useCallback, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Repeat as RepeatIcon,
  Camera as CameraIcon,
} from "lucide-react-native";
import { Spacing } from "@/constants/theme";

const AddThingScreen = () => {
  const router = useRouter();
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
    return <View>{/* <ActivityIndicator animating size="large" /> */}</View>;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: Spacing.three,
        }}
      >
        <Text style={{ textAlign: "center" }}>Need to access camera</Text>
        <Button
          style={{ marginTop: Spacing.four }}
          title="Grant Permission"
          onPress={requestPermission}
        />
      </View>
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
    <View style={{ flex: 1 }}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        ratio="4:3"
      />

      <View style={styles.buttonContainer}>
        <IconButton onPress={handleSwitchCamera} style={styles.actionButton}>
          <RepeatIcon size={24} color="white" />
        </IconButton>

        <IconButton onPress={handleTakePicture} style={styles.actionButton}>
          <CameraIcon size={24} color="white" />
        </IconButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 64,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  actionButton: {
    padding: Spacing.three,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default AddThingScreen;
