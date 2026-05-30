import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { CommunityPost } from "@/types/community";

interface PostCardProps {
  post: CommunityPost;
  onLike?: () => void;
  onBookmark?: () => void;
  isLikedOverride?: boolean;
  isBookmarkedOverride?: boolean;
  likeCountOverride?: number;
}

export function PostCard({
  post,
  onLike,
  onBookmark,
  isLikedOverride,
  isBookmarkedOverride,
  likeCountOverride,
}: PostCardProps) {
  const router = useRouter();

  const isLiked = isLikedOverride ?? post.reaction_counts.is_liked;
  const isBookmarked = isBookmarkedOverride ?? post.reaction_counts.is_bookmarked;
  const likeCount = likeCountOverride ?? post.reaction_counts.like_count;

  const handlePress = () => {
    router.push(`/community/post/${post.id}`);
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-lg border border-gray-200 p-2 mb-3"
      activeOpacity={0.95}
      onPress={handlePress}
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3 flex-1">
          {/* Avatar */}
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
          {/* Name + Handle */}
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
      </View>

      {/* Content text */}
      <Text className="text-sm text-gray-800 leading-5 mb-3">{post.content}</Text>

      {/* Optional image */}
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

      {/* Action bar */}
      <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
        {/* Like */}
        <TouchableOpacity
          className="flex-row items-center gap-1.5"
          activeOpacity={0.7}
          onPress={() => onLike?.()}
        >
          <Ionicons
            name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
            size={18}
            color={isLiked ? "#2563EB" : "#6B7280"}
          />
          <Text className={`text-sm ${isLiked ? "text-blue-600" : "text-gray-500"}`}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
          <Text className="text-sm text-gray-500">{post.reaction_counts.reply_count}</Text>
        </TouchableOpacity>

        {/* Repost */}
        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7}>
          <Ionicons name="repeat-outline" size={18} color="#6B7280" />
          <Text className="text-sm text-gray-500">{post.reaction_counts.repost_count}</Text>
        </TouchableOpacity>

        {/* Views */}
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="eye-outline" size={18} color="#6B7280" />
          <Text className="text-sm text-gray-500">{post.view_count}</Text>
        </View>

        {/* Bookmark */}
        <TouchableOpacity activeOpacity={0.7} onPress={() => onBookmark?.()}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={18}
            color={isBookmarked ? "#2563EB" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Timestamp */}
      <Text className="text-xs text-gray-400 mt-2">
        {new Date(post.created_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
}
