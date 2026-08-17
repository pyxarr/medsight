import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export interface Banner {
  id: string;
  title: string;
  bg: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = screenWidth - 40;

  if (banners.length === 0) {
    return null;
  }

  return (
    <View className="mt-4">
      <View
        className="rounded-2xl overflow-hidden"
        style={{ width: cardWidth, height: 170 }}
      >
        <FlatList
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
            setActiveIndex(index);
          }}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => (
            <View
              style={{ width: cardWidth, height: 170, backgroundColor: item.bg }}
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.55)"]}
                locations={[0.45, 1]}
                style={{
                  flex: 1,
                  justifyContent: "flex-end",
                  padding: 16,
                }}
              >
                <Text
                  className="text-white font-bold text-lg leading-6"
                  style={{ maxWidth: "75%" }}
                  numberOfLines={3}
                >
                  {item.title}
                </Text>

                <View className="flex-row items-center justify-between mt-3">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-row items-center bg-white rounded-full px-4 py-2 self-start"
                  >
                    <Text className="text-sm font-semibold text-gray-900 mr-1">
                      Read article
                    </Text>
                    <Text className="text-gray-900 text-sm">↗</Text>
                  </TouchableOpacity>

                  <View className="flex-row items-center gap-1.5">
                    {banners.map((_, i) => (
                      <View
                        key={i}
                        className={`rounded-full ${
                          i === activeIndex
                            ? "w-5 h-2 bg-white"
                            : "w-2 h-2 bg-white/50"
                        }`}
                      />
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
        />
      </View>
    </View>
  );
}
