import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { CommunityHeader } from "@/components/clinician/community/CommunityHeader";
import { PostCard } from "@/components/clinician/community/PostCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import { useOptimisticReactions } from "@/hooks/useOptimisticReactions";
import { getFeed, getFollowingFeed } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";

export default function CommunityFeed() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const { session } = useAuthStore();
  const token = session?.access_token;

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    }, [queryClient])
  );

  const {
    handleLike,
    handleBookmark,
    getIsLiked,
    getIsBookmarked,
    getLikeCount,
  } = useOptimisticReactions({ token });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["community-feed", activeTab],
    queryFn: async ({ pageParam = 0 }) => {
      if (!token) throw new Error("User not authenticated");
      
      return activeTab === "foryou" 
        ? await getFeed(20, pageParam, token)
        : await getFollowingFeed(20, pageParam, token);
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * 20;
      return lastPage.results.length < 20 ? undefined : currentOffset;
    },
    initialPageParam: 0,
  });

  const allPosts = data?.pages.flatMap((page) => page.results ?? []).filter((post): post is NonNullable<typeof post> => post != null) ?? [];

  const handleRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <ClinicianShell showHeader={false}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-4 text-gray-500">Loading your feed...</Text>
        </View>
      </ClinicianShell>
    );
  }

  if (isError) {
    return (
      <ClinicianShell showHeader={false}>
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-center text-lg font-semibold text-gray-900 mt-4">
            Something went wrong
          </Text>
          <Text className="text-center text-gray-500 mt-2 mb-6">
            We couldn&apos;t load your community feed. Please try again.
          </Text>
          <TouchableOpacity 
            onPress={handleRefresh}
            className="bg-blue-600 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </ClinicianShell>
    );
  }

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <FlashList
        data={allPosts}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?.id ?? Math.random().toString()}
        renderItem={({ item }) => (
          <PostCard 
            post={item} 
            onLike={() => handleLike(item.id, item.reaction_counts.is_liked, item.reaction_counts.like_count, item.reaction_counts.is_bookmarked, item.reaction_counts.bookmark_count)}
            onBookmark={() => handleBookmark(item.id, item.reaction_counts.is_bookmarked, item.reaction_counts.bookmark_count, item.reaction_counts.is_liked, item.reaction_counts.like_count)}
            isLikedOverride={getIsLiked(item.id, item.reaction_counts.is_liked)}
            isBookmarkedOverride={getIsBookmarked(item.id, item.reaction_counts.is_bookmarked)}
            likeCountOverride={getLikeCount(item.id, item.reaction_counts.like_count)}
          />
        )}
        ListHeaderComponent={
          <>
            <CommunityHeader />
            <View className="px-5 pt-2 pb-4">
              <View className="flex-row items-center justify-center gap-6 border-b border-gray-100">
                <TouchableOpacity
                  onPress={() => setActiveTab("foryou")}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base pb-2 ${
                      activeTab === "foryou"
                        ? "font-semibold text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    For you
                  </Text>
                </TouchableOpacity>
                <Text className="text-gray-300 text-base pb-2">|</Text>
                <TouchableOpacity
                  onPress={() => setActiveTab("following")}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base pb-2 ${
                      activeTab === "following"
                        ? "font-semibold text-gray-900 border-b-2 border-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    Following
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator className="py-4" color="#2563EB" />
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl 
            refreshing={isRefetching} 
            onRefresh={handleRefresh} 
            colors={["#2563EB"]}
          />
        }
      />
      
      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/community/create")}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-600/30"
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </ClinicianShell>
  );
}
