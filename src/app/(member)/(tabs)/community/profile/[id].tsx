import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { PostCard } from "@/components/community/PostCard";
import { MemberShell } from "@/components/MemberShell";
import { useOptimisticReactions } from "@/hooks/useOptimisticReactions";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/services/communityService";
import type { CommunityPost } from "@/types/community";

const MOCK_USER = {
  id: "1",
  display_name: "Dr. Micheal scofield",
  username: "Micheal_234",
  avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
  bio: "Dedicated to supporting informed breast health care through compassion and clinical expertise.",
  location: "Nigeria",
  experience: "5+yrs",
  specialization: "Oncologist",
  email: "micheal87scofield@gmail.com",
  following_count: 200,
  followers_count: 500,
  role: "clinician",
  is_verified: true,
  is_following: false,
};

const MOCK_POSTS: CommunityPost[] = [
  {
    id: "p1",
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
    created_at: new Date().toISOString(),
    media_url: "",
    view_count: 100,
    author: {
      id: "1",
      display_name: "micheal scofield",
      username: "Micheal_234",
      avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
      role: "Clinician",
      is_verified: true,
    },
    reaction_counts: {
      like_count: 29,
      reply_count: 2,
      repost_count: 10,
      bookmark_count: 5,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: false,
    },
  },
  {
    id: "p2",
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
    created_at: new Date().toISOString(),
    media_url: "",
    view_count: 100,
    author: {
      id: "1",
      display_name: "micheal scofield",
      username: "Micheal_234",
      avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
      role: "Clinician",
      is_verified: true,
    },
    reaction_counts: {
      like_count: 29,
      reply_count: 2,
      repost_count: 10,
      bookmark_count: 5,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: false,
    },
  },
  {
    id: "p3",
    content: "Another thought on breast cancer awareness. Early detection saves lives!",
    created_at: new Date().toISOString(),
    media_url: "",
    view_count: 150,
    author: {
      id: "1",
      display_name: "micheal scofield",
      username: "Micheal_234",
      avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
      role: "Clinician",
      is_verified: true,
    },
    reaction_counts: {
      like_count: 45,
      reply_count: 8,
      repost_count: 12,
      bookmark_count: 10,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: false,
    },
  },
];

export default function CommunityProfile() {
  const [activeTab, setActiveTab] = useState<"posts" | "replies">("posts");
  const [isFollowing, setIsFollowing] = useState(MOCK_USER.is_following);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
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

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error("Unauthenticated");
      return await deletePost(postId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    },
  });

  return (
    <MemberShell showHeader={false} scrollable={false}>
      <View className="flex-1">
        <View className="flex-1">
          <FlashList
            data={MOCK_POSTS}
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
                  <TouchableOpacity 
                    onPress={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-2 rounded-full ${isFollowing ? "bg-gray-100" : "bg-blue-600"}`}
                    activeOpacity={0.7}
                  >
                    <Text className={`font-semibold ${isFollowing ? "text-gray-700" : "text-white"}`}>
                      {isFollowing ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Profile Image */}
                <View className="flex-row items-center gap-4 mb-4">
                  <Image
                    source={{ uri: MOCK_USER.avatar_url }}
                    style={{ width: 96, height: 96, borderRadius: 999 }}
                    contentFit="cover"
                  />
                </View>

                {/* User Info */}
                <View className="mb-4">
                  <View className="flex-row items-center gap-1">
                    <Text className="text-2xl font-bold text-gray-900">{MOCK_USER.display_name}</Text>
                    {MOCK_USER.role === "clinician" && MOCK_USER.is_verified && (
                      <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
                    )}
                  </View>
                  <Text className="text-gray-500 text-base mb-3">@{MOCK_USER.username}</Text>
                  <Text className="text-gray-700 text-base leading-6 mb-4">
                    {MOCK_USER.bio}
                  </Text>

                  {/* Stats */}
                  <View className="flex-row gap-6 mb-6">
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-lg font-bold text-gray-900">{MOCK_USER.following_count}</Text>
                      <Text className="text-gray-500">Following</Text>
                    </View>
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-lg font-bold text-gray-900">{MOCK_USER.followers_count}</Text>
                      <Text className="text-gray-500">Followers</Text>
                    </View>
                  </View>

                  {/* Details Grid */}
                  <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
                    <View className="flex-row flex-wrap justify-between gap-y-3">
                      <View className="flex-row items-center gap-2 w-1/2">
                        <Ionicons name="location-outline" size={16} color="#6B7280" />
                        <Text className="text-gray-600 text-sm">{MOCK_USER.location}</Text>
                      </View>
                      <View className="flex-row items-center gap-2 w-1/2">
                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                        <Text className="text-gray-600 text-sm">{MOCK_USER.experience}</Text>
                      </View>
                      <View className="flex-row items-center gap-2 w-1/2 mt-2">
                        <Ionicons name="person-outline" size={16} color="#6B7280" />
                        <Text className="text-gray-600 text-sm">{MOCK_USER.specialization}</Text>
                      </View>
                      <View className="flex-row items-center gap-2 w-1/2 mt-2">
                        <Ionicons name="mail-outline" size={16} color="#6B7280" />
                        <Text className="text-gray-600 text-sm" numberOfLines={1}>{MOCK_USER.email}</Text>
                      </View>
                    </View>
                  </View>
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
                  isLikedOverride={getIsLiked(item.id, item.reaction_counts.is_liked)}
                  isRepostedOverride={getIsReposted(item.id, item.reaction_counts.is_reposted)}
                  isBookmarkedOverride={getIsBookmarked(item.id, item.reaction_counts.is_bookmarked)}
                  likeCountOverride={getLikeCount(item.id, item.reaction_counts.like_count)}
                  repostCountOverride={getRepostCount(item.id, item.reaction_counts.repost_count)}
                  bookmarkCountOverride={getBookmarkCount(item.id, item.reaction_counts.bookmark_count)}
                />
              </View>
            )}
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
    </MemberShell>
  );
}
