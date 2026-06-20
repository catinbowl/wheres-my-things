import { Circle, Group } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

interface Props {
  x: number;
  y: number;
  scale: number;
}

const SomethingMarker = ({ x, y, scale }: Props) => {
  const targetX = x * scale;
  const targetY = -y * scale;

  const cx = useSharedValue(targetX);
  const cy = useSharedValue(targetY);

  useEffect(() => {
    cx.value = withTiming(targetX, { duration: 800 });
    cy.value = withTiming(targetY, { duration: 800 });
  }, [targetX, targetY]);

  return (
    <Group>
      <Circle cx={cx} cy={cy} r={6} color="#FF3B30" />
      <Circle cx={cx} cy={cy} r={12} color="rgba(255, 59, 48, 0.2)" />
    </Group>
  );
};

export default SomethingMarker;
