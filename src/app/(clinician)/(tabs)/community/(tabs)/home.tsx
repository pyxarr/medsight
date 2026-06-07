import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommunityHeader } from "@/components/clinician/community/CommunityHeader";
import { PostCard } from "@/components/clinician/community/PostCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import { useCommunityRealtime } from "@/hooks/useCommunityRealtime";
import { useOptimisticReactions } from "@/hooks/useOptimisticReactions";
import { getFeed, getFollowingFeed, deletePost } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import type { CommunityPost } from "@/types/community";

export default function CommunityFeed() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const { session } = useAuthStore();
  const token = session?.access_token;
  const { setIsInCommunity } = useUIStore();
  const hasMountedRef = useRef(false);
  const flashListRef = useRef<FlashListRef<CommunityPost>>(null);

  useCommunityRealtime(() => {
    if (activeTab === "foryou") {
      flashListRef.current?.scrollToIndex({ index: 0, animated: true });
    }
  });

  useFocusEffect(
    useCallback(() => {
      setIsInCommunity(true);
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      }

      return () => {
        setTimeout(() => setIsInCommunity(false), 300);
      };
    }, [queryClient, setIsInCommunity])
  );

  const {
    handleLike,
    handleBookmark,
    handleRepost,
    getIsLiked,
    getIsBookmarked,
    getIsReposted,
    getLikeCount,
    getBookmarkCount,
    getRepostCount,
  } = useOptimisticReactions({ token });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error("Unauthenticated");
      return await deletePost(postId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    },
  });

  const handleDelete = (postId: string) => {
    setDeletingPostId(postId);
  };

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
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    initialPageParam: 0,
  });

  const allPosts =
    data?.pages
      .flatMap((page) => page.results ?? [])
      .filter(
        (post): post is NonNullable<typeof post> => post != null
      ) ?? [];

  const handleRefresh = async () => {
    await refetch();
  };

  function handleProfilePress() {
    setIsMenuOpen(false);
    const userId = session?.user?.id ?? "1";
    router.push(`/(clinician)/(tabs)/community/profile/${userId}` as any);
  }

  function handleAccountSettingsPress() {
    setIsMenuOpen(false);
    router.push("/(clinician)/(tabs)/profile");
  }

  function handleBookmarkPress() {
    setIsMenuOpen(false);
    const userId = session?.user?.id ?? "1";
    router.push(`/(clinician)/(tabs)/community/bookmark/${userId}` as any);
  }

  function handleExitCommunityPress() {
    setIsMenuOpen(false);
    router.replace("/(clinician)/(tabs)");
  }

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
        ref={flashListRef}
        data={allPosts}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?.id ?? Math.random().toString()}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() =>
              handleLike(
                item.id,
                item.reaction_counts.is_liked,
                item.reaction_counts.like_count,
                item.reaction_counts.is_reposted,
                item.reaction_counts.repost_count,
                item.reaction_counts.is_bookmarked,
                item.reaction_counts.bookmark_count
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
                item.reaction_counts.bookmark_count
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
                item.reaction_counts.repost_count
              )
            }
            onDelete={() => handleDelete(item.id)}
            isAuthor={session?.user?.id === item.author.id}
            isLikedOverride={getIsLiked(
              item.id,
              item.reaction_counts.is_liked
            )}
            isRepostedOverride={getIsReposted(
              item.id,
              item.reaction_counts.is_reposted
            )}
            isBookmarkedOverride={getIsBookmarked(
              item.id,
              item.reaction_counts.is_bookmarked
            )}
            likeCountOverride={getLikeCount(
              item.id,
              item.reaction_counts.like_count
            )}
            repostCountOverride={getRepostCount(
              item.id,
              item.reaction_counts.repost_count
            )}
            bookmarkCountOverride={getBookmarkCount(
              item.id,
              item.reaction_counts.bookmark_count
            )}
          />
        )}
        ListHeaderComponent={
          <>
            {/*
              onAvatarPress bubbles up to the screen — the dropdown
              itself is rendered outside FlashList so z-index works.
            */}
            <CommunityHeader onAvatarPress={() => setIsMenuOpen((prev) => !prev)} />
            <View className="px-5 pt-2 pb-4">
              <View className="flex-row items-center justify-center gap-6 border-b border-gray-100">
                <TouchableOpacity
                  onPress={() => setActiveTab("foryou")}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-base pb-2 ${activeTab === "foryou"
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
                    className={`text-base pb-2 ${activeTab === "following"
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
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={["#2563EB"]}
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push("/community/create")}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-600/30"
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/*
        Dropdown lives here — sibling to FlashList, not inside it.
        Absolute positioning is relative to ClinicianShell's root View,
        so it paints on top of every list card.
      */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <Pressable
            className="absolute inset-0"
            onPress={() => setIsMenuOpen(false)}
          />

          {/* Menu card — positioned to sit just below the avatar */}
          <View
            className="absolute top-16 left-4 bg-white rounded-xl border border-gray-100 py-2 w-48"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 16,
            }}
          >
            <TouchableOpacity
              onPress={handleProfilePress}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 px-4 py-3"
            >
              <Ionicons
                name="person-circle-outline"
                size={22}
                color="#374151"
              />
              <Text className="text-sm font-medium text-gray-700">
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAccountSettingsPress}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 px-4 py-3"
            >
              <Ionicons name="settings-outline" size={22} color="#374151" />
              <Text className="text-sm font-medium text-gray-700">
                Account settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBookmarkPress}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 px-4 py-3"
            >
              <Ionicons name="bookmark-outline" size={22} color="#374151" />
              <Text className="text-sm font-medium text-gray-700">
                Bookmarks
              </Text>
            </TouchableOpacity>

            <View className="h-px bg-gray-100 mx-4 my-1" />

            <TouchableOpacity
              onPress={handleExitCommunityPress}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 px-4 py-3"
            >
              <Ionicons name="exit-outline" size={22} color="#EF4444" />
              <Text className="text-sm font-medium text-red-500">
                Exit community
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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
    </ClinicianShell>
  );
}