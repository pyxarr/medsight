import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { ClinicianShell } from "@/components/ClinicianShell";
import { CommunitySearchBar } from "@/components/community/CommunitySearchBar";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { searchCommunity } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";
import type { AuthorInfo, CommunityPost } from "@/types/community";

type ListItem =
  | { type: "header"; label: string }
  | { type: "user"; data: AuthorInfo }
  | { type: "post"; data: CommunityPost };

export default function CommunitySearch() {
  const router = useRouter();
  const { session } = useAuthStore();
  const token = session?.access_token;
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 400);
  const {
    recentSearches,
    isLoaded: isRecentSearchesLoaded,
    addSearch,
    removeSearch,
    clearSearches,
  } = useRecentSearches();
  const normalizedQuery = debouncedQuery.trim();
  const lastSavedQueryRef = useRef<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["community-search", normalizedQuery],
    queryFn: () => searchCommunity(normalizedQuery, 20, token),
    enabled: normalizedQuery.length >= 1,
  });

  useEffect(() => {
    if (normalizedQuery.length < 1) {
      lastSavedQueryRef.current = null;
      return;
    }

    if (!data || lastSavedQueryRef.current === normalizedQuery) return;

    lastSavedQueryRef.current = normalizedQuery;
    void addSearch(normalizedQuery);
  }, [addSearch, data, normalizedQuery]);

  const listItems: ListItem[] = [
    ...(data && data.users.length > 0
      ? [{ type: "header" as const, label: "People" }]
      : []),
    ...(data?.users.map((u) => ({ type: "user" as const, data: u })) ?? []),
    ...(data && data.posts.length > 0
      ? [{ type: "header" as const, label: "Posts" }]
      : []),
    ...(data?.posts.map((p) => ({ type: "post" as const, data: p })) ?? []),
  ];

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1 pt-4">
        <CommunitySearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
        />

        {query.trim() === "" && (
          <View className="flex-1 px-5 mt-2">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold text-gray-900">
                Recent Searches
              </Text>
              {recentSearches.length > 0 && (
                <TouchableOpacity onPress={() => void clearSearches()} activeOpacity={0.7}>
                  <Text className="text-xs font-medium text-gray-500">Clear all</Text>
                </TouchableOpacity>
              )}
            </View>

            {!isRecentSearchesLoaded ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : recentSearches.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <View
                    key={item}
                    className="flex-row items-center rounded-full border border-gray-200 bg-white px-3 py-2"
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setQuery(item)}
                    >
                      <Text className="text-sm text-gray-700">{item}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="ml-2"
                      activeOpacity={0.7}
                      onPress={() => void removeSearch(item)}
                    >
                      <Ionicons name="close-circle" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center justify-center py-10">
                <Ionicons name="search-outline" size={40} color="#D1D5DB" />
                <Text className="mt-3 text-sm text-gray-400">No recent searches</Text>
              </View>
            )}
          </View>
        )}

        {query.trim().length >= 1 && isLoading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}

        {query.trim().length >= 1 && !isLoading && data && (
          <FlatList
            data={listItems}
            keyExtractor={(item, index) => `${item.type}-${index}`}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-20">
                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-400 mt-3 text-sm">
                  No results for &ldquo;{debouncedQuery}&rdquo;
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              if (item.type === "header") {
                return (
                  <View className="px-5 pt-4 pb-2">
                    <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </Text>
                  </View>
                );
              }

              if (item.type === "user") {
                const user = item.data;
                return (
                  <TouchableOpacity
                    className="flex-row items-center px-5 py-3 border-b border-gray-100"
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push(
                        `/(clinician)/(tabs)/community/profile/${user.id}` as any,
                      )
                    }
                  >
                    {user.avatar_url ? (
                      <Image
                        source={{ uri: user.avatar_url }}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-3">
                        <Ionicons name="person" size={20} color="#6B7280" />
                      </View>
                    )}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-1">
                        <Text className="text-sm font-semibold text-gray-900">
                          {user.display_name}
                        </Text>
                        {user.role === "clinician" && (
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#2563EB"
                          />
                        )}
                      </View>
                      <Text className="text-xs text-gray-400">
                        @{user.username}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }

              if (item.type === "post") {
                const post = item.data;
                return (
                  <TouchableOpacity
                    className="px-5 py-3 border-b border-gray-100"
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push(
                        `/(clinician)/(tabs)/community/post/${post.id}` as any,
                      )
                    }
                  >
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-sm font-semibold text-gray-900">
                        {post.author.display_name}
                      </Text>
                      {post.author.role === "clinician" && (
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color="#2563EB"
                        />
                      )}
                    </View>
                    <Text className="text-sm text-gray-600" numberOfLines={2}>
                      {post.content}
                    </Text>
                  </TouchableOpacity>
                );
              }

              return null;
            }}
          />
        )}
      </View>
    </ClinicianShell>
  );
}
