import {
  Accelerometer,
  AccelerometerMeasurement,
  Magnetometer,
  MagnetometerMeasurement,
} from "expo-sensors";
import { useEffect, useRef } from "react";
import { useSharedValue } from "react-native-reanimated";

const UPDATE_INTERVAL_MS = 100;
const LOW_PASS_ALPHA = 0.15;
const DEAD_ZONE_DEGREES = 1.5;

/**
 * Computes tilt-compensated magnetic heading in degrees [0, 360).
 * 0° = North, increases clockwise.
 *
 * Uses the accelerometer to derive pitch and roll, then projects
 * the magnetometer vector onto the horizontal plane before computing
 * the heading angle.
 */
const computeHeading = (
  mag: MagnetometerMeasurement,
  accel: AccelerometerMeasurement,
): number => {
  const { x: ax, y: ay, z: az } = accel;
  const { x: mx, y: my, z: mz } = mag;

  // Normalise accelerometer vector to get the gravity unit vector
  const accelNorm = Math.sqrt(ax * ax + ay * ay + az * az);
  if (accelNorm === 0) return 0;

  const nx = ax / accelNorm;
  const ny = ay / accelNorm;
  const nz = az / accelNorm;

  // Derive pitch and roll from gravity vector
  const pitch = Math.asin(-nx);
  const roll = Math.atan2(ny, nz);

  // Project magnetometer onto the horizontal plane
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const cosRoll = Math.cos(roll);
  const sinRoll = Math.sin(roll);

  const magHorizontalX = mx * cosPitch + mz * sinPitch;
  const magHorizontalY =
    mx * sinRoll * sinPitch + my * cosRoll - mz * sinRoll * cosPitch;

  // Compute heading: 0° = North, clockwise positive
  const heading = Math.atan2(-magHorizontalX, magHorizontalY) * (180 / Math.PI);
  return (heading + 360) % 360;
};

const applyLowPassFilter = (
  current: number,
  previous: number,
  alpha: number,
): number => {
  let delta = current - previous;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return (previous + delta * alpha + 360) % 360;
};

const useCompass = () => {
  const heading = useSharedValue(0);
  const lastHeadingRef = useRef(0);
  const accelRef = useRef<AccelerometerMeasurement>({
    x: 0,
    y: 0,
    z: -1,
    timestamp: 0,
  });

  useEffect(() => {
    let cancelled = false;

    const subscribe = async () => {
      const [magAvailable, accelAvailable] = await Promise.all([
        Magnetometer.isAvailableAsync(),
        Accelerometer.isAvailableAsync(),
      ]);

      if (!magAvailable || !accelAvailable) {
        console.warn(
          "Magnetometer or Accelerometer is not available on this device",
        );
        return;
      }

      if (cancelled) return;

      Magnetometer.setUpdateInterval(UPDATE_INTERVAL_MS);
      Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);

      // Accelerometer just keeps the latest reading for the mag listener to use
      const accelSubscription = Accelerometer.addListener((data) => {
        accelRef.current = data;
      });

      const magSubscription = Magnetometer.addListener((data) => {
        const raw = computeHeading(data, accelRef.current);
        const smoothed = applyLowPassFilter(
          raw,
          lastHeadingRef.current,
          LOW_PASS_ALPHA,
        );

        let delta = Math.abs(smoothed - lastHeadingRef.current);
        if (delta > 180) delta = 360 - delta;
        if (delta < DEAD_ZONE_DEGREES) return;

        lastHeadingRef.current = smoothed;
        heading.value = smoothed;
      });

      return () => {
        accelSubscription.remove();
        magSubscription.remove();
      };
    };

    const cleanupPromise = subscribe();

    return () => {
      cancelled = true;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [heading]);

  return { heading };
};

export default useCompass;
