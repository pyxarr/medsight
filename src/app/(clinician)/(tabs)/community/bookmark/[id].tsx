import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/clinician/community/PostCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import { useOptimisticReactions } from "@/hooks/useOptimisticReactions"
import { getBookmarks } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";
import type { CommunityPost, FeedResponse } from "@/types/community";

/**
 * BookmarksScreen
 *
 * Displays the authenticated user's bookmarked community posts in an
 * infinite-scrolling list. Uses the same PostCard component as the main feed
 * so that bookmark toggle, likes, and navigation are consistent.
 *
 * The query key ["community", "bookmarks"] is invalidated by
 * useOptimisticReactions whenever the bookmark toggle fires from any screen,
 * keeping this list in sync without a manual refetch.
 */
export default function BookmarksScreen() {
  const { id: _userId } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuthStore();
  const token = session?.access_token;
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
    queryKey: ["community", "bookmarks"],
    queryFn: async ({ pageParam = 0 }) => {
      if (!token) throw new Error("User not authenticated");
      return await getBookmarks(20, pageParam, token);
    },
    getNextPageParam: (lastPage: FeedResponse, allPages: FeedResponse[]) => {
      const currentOffset = allPages.length * 20;
      return lastPage.results.length < 20 ? undefined : currentOffset;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const allBookmarks: CommunityPost[] =
    data?.pages.flatMap((page) => page.results ?? []).filter(Boolean) ?? [];

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1">
        {/* Header */}
        <View className="pt-6 pb-4">
          <Text className="text-3xl font-semibold text-center text-gray-900">
            Bookmarks
          </Text>
        </View>

        {/* Loading skeleton — matches the feed pattern */}
        {isLoading && (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <View className="flex-1 justify-center items-center px-10">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="text-center text-lg font-semibold text-gray-900 mt-4">
              Something went wrong
            </Text>
            <Text className="text-center text-gray-500 mt-2 mb-6">
              Your bookmarks could not be loaded. Please try again.
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              className="bg-blue-600 px-6 py-3 rounded-full"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bookmarks list */}
        {!isLoading && !isError && (
          <FlashList
            data={allBookmarks}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
            /* Empty state — consistent with the history screen pattern */
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-20">
                <Ionicons name="bookmark-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-400 mt-3 text-sm text-center px-8">
                  You haven&apos;t bookmarked any posts yet. Tap the bookmark icon on a post to save it here.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onLike={() =>
                  handleLike(
                    item.id,
                    item.reaction_counts.is_liked,
                    item.reaction_counts.like_count,
                    item.reaction_counts.is_bookmarked,
                    item.reaction_counts.bookmark_count,
                  )
                }
                onBookmark={() =>
                  handleBookmark(
                    item.id,
                    item.reaction_counts.is_bookmarked,
                    item.reaction_counts.bookmark_count,
                    item.reaction_counts.is_liked,
                    item.reaction_counts.like_count,
                  )
                }
                isLikedOverride={getIsLiked(
                  item.id,
                  item.reaction_counts.is_liked,
                )}
                isBookmarkedOverride={getIsBookmarked(
                  item.id,
                  item.reaction_counts.is_bookmarked,
                )}
                likeCountOverride={getLikeCount(
                  item.id,
                  item.reaction_counts.like_count,
                )}
              />
            )}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
                colors={["#2563EB"]}
              />
            }
          />
        )}
      </View>
    </ClinicianShell>
  );
}
