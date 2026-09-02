import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ITEMS = [
  {
    id: "articles",
    title: "Articles",
    bg: "#BFDBFE",
    image: null,
    route: "../explore/articles",
  },
  {
    id: "awareness",
    title: "Awareness",
    bg: "#FCE7F3",
    image: require("@/assets/images/woman.png"),
    route: "../explore/awareness",
  },
  {
    id: "myth-vs-facts",
    title: "Myth vs Facts",
    bg: "#FEF3C7",
    image: require("@/assets/images/magnifier.png"),
    route: "../explore/myth-vs-facts",
  },
  {
    id: "faqs",
    title: "FAQs",
    bg: "#F5F5F4",
    image: null,
    route: "../explore/faqs",
  },
];

export function QuickAccess() {
  const { width: screenWidth } = useWindowDimensions();
  const gap = 10;
  const totalRowWidth = screenWidth - 40;

  const CARD_LAYOUT = [0.4, 0.6, 0.6, 0.4];

  const getCardWidth = (index: number) => {
    return (totalRowWidth - gap) * CARD_LAYOUT[index];
  };

  return (
    <View className="mt-6">
      <Text className="text-lg font-bold text-gray-900 mb-3">
        Quick Access
      </Text>

      <View className="flex-row flex-wrap" style={{ gap }}>
        {ITEMS.map((item, index) => {
          const cardWidth = getCardWidth(index);

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => router.push(item.route as any)}
              style={{
                width: cardWidth,
                height: 170,
                backgroundColor: item.bg,
              }}
              className="rounded-2xl p-4 overflow-hidden"
            >
              <Text className="text-sm font-semibold text-gray-900">
                {item.title}
              </Text>

              {item.image && (
                <Image
                  source={item.image}
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: cardWidth * 0.55,
                    height: 127,
                  }}
                  contentFit="contain"
                />
              )}

              <View className="absolute bottom-3 right-3 w-7 h-7 bg-white/80 rounded-full items-center justify-center">
                <Ionicons name="arrow-forward" size={14} color="#111827" />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
