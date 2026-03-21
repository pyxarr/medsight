import { Dimensions, Text, TouchableOpacity } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const FAB_SIZE = 60;
const EDGE_MARGIN = 12;

export function DevSitemapFab() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const translateX = useSharedValue(width - FAB_SIZE - EDGE_MARGIN);
  const translateY = useSharedValue(height / 2);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      const snappedX =
        translateX.value + FAB_SIZE / 2 < width / 2
          ? EDGE_MARGIN
          : width - FAB_SIZE - EDGE_MARGIN;

      const topLimit = insets.top + EDGE_MARGIN;
      const bottomLimit = height - FAB_SIZE - insets.bottom - EDGE_MARGIN;
      const clampedY = Math.min(
        Math.max(translateY.value, topLimit),
        bottomLimit,
      );

      translateX.value = withSpring(snappedX);
      translateY.value = withSpring(clampedY);
      offsetX.value = snappedX;
      offsetY.value = clampedY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePress = () => {
    pathname === "/_sitemap" ? router.back() : router.push("/_sitemap");
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        className="absolute w-[60px] h-[60px] rounded-full bg-black justify-center items-center"
        style={[animatedStyle, { elevation: 8 }]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <Text className="text-[26px]">🗺️</Text>
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
}
