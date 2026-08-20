import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { CommunityPost } from "@/types/community";

interface CommentItemProps {
  post: CommunityPost;
  onLike?: () => void;
  onRepost?: () => void;
  onBookmark?: () => void;
  isLikedOverride?: boolean;
  isRepostedOverride?: boolean;
  isBookmarkedOverride?: boolean;
  likeCountOverride?: number;
  repostCountOverride?: number;
  bookmarkCountOverride?: number;
  role?: "member" | "clinician";
}

const ACCENT: Record<"member" | "clinician", string> = {
  member: "#DB2777",
  clinician: "#2563EB",
};

export function CommentItem({
  post,
  onLike,
  onRepost,
  onBookmark,
  isLikedOverride,
  isRepostedOverride,
  isBookmarkedOverride,
  likeCountOverride,
  repostCountOverride,
  role = "clinician",
}: CommentItemProps) {
  const accentColor = ACCENT[role];
  const isLiked = isLikedOverride ?? post.reaction_counts.is_liked;
  const isReposted = isRepostedOverride ?? post.reaction_counts.is_reposted;
  const isBookmarked = isBookmarkedOverride ?? post.reaction_counts.is_bookmarked;
  const likeCount = likeCountOverride ?? post.reaction_counts.like_count;
  const repostCount = repostCountOverride ?? post.reaction_counts.repost_count;

  return (
    <View className="px-5 py-3 border-b border-gray-100">
      <View className="flex-row items-center gap-3 mb-2">
        {post.author.avatar_url ? (
          <Image
            source={{ uri: post.author.avatar_url }}
            style={{ width: 32, height: 32, borderRadius: 999 }}
            contentFit="cover"
          />
        ) : (
          <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
            <Ionicons name="person" size={16} color="#6B7280" />
          </View>
        )}
         <View className="flex-row items-center gap-1.5 flex-1">
           <View className="flex-row items-center gap-1">
             <Text className="text-sm font-semibold text-gray-900">{post.author.display_name}</Text>
             {post.author.role === "clinician" && post.author.is_verified && (
               <Ionicons name="checkmark-circle" size={14} color="#2563EB" />
             )}
           </View>
           <Text className="text-xs text-gray-400">
             {new Date(post.created_at).toLocaleDateString()}
           </Text>
         </View>
      </View>

      <Text className="text-sm text-gray-700 mb-3">{post.content}</Text>

      {!!post.media_url?.trim() && (
        <View className="w-full h-40 rounded-xl mb-3 overflow-hidden">
          <Image
            source={{ uri: post.media_url }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            onError={(e) => console.error("Failed to load reply media:", post.media_url, e)}
          />
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7} onPress={() => onLike?.()}>
          <Ionicons 
            name={isLiked ? "thumbs-up" : "thumbs-up-outline"} 
            size={16} 
            color={isLiked ? accentColor : "#6B7280"} 
          />
          <Text className="text-xs" style={{ color: isLiked ? accentColor : "#6B7280" }}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
          <Text className="text-xs text-gray-500">{post.reaction_counts.reply_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7} onPress={() => onRepost?.()}>
          <Ionicons
            name="repeat-outline"
            size={16}
            color={isReposted ? accentColor : "#6B7280"}
          />
          <Text className="text-xs" style={{ color: isReposted ? accentColor : "#6B7280" }}>
            {repostCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => onBookmark?.()}>
          <Ionicons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={16} 
            color={isBookmarked ? accentColor : "#6B7280"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
