import IconButton from "./ui/icon-button";

import { TThing } from "@/services/database/types";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { View } from "./view";
import { Image } from "expo-image";
import { Text } from "./text";
import { Radius, Spacing } from "@/constants/theme";
import { MapPin, Share2 } from "lucide-react-native";
import { useThingActions } from "@/hooks/use-thing-actions";

type Props = TThing;

export default function ThingListItem(props: Props) {
  const router = useRouter();
  const { uid, name, imageURI } = props;
  const { handleOpenMaps, handleShare } = useThingActions();

  return (
    <Pressable
      key={uid}
      onPress={() =>
        router.navigate({
          pathname: "/thing/[uid]",
          params: {
            uid,
          },
        })
      }
    >
      <View type="backgroundElement" style={styles.thingContainer}>
        <Image source={{ uri: imageURI }} style={{ aspectRatio: 4 / 3 }} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBlock: Spacing.three,
            paddingHorizontal: Spacing.three,
          }}
        >
          <Text style={styles.thingName}>{name}</Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing.two,
            }}
          >
            <IconButton onPress={() => handleShare(props)}>
              <Share2 size={20} />
            </IconButton>
            <IconButton onPress={() => handleOpenMaps(props)}>
              <MapPin size={20} />
            </IconButton>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  thingContainer: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    backgroundColor: "rgba(254, 213, 63, 1)",
  },
  thingName: {
    flex: 1,
  },
});
