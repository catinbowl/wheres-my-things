import useCompass from "@/hooks/use-compass";
import SomethingMarker from "./ui/something-marker";
import UserMarker from "./ui/user-marker";

import { useCurrentLocation } from "@/hooks/use-current-location";
import {
  Canvas,
  Circle,
  DashPathEffect,
  Group,
} from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import { StyleSheet, ViewProps } from "react-native";
import { useDerivedValue } from "react-native-reanimated";
import { View } from "./view";
import { Text } from "./text";
import { Radius } from "@/constants/theme";

interface Props extends ViewProps {
  latitude: number;
  longitude: number;
}

const R = 6371000; // Earth's radius in meters

const MiniMap = ({
  latitude: targetLat,
  longitude: targetLon,
  ...props
}: Props) => {
  return (
    <View style={[props.style]} {...props}>
      <Map latitude={targetLat} longitude={targetLat} {...props} />
    </View>
  );
};

const Loading = (props: ViewProps) => {
  return (
    <View style={[props.style, styles.loading]}>
      <Text style={styles.loadingText}>Locating...</Text>
    </View>
  );
};

const Map = ({
  latitude: targetLat,
  longitude: targetLon,
  ...props
}: Props) => {
  const [canvasSize, setCanvasSize] = useState(0);
  const { location, errorMsg } = useCurrentLocation(1000);
  const { heading } = useCompass();

  const stats = useMemo(() => {
    if (!location) return null;

    const lat1 = location.latitude * (Math.PI / 180);
    const lat2 = targetLat * (Math.PI / 180);
    const lon1 = location.longitude * (Math.PI / 180);
    const lon2 = targetLon * (Math.PI / 180);
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    // Haversine distance
    const a = Math.max(
      0,
      Math.min(
        1,
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2),
      ),
    );
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Simple projection for the 2D map
    const y = (targetLat - location.latitude) * 111320;
    const x = (targetLon - location.longitude) * 111320 * Math.cos(lat1);

    // Bearing
    const yB = Math.sin(dLon) * Math.cos(lat2);
    const xB =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = (Math.atan2(yB, xB) * 180) / Math.PI;

    return { distance, x, y, bearing };
  }, [location, targetLat, targetLon]);

  const animatedTransform = useDerivedValue(() => {
    return [
      { translateX: canvasSize / 2 },
      { translateY: canvasSize / 2 },
      { rotate: -heading.value * (Math.PI / 180) },
    ];
  }, [canvasSize]);

  if (errorMsg) {
    return (
      <View>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location || !stats) {
    return <Loading {...props} />;
  }

  const { distance, x, y } = stats;
  const accuracy = location?.accuracy || 0;

  const maxDim = Math.max(Math.abs(x), Math.abs(y), accuracy, 10);
  const scale = canvasSize / 2 / (maxDim * 1.5);

  return (
    <>
      <View
        style={styles.radarContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setCanvasSize(Math.min(width, height) * 0.9);
        }}
      >
        {canvasSize > 0 && (
          <Canvas style={{ width: canvasSize, height: canvasSize }}>
            <Group transform={animatedTransform}>
              {/* Accuracy Circle */}
              <Group opacity={0.3}>
                {distance < accuracy && (
                  <Circle cx={0} cy={0} r={accuracy * scale} style="fill" />
                )}
                <Circle
                  cx={0}
                  cy={0}
                  r={accuracy * scale}
                  style="stroke"
                  strokeWidth={1.5}
                >
                  <DashPathEffect intervals={[4, 2]} />
                </Circle>
              </Group>

              <SomethingMarker x={x} y={y} scale={scale} />
            </Group>

            <UserMarker center={canvasSize / 2} />
          </Canvas>
        )}

        <View style={styles.infoOverlay}>
          <Text style={styles.distanceText}>
            {distance > 1000
              ? `${(distance / 1000).toFixed(2)} km`
              : `${Math.round(distance)} m`}
          </Text>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#007AFF" }]} />
          <Text style={styles.legendText}>You</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#FF3B30" }]} />
          <Text style={styles.legendText}>Your Thing</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  radarContainer: {
    flex: 1,
    position: "relative",
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  infoOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 8,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  directionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  directionText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#444",
    fontWeight: "500",
  },
  error: {
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontStyle: "italic",
  },
});

export default MiniMap;
