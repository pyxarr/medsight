import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Modal } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCard } from "@/components/community/PostCard";
import { MemberShell } from "@/components/MemberShell";
import { useOptimisticReactions } from "@/hooks/useOptimisticReactions"
import { getBookmarks, deletePost } from "@/services/communityService";
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
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const token = session?.access_token;
  const {
    handleLike,
    handleBookmark,
    handleRepost,
    getIsLiked,
    getIsReposted,
    getIsBookmarked,
    getLikeCount,
    getRepostCount,
    getBookmarkCount,
  } = useOptimisticReactions({ token });

  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error("Unauthenticated");
      return await deletePost(postId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", "bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    },
  });

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
    <MemberShell showHeader={false} scrollable={false}>
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
                role="member"
                onLike={() =>
                  handleLike(
                    item.id,
                    item.reaction_counts.is_liked,
                    item.reaction_counts.like_count,
                    item.reaction_counts.is_reposted,
                    item.reaction_counts.repost_count,
                    item.reaction_counts.is_bookmarked,
                    item.reaction_counts.bookmark_count,
                  )
                }
                onRepost={() =>
                  handleRepost(
                    item.id,
                    item.reaction_counts.is_reposted,
                    item.reaction_counts.repost_count,
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
                    item.reaction_counts.is_reposted,
                    item.reaction_counts.repost_count,
                  )
                }
                onDelete={() => setDeletingPostId(item.id)}
                isAuthor={session?.user?.id === item.author.id}
                isLikedOverride={getIsLiked(
                  item.id,
                  item.reaction_counts.is_liked,
                )}
                isRepostedOverride={getIsReposted(
                  item.id,
                  item.reaction_counts.is_reposted,
                )}
                isBookmarkedOverride={getIsBookmarked(
                  item.id,
                  item.reaction_counts.is_bookmarked,
                )}
                likeCountOverride={getLikeCount(
                  item.id,
                  item.reaction_counts.like_count,
                )}
                repostCountOverride={getRepostCount(
                  item.id,
                  item.reaction_counts.repost_count,
                )}
                bookmarkCountOverride={getBookmarkCount(
                  item.id,
                  item.reaction_counts.bookmark_count,
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

      {/* Delete confirmation modal */}
      <Modal
        visible={deletingPostId !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setDeletingPostId(null)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-8">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete post
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setDeletingPostId(null)}
                className="flex-1 rounded-xl border border-gray-300 py-3.5 items-center"
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (deletingPostId) deleteMutation.mutate(deletingPostId);
                  setDeletingPostId(null);
                }}
                className="flex-1 rounded-xl bg-red-500 py-3.5 items-center"
              >
                <Text className="font-semibold text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </MemberShell>
  );
}
