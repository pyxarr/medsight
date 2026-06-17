import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { CommunityPost } from "@/types/community";

interface PostCardProps {
  post: CommunityPost;
  onLike?: () => void;
  onRepost?: () => void;
  onBookmark?: () => void;
  onDelete?: () => void;
  isLikedOverride?: boolean;
  isRepostedOverride?: boolean;
  isBookmarkedOverride?: boolean;
  likeCountOverride?: number;
  repostCountOverride?: number;
  bookmarkCountOverride?: number;
  isAuthor?: boolean;
  role?: "member" | "clinician";
}

const ACCENT: Record<"member" | "clinician", string> = {
  member: "#DB2777",
  clinician: "#2563EB",
};

export function PostCard({
  post,
  onLike,
  onRepost,
  onBookmark,
  onDelete,
  isLikedOverride,
  isRepostedOverride,
  isBookmarkedOverride,
  likeCountOverride,
  repostCountOverride,
  bookmarkCountOverride,
  isAuthor,
  role = "clinician",
}: PostCardProps) {
  const accentColor = ACCENT[role];
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = isLikedOverride ?? post.reaction_counts.is_liked;
  const isReposted = isRepostedOverride ?? post.reaction_counts.is_reposted;
  const isBookmarked = isBookmarkedOverride ?? post.reaction_counts.is_bookmarked;
  const likeCount = likeCountOverride ?? post.reaction_counts.like_count;
  const repostCount = repostCountOverride ?? post.reaction_counts.repost_count;

  const handlePress = () => {
    router.push(`/community/post/${post.id}` as any);
  };

  const handleDeletePress = () => {
    setShowMenu(false);
    onDelete?.();
  };

  return (
    <View className="relative mb-3">
      <TouchableOpacity
        className="bg-white rounded-lg border border-gray-200 p-2"
        activeOpacity={0.95}
        onPress={handlePress}
      >
        {/* Header row */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3 flex-1">
            {post.author.avatar_url ? (
              <Image
                source={{ uri: post.author.avatar_url }}
                className="w-10 h-10 rounded-full"
                contentFit="cover"
              />
            ) : (
              <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                <Ionicons name="person" size={20} color="#6B7280" />
              </View>
            )}
             <View className="flex-row items-center gap-1 flex-1">
               <Text className="text-sm font-semibold text-gray-900">
                 {post.author.display_name}
               </Text>
               {post.author.role === "clinician" && (
                 <Ionicons name="checkmark-circle" size={14} color="#2563EB" />
               )}
               <Text className="text-gray-400 font-normal text-sm"> @{post.author.username}</Text>
             </View>
          </View>
          {isAuthor && onDelete && (
            <TouchableOpacity
              onPress={() => setShowMenu((prev) => !prev)}
              className="p-1 -mr-1"
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-sm text-gray-800 leading-5 mb-3">{post.content}</Text>

        {!!post.media_url?.trim() && (
          <View className="w-full h-48 rounded-xl mb-3 overflow-hidden">
            <Image
              source={{ uri: post.media_url }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
              onError={(e) => console.error("Failed to load media:", post.media_url, e)}
            />
          </View>
        )}

        <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
          <TouchableOpacity
            className="flex-row items-center gap-1.5"
            activeOpacity={0.7}
            onPress={() => onLike?.()}
          >
            <Ionicons
              name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
              size={18}
              color={isLiked ? accentColor : "#6B7280"}
            />
            <Text className="text-sm" style={{ color: isLiked ? accentColor : "#6B7280" }}>
              {likeCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
            <Text className="text-sm text-gray-500">{post.reaction_counts.reply_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7} onPress={() => onRepost?.()}>
            <Ionicons
              name="repeat-outline"
              size={18}
              color={isReposted ? accentColor : "#6B7280"}
            />
            <Text className="text-sm" style={{ color: isReposted ? accentColor : "#6B7280" }}>
              {repostCount}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-1.5">
            <Ionicons name="eye-outline" size={18} color="#6B7280" />
            <Text className="text-sm text-gray-500">{post.view_count}</Text>
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={() => onBookmark?.()}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isBookmarked ? accentColor : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-gray-400 mt-2">
          {new Date(post.created_at).toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showMenu && (
        <>
          <Pressable
            className="absolute inset-0 z-50"
            onPress={() => setShowMenu(false)}
          />
          <View
            className="absolute top-12 right-2 z-50 bg-white rounded-xl border border-gray-100 py-2 w-48"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 16,
            }}
          >
            <TouchableOpacity
              onPress={handleDeletePress}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 px-4 py-3"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text className="text-sm font-medium text-red-500">
                Delete post
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
