import React from "react";
import IconButton from "./ui/icon-button";
import { TThing } from "@/services/database/types";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View as RNView } from "react-native";
import { View } from "./view";
import { Image } from "expo-image";
import { Text } from "./text";
import { Radius, Spacing } from "@/constants/theme";
import { MapPin, Share2 } from "lucide-react-native";
import { useThingActions } from "@/hooks/use-thing-actions";
import { useTheme } from "@/hooks/use-theme";

type Props = TThing;

export default function ThingListItem(props: Props) {
  const router = useRouter();
  const theme = useTheme();
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
      style={({ pressed }) => [
        styles.pressableContainer,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.thingCard,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor,
          },
        ]}
      >
        <Image
          source={{ uri: imageURI }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />

        <View style={styles.contentRow}>
          <Text type="h5" numberOfLines={1} style={styles.thingName}>
            {name}
          </Text>

          <RNView style={styles.actionsGroup}>
            <IconButton
              variant="filled"
              onPress={(e) => {
                e.stopPropagation();
                handleShare(props);
              }}
              style={styles.actionBtn}
            >
              <Share2 size={18} color={theme.text} />
            </IconButton>

            <IconButton
              variant="primary"
              onPress={(e) => {
                e.stopPropagation();
                handleOpenMaps(props);
              }}
              style={styles.actionBtn}
            >
              <MapPin size={18} color={theme.primaryText} />
            </IconButton>
          </RNView>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    borderRadius: Radius.lg,
    marginVertical: Spacing.one,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  thingCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.three,
    backgroundColor: "transparent",
  },
  thingName: {
    flex: 1,
    marginRight: Spacing.two,
  },
  actionsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
