import * as Location from "expo-location";

import { useEffect, useState } from "react";

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  heading: number | null;
}

export function useCurrentLocation(refreshIntervalMs: number = 3000) {
  const [location, setLocation] = useState<CurrentLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<Location.PermissionStatus | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Initial location
      try {
        const currentLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setLocation({
          latitude: currentLoc.coords.latitude,
          longitude: currentLoc.coords.longitude,
          accuracy: currentLoc.coords.accuracy,
          heading: currentLoc.coords.heading,
        });
      } catch (e) {
        setErrorMsg("Failed to get initial location");
      }

      // Start watching
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: refreshIntervalMs,
          distanceInterval: 0,
        },
        (newLoc) => {
          setLocation({
            latitude: newLoc.coords.latitude,
            longitude: newLoc.coords.longitude,
            accuracy: newLoc.coords.accuracy,
            heading: newLoc.coords.heading,
          });
        },
      );
    }

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [refreshIntervalMs]);

  return { location, errorMsg, permissionStatus };
}
