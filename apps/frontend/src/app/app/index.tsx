import SearchBar from "@/components/ui/search-bar";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/text";
import { View } from "@/components/view";
import { Radius, Spacing } from "@/constants/theme";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/hooks";
import {
  fetchThings,
  searchThings,
  selectThings,
} from "@/services/store/slices/things-slice";
import { useSQLiteContext } from "expo-sqlite";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import ThingListItem from "@/components/thing-list-item";

export default function HomeScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState("");
  const { data: things, isLoading } = useAppSelector(selectThings);

  useEffect(() => {
    if (query.trim() === "") {
      dispatch(fetchThings(db));
    } else {
      dispatch(searchThings({ db, query }));
    }
  }, [db, query, dispatch]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>

        <ScrollView style={{ position: "relative" }}>
          <View style={{ gap: Spacing.two }}>
            {things.map((thing) => (
              <ThingListItem {...thing} key={thing.uid} />
            ))}
          </View>

          {isLoading && (
            <ActivityIndicator style={styles.ActivityIndicator} size="large" />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 16,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  ActivityIndicator: {
    position: "absolute",
    top: 100,
    left: "50%",
    transform: [{ translateX: "-50%" }],
  },
});
