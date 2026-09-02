import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HomeHeader } from "@/components/member/HomeHeader";
import { MemberDrawer } from "@/components/member/MemberDrawer";
import { MemberShell } from "@/components/MemberShell";
import {
  ARTICLES,
  BOOKS,
  VIDEOS,
  AWARENESS_POSTS,
  MYTH_FACTS,
  FAQS,
} from "@/features/explore";

type ResultType = "Article" | "Book" | "Video" | "Awareness" | "Myth" | "FAQ";

type SearchResult = {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  url?: string;
  route?: string;
  imageUrl?: string;
};

const openUrl = (url?: string) => {
  if (!url) return;
  Linking.openURL(url).catch(() => {});
};

function buildResults(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  ARTICLES.forEach((article) => {
    const haystack = [article.source, article.title, article.excerpt, article.author, article.date]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (haystack.includes(q)) {
      results.push({
        id: article.id,
        type: "Article",
        title: article.title,
        subtitle: article.source,
        url: article.url,
        imageUrl: article.coverImageUrl,
      });
    }
  });

  BOOKS.forEach((book) => {
    const haystack = [book.title, book.author].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: book.id,
        type: "Book",
        title: book.title,
        subtitle: book.author,
        url: book.url,
        imageUrl: book.coverImageUrl,
      });
    }
  });

  VIDEOS.forEach((video) => {
    const haystack = [video.source, video.title, video.excerpt].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: video.id,
        type: "Video",
        title: video.title,
        subtitle: video.source,
        url: video.url,
        imageUrl: video.thumbnailUrl,
      });
    }
  });

  AWARENESS_POSTS.forEach((post) => {
    const haystack = [post.tag, post.title, post.body].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: post.id,
        type: "Awareness",
        title: post.title,
        subtitle: post.tag,
        url: post.url,
        imageUrl: post.coverImageUrl,
      });
    }
  });

  MYTH_FACTS.forEach((item) => {
    const haystack = [item.myth, item.fact].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: item.id,
        type: "Myth",
        title: item.myth,
        subtitle: item.fact,
        route: "/(member)/explore/myth-vs-facts",
      });
    }
  });

  FAQS.forEach((item) => {
    const haystack = [item.question, item.answer].join(" ").toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: item.id,
        type: "FAQ",
        title: item.question,
        subtitle: item.answer,
        route: "/(member)/explore/faqs",
      });
    }
  });

  return results;
}

function ResultCard({ item }: { item: SearchResult }) {
  const isLink = !!item.url;

  return (
    <Pressable
      onPress={() => (item.url ? openUrl(item.url) : item.route ? router.push(item.route as any) : undefined)}
      className="flex-row gap-3 px-5 py-3 mb-2"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={{ width: 64, height: 64, borderRadius: 14 }} contentFit="cover" />
      ) : (
        <View className="w-16 h-16 rounded-2xl bg-pink-50 items-center justify-center">
          <Ionicons name={isLink ? "open-outline" : "help-circle-outline"} size={24} color="#DB2777" />
        </View>
      )}

      <View className="flex-1 min-w-0">
        <Text className="text-[11px] font-semibold uppercase tracking-wider text-[#DB2777] mb-1">
          {item.type}
        </Text>
        <Text className="text-base font-bold text-gray-900 mb-1" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-sm text-gray-600" numberOfLines={2}>
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

export default function SearchScreen() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => buildResults(query), [query]);

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} />

        <View className="px-5 pb-3">
          <View className="flex-row items-center bg-white rounded-full px-4 py-3 border border-gray-200">
            <Ionicons name="search" size={16} color="#DB2777" />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Search articles, books, videos..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-2 text-sm text-gray-900"
              returnKeyType="search"
            />
            {!!query && (
              <Pressable onPress={() => setQuery("")} className="pl-2 py-1">
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {!query.trim() ? (
            <View className="px-5 pt-8">
              <Text className="text-lg font-bold text-gray-900 mb-2">Search across Explore</Text>
              <Text className="text-sm text-gray-600 leading-5">
                Find articles, books, videos, awareness posts, FAQs, and myth-busters in one place.
              </Text>
            </View>
          ) : results.length > 0 ? (
            <View className="pt-2">
              <Text className="px-5 mb-3 text-sm text-gray-500">
                {results.length} result{results.length === 1 ? "" : "s"}
              </Text>
              {results.map((item) => (
                <ResultCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </View>
          ) : (
            <View className="px-5 pt-8 items-center">
              <Ionicons name="search-outline" size={28} color="#D1D5DB" />
              <Text className="mt-3 text-gray-500 text-center">No matches found.</Text>
            </View>
          )}
        </ScrollView>
      </MemberShell>

      <MemberDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
}
