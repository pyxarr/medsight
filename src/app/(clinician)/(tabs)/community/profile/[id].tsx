import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostCard } from "@/components/community/PostCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import { useOptimisticReactions } from "@/hooks/useOptimisticReactions";
import { useAuthStore } from "@/store/authStore";
import { getUserProfile, getUserReplies, followUserProfile, unfollowUserProfile, getFeed, deletePost } from "@/services/communityService";
import type { CommunityPost, FeedResponse, PublicUserProfileResponse } from "@/types/community";

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function CommunityProfile() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [activeTab, setActiveTab] = useState<"posts" | "replies">("posts");
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { session, user } = useAuthStore();
  const token = session?.access_token;
  const currentUserId = user?.id;

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

  const { data: profile, isLoading, isError, error } = useQuery<PublicUserProfileResponse>({
    queryKey: ["user-profile", id],
    queryFn: () => getUserProfile(id!, token),
    enabled: !!id && !!token,
  });

  const followMutation = useMutation({
    mutationFn: () => {
      if (!token || !profile) throw new Error("Missing token or profile");
      if (currentUserId === profile.id) return Promise.resolve();
      return profile.is_following ? unfollowUserProfile(profile.id, token) : followUserProfile(profile.id, token);
    },
    onMutate: async () => {
      if (!profile) return;
      await queryClient.cancelQueries({ queryKey: ["user-profile", id] });
      const previousProfile = queryClient.getQueryData<PublicUserProfileResponse>(["user-profile", id]);
      queryClient.setQueryData<PublicUserProfileResponse>(["user-profile", id], (old) => {
        if (!old) return old;
        return {
          ...old,
          is_following: !old.is_following,
          followers_count: old.is_following ? old.followers_count - 1 : old.followers_count + 1,
        };
      });
      return { previousProfile };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["user-profile", id], context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile", id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error("Unauthenticated");
      return await deletePost(postId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    },
  });

  const userPosts = useQuery<FeedResponse>({
    queryKey: ["user-posts", id],
    queryFn: () => {
      if (!id) throw new Error("Missing user id");
      return getFeed(50, 0, token);
    },
    enabled: !!id && !!token,
  });

  const userReplies = useQuery<FeedResponse>({
    queryKey: ["user-replies", id],
    queryFn: () => {
      if (!id) throw new Error("Missing user id");
      return getUserReplies(id, 20, 0, token);
    },
    enabled: !!id && !!token && activeTab === "replies",
  });

  if (isLoading) {
    return (
      <ClinicianShell showHeader={false} scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ClinicianShell>
    );
  }

  if (isError || !profile) {
    return (
      <ClinicianShell showHeader={false} scrollable={false}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500 mb-4">
            Failed to load profile: {error instanceof Error ? error.message : "Unknown error"}
          </Text>
          <TouchableOpacity
            onPress={() => queryClient.invalidateQueries({ queryKey: ["user-profile", id] })}
            className="px-6 py-3 bg-blue-600 rounded-xl"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </ClinicianShell>
    );
  }

  const isOwnProfile = currentUserId === profile.id;
  const showVerifiedBadge = profile.role === "clinician" && profile.is_verified;

  const detailRows = [
    { label: "Institution", value: profile.institution },
    { label: "Specialisation", value: profile.specialisation },
    { label: "Experience", value: profile.experience_years ? `${profile.experience_years} years` : null },
    { label: "Location", value: profile.location },
    { label: "Email", value: profile.email },
  ].filter((row) => row.value !== null);

  const filteredPosts: CommunityPost[] = userPosts.data?.results.filter((post) => post.author.id === profile.id) ?? [];
  const activePosts: CommunityPost[] = activeTab === "replies" ? (userReplies.data?.results ?? []) : filteredPosts;

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1">
        <View className="flex-1">
          <FlashList
            data={activePosts}
            ListHeaderComponent={
              <View className="px-5 pt-6 pb-4">
                {/* Profile Header Actions */}
                <View className="flex-row justify-end items-center gap-3 mb-6">
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chatbubble-outline" size={22} color="#374151" />
                  </TouchableOpacity>
                  {!isOwnProfile && (
                    <TouchableOpacity
                      onPress={() => followMutation.mutate()}
                      disabled={followMutation.isPending}
                      className={`px-6 py-2 rounded-full ${profile.is_following ? "bg-gray-100" : "bg-blue-600"}`}
                      activeOpacity={0.7}
                    >
                      <Text className={`font-semibold ${profile.is_following ? "text-gray-700" : "text-white"}`}>
                        {profile.is_following ? "Following" : "Follow"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Profile Image */}
                <View className="flex-row items-center gap-4 mb-4">
                  <View style={{ width: 96, height: 96, borderRadius: 999, overflow: "hidden", backgroundColor: "#E5E7EB" }}>
                    {profile.avatar_url ? (
                      <Image
                        source={{ uri: profile.avatar_url }}
                        style={{ width: 96, height: 96 }}
                        contentFit="cover"
                      />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <Text className="text-4xl font-bold text-gray-400">{getInitials(profile.display_name)}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* User Info */}
                <View className="mb-4">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-2xl font-bold text-gray-900">{profile.display_name}</Text>
                    {showVerifiedBadge && <Ionicons name="checkmark-circle" size={20} color="#2563EB" />}
                  </View>
                  <Text className="text-gray-500 text-base mb-3">@{profile.username}</Text>

                  {/* Stats */}
                  <View className="flex-row gap-6 mb-6">
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-lg font-bold text-gray-900">{profile.following_count}</Text>
                      <Text className="text-gray-500">Following</Text>
                    </View>
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-lg font-bold text-gray-900">{profile.followers_count}</Text>
                      <Text className="text-gray-500">Followers</Text>
                    </View>
                  </View>

                  {/* Details Grid */}
                  {detailRows.length > 0 && (
                    <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
                      <View className="flex-row flex-wrap justify-between gap-y-3">
                        {detailRows.map((row, index) => (
                          <View key={index} className="flex-row items-center gap-2 w-1/2">
                            <Ionicons
                              name={
                                row.label === "Institution"
                                  ? "business-outline"
                                : row.label === "Specialisation"
                                  ? "person-outline"
                                : row.label === "Experience"
                                  ? "time-outline"
                                : row.label === "Location"
                                  ? "location-outline"
                                  : "mail-outline"
                              }
                              size={16}
                              color="#6B7280"
                            />
                            <Text className="text-gray-600 text-sm" numberOfLines={1}>
                              {row.value}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* Tab Switcher */}
                <View className="flex-row items-center gap-6 border-b border-gray-100 mb-4">
                  <TouchableOpacity
                    onPress={() => setActiveTab("posts")}
                    className={`pb-3 ${activeTab === "posts" ? "border-b-2 border-blue-600" : ""}`}
                  >
                    <Text className={`text-base font-medium ${activeTab === "posts" ? "text-blue-600" : "text-gray-500"}`}>
                      Posts
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveTab("replies")}
                    className={`pb-3 ${activeTab === "replies" ? "border-b-2 border-blue-600" : ""}`}
                  >
                    <Text className={`text-base font-medium ${activeTab === "replies" ? "text-blue-600" : "text-gray-500"}`}>
                      Replies
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View className="px-5">
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
                  isLikedOverride={getIsLiked(item.id, item.reaction_counts.is_liked)}
                  isRepostedOverride={getIsReposted(item.id, item.reaction_counts.is_reposted)}
                  isBookmarkedOverride={getIsBookmarked(item.id, item.reaction_counts.is_bookmarked)}
                  likeCountOverride={getLikeCount(item.id, item.reaction_counts.like_count)}
                  repostCountOverride={getRepostCount(item.id, item.reaction_counts.repost_count)}
                  bookmarkCountOverride={getBookmarkCount(item.id, item.reaction_counts.bookmark_count)}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
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
    </ClinicianShell>
  );
}
