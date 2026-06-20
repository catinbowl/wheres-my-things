import { Group, Path } from "@shopify/react-native-skia";

interface Props {
  center: number;
}

const UserMarker = ({ center }: Props) => {
  return (
    <Group transform={[{ translateX: center }, { translateY: center }]}>
      <Path path="M0 -8 L6 6 L0 3 L-6 6 Z" color="#007AFF" />
    </Group>
  );
};

export default UserMarker;
