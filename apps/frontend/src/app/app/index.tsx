import React, { useEffect, useState } from "react";
import SearchBar from "@/components/ui/search-bar";
import Button from "@/components/ui/button";
import { ActivityIndicator, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/text";
import { View } from "@/components/view";
import { Spacing } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/services/store/hooks";
import {
  fetchThings,
  searchThings,
  selectThings,
} from "@/services/store/slices/things-slice";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import ThingListItem from "@/components/thing-list-item";
import { Box, Plus, SearchX } from "lucide-react-native";
import { useTheme } from "@/hooks/use-theme";

export default function HomeScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const { data: things, isLoading } = useAppSelector(selectThings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (query.trim() === "") {
      dispatch(fetchThings(db));
    } else {
      dispatch(searchThings({ db, query }));
    }
  }, [db, query, dispatch]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerArea}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {things.length > 0 ? (
            <View style={styles.listGap}>
              {things.map((thing) => (
                <ThingListItem {...thing} key={thing.uid} />
              ))}
            </View>
          ) : !isLoading ? (
            <View style={styles.emptyStateContainer}>
              <View
                style={[
                  styles.emptyIconCircle,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                {query.length > 0 ? (
                  <SearchX size={36} color={theme.textSecondary} />
                ) : (
                  <Box size={36} color={theme.textSecondary} />
                )}
              </View>

              <Text type="h5" style={styles.emptyTitle}>
                {query.length > 0 ? "No results found" : "No belongings added yet"}
              </Text>

              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                {query.length > 0
                  ? `No items match "${query}". Try another search term.`
                  : "Start tracking your items by adding your first thing."}
              </Text>

              {query.length === 0 && (
                <Button
                  title="Add First Thing"
                  variant="primary"
                  size="md"
                  leftIcon={<Plus size={18} color={theme.primaryText} />}
                  onPress={() => router.navigate("/thing/add")}
                  style={styles.addBtn}
                />
              )}
            </View>
          ) : null}

          {isLoading && (
            <ActivityIndicator style={styles.activityIndicator} size="large" color={theme.primary} />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  headerArea: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
    paddingTop: Spacing.one,
  },
  headerTitle: {
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  listGap: {
    gap: Spacing.one,
  },
  activityIndicator: {
    marginTop: Spacing.four,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  emptyTitle: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.one,
  },
  emptySubtitle: {
    textAlign: "center",
    fontSize: 15,
    maxWidth: 280,
    marginBottom: Spacing.four,
  },
  addBtn: {
    marginTop: Spacing.two,
  },
});
