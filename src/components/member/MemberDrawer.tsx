import { useEffect } from "react";
import { View, Text, TouchableOpacity, Pressable, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ChartNoAxesColumn, LucideHandHeart } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface MemberDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const ANALYTICS_ITEMS = ["Run Analytics", "Analysis result"] as const;
const WELLNESS_ITEMS = ["Articles", "Books", "Awareness", "Videos", "Myth Vs Facts", "FAQs"] as const;

const WELLNESS_ROUTES: Record<typeof WELLNESS_ITEMS[number], string> = {
  Articles: '/(member)/explore/articles',
  Books: '/(member)/explore/books',
  Awareness: '/(member)/explore/awareness',
  Videos: '/(member)/explore/videos',
  'Myth Vs Facts': '/(member)/explore/myth-vs-facts',
  FAQs: '/(member)/explore/faqs',
};

export function MemberDrawer({ visible, onClose }: MemberDrawerProps) {
  const { width: screenWidth } = useWindowDimensions();
  const drawerWidth = Math.min(screenWidth * 0.7, 320);
  const translateX = useSharedValue(-drawerWidth);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : -drawerWidth, {
      duration: 300,
      easing: Easing.inOut(Easing.sin),
    });
  }, [visible, drawerWidth, translateX]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-drawerWidth, 0], [0, 0.4]),
  }));

  return (
    <View
      className="absolute inset-0 z-50"
      pointerEvents={visible ? "auto" : "none"}
    >
      <Animated.View className="absolute inset-0 bg-black" style={backdropStyle}>
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

      <Animated.View
        className="absolute top-0 bottom-0 bg-white"
        style={[
          drawerStyle,
          {
            width: drawerWidth,
            borderTopRightRadius: 24,
            overflow: "hidden",
          },
        ]}
      >
        <SafeAreaView className="flex-1">
          <View className="flex-row items-center gap-2.5 px-6 pt-4 pb-6 mb-6">
            <Image
              source={require("@/assets/images/logo-3.png")}
              style={{ width: 36, height: 36 }}
              contentFit="contain"
            />
            <Text className="text-xl font-semibold text-gray-900">MedSight</Text>
          </View>

          <View className="flex-1 px-4">
            <View className="flex-row items-center gap-2">
              <ChartNoAxesColumn size={24} color="#DB2777" />
              <Text className="font-semibold uppercase tracking-widest text-xl text-[#DB2777] px-2">
                Analytics
              </Text>
            </View>

            <View className="p-4">
              {ANALYTICS_ITEMS.map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.6}
                className="flex-row items-center gap-3 px-2 py-3.5 rounded-xl"
                onPress={() => {
                  onClose();
                  if (item === "Run Analytics") {
                    router.push("/(member)/analysis");
                  }
                  if (item === "Analysis result") {
                    router.push("/(member)/results");
                  }
                }}
              >
                <Text className="text-lg text-gray-900">{item}</Text>
              </TouchableOpacity>
            ))}
            </View>

            <View className="h-px bg-gray-100 my-2" />

            <View className="flex-row items-center gap-2">
              <LucideHandHeart size={24} color="#DB2777" />
              <Text className="font-semibold uppercase tracking-widest text-xl text-[#DB2777] px-2">
                Wellness
              </Text>
            </View>
           

            <View className="p-4">
              {WELLNESS_ITEMS.map((item) => (
              <TouchableOpacity
                key={item}
                activeOpacity={0.6}
                className="flex-row items-center gap-3 px-2 py-3.5 rounded-xl"
                onPress={() => {
                  onClose();
                  router.push(WELLNESS_ROUTES[item] as any);
                }}
              >
                <Text className="text-lg text-gray-900">{item}</Text>
              </TouchableOpacity>
            ))}
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
