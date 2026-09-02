import { useEffect, useRef, useState } from "react";
import { Linking, View, Text, FlatList, TouchableOpacity, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Article } from "@/features/explore";

interface BannerCarouselProps {
  articles: Article[];
}

const FALLBACK_COLORS = ["#9D6B9E", "#5B8DAE", "#D2886E", "#4A90A4", "#C06C84"];

export function BannerCarousel({ articles }: BannerCarouselProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = screenWidth - 40;
  const flatListRef = useRef<FlatList<Article>>(null);
  const articleCount = Math.min(articles.length, 3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getFallbackColor = (index: number) => FALLBACK_COLORS[index % FALLBACK_COLORS.length];

  useEffect(() => {
    if (articleCount === 0) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % articleCount);
      flatListRef.current?.scrollToIndex({ animated: true, index: (activeIndex + 1) % articleCount });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleCount]);

  if (articleCount === 0) {
    return null;
  }

  return (
    <View className="mt-4">
      <View
        className="rounded-2xl overflow-hidden"
        style={{ width: cardWidth, height: 170 }}
      >
        <FlatList
          ref={flatListRef}
          data={articles.slice(0, 3)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
            setActiveIndex(index);
          }}
          keyExtractor={(a) => a.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.url).catch(() => {})}
              activeOpacity={0.8}
              style={{ width: cardWidth, height: 170 }}
            >
              <View style={{ width: cardWidth, height: 170, position: "relative" }}>
                {/* Background Image or Fallback */}
                {item.coverImageUrl ? (
                  <Image
                    source={{ uri: item.coverImageUrl }}
                    style={{ width: cardWidth, height: 170 }}
                    resizeMode="cover"
                    contentFit="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: cardWidth,
                      height: 170,
                      backgroundColor: getFallbackColor(index),
                    }}
                  />
                )}

                {/* Gradient Overlay - Absolute positioned */}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.7)"]}
                  locations={[0.4, 1]}
                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                />

                {/* Content - Absolute positioned on top */}
                <View
                  style={{
                    position: "absolute",
                    top: -4 ,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 16,
                  }}
                >
                  <View className="gap-2">
                    <Text className="text-white text-xs font-medium uppercase tracking-wider">
                      {item.source}
                    </Text>
                    <Text
                      className="text-white font-bold text-lg leading-6"
                      style={{ maxWidth: "85%" }}
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <Text
                      className="text-white/90 text-sm leading-5"
                      numberOfLines={2}
                    >
                      {item.excerpt}
                    </Text>

                    <View className="flex-row items-center justify-between mt-1">
                      <TouchableOpacity
                        onPress={() => Linking.openURL(item.url).catch(() => {})}
                        activeOpacity={0.8}
                        className="flex-row items-center bg-white rounded-full px-4 py-2 self-start"
                      >
                        <Text className="text-sm font-semibold text-gray-900 mr-1">
                          Read article
                        </Text>
                        <Text className="text-gray-900 text-sm">↗</Text>
                      </TouchableOpacity>

                      <View className="flex-row items-center gap-1.5">
                        {Array.from({ length: articleCount }).map((_, i) => (
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
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}