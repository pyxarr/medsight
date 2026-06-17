import { useState } from "react";
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
import { CommunitySearchBar } from "@/components/community/CommunitySearchBar";
import { MemberShell } from "@/components/MemberShell";
import { searchCommunity } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";
import type { AuthorInfo, CommunityPost } from "@/types/community";

const RECENT_SEARCHES = ["@tnsal", "@mary014", "@its ola", "@tnsal"];

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

  const { data, isLoading } = useQuery({
    queryKey: ["community-search", debouncedQuery],
    queryFn: () => searchCommunity(debouncedQuery, 20, token),
    enabled: debouncedQuery.trim().length >= 1,
  });

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
    <MemberShell showHeader={false} scrollable={false}>
      <View className="flex-1 pt-4">
        <CommunitySearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
        />

        {query.trim() === "" && (
          <View className="flex-1 px-5 mt-2">
            <Text className="text-sm font-semibold text-gray-900 mb-3">
              Recent Searches
            </Text>
            <FlatList
              data={RECENT_SEARCHES}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-2.5 border-b border-gray-100"
                  activeOpacity={0.7}
                  onPress={() => setQuery(item)}
                >
                  <Text className="text-sm text-gray-600">{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
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
                        `/(member)/(tabs)/community/profile/${user.id}` as any,
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
                        `/(member)/(tabs)/community/post/${post.id}` as any,
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
    </MemberShell>
  );
}
