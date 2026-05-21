import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface PostCardProps {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  reposts: number;
  riskScore?: number;
  timestamp?: string;
}

export function PostCard({
  id,
  author,
  content,
  imageUrl,
  likes: initialLikes,
  comments,
  reposts,
  riskScore,
  timestamp,
}: PostCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setBookmarked((prev) => !prev);
  };

  const handlePress = () => {
    router.push(`/community/post/${id}`);
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl border border-gray-200 p-4 mb-3"
      activeOpacity={0.95}
      onPress={handlePress}
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3 flex-1">
          {/* Avatar */}
          {author.avatarUrl ? (
            <Image
              source={{ uri: author.avatarUrl }}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
              <Ionicons name="person" size={20} color="#6B7280" />
            </View>
          )}
          {/* Name + Handle */}
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900">
              {author.name}
              <Text className="text-gray-400 font-normal"> {author.handle}</Text>
            </Text>
          </View>
        </View>

        {/* Risk score badge */}
        {riskScore !== undefined && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="bar-chart-outline" size={16} color="#374151" />
            <Text className="text-sm font-semibold text-gray-700">{riskScore}</Text>
          </View>
        )}
      </View>

      {/* Content text */}
      <Text className="text-sm text-gray-800 leading-5 mb-3">{content}</Text>

      {/* Optional image */}
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-48 rounded-xl mb-3"
          resizeMode="cover"
        />
      )}

      {/* Action bar */}
      <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
        {/* Like */}
        <TouchableOpacity
          className="flex-row items-center gap-1.5"
          activeOpacity={0.7}
          onPress={handleLike}
        >
          <Ionicons
            name={liked ? "thumbs-up" : "thumbs-up-outline"}
            size={18}
            color={liked ? "#2563EB" : "#6B7280"}
          />
          <Text className={`text-sm ${liked ? "text-blue-600" : "text-gray-500"}`}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
          <Text className="text-sm text-gray-500">{comments}</Text>
        </TouchableOpacity>

        {/* Repost */}
        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7}>
          <Ionicons name="repeat-outline" size={18} color="#6B7280" />
          <Text className="text-sm text-gray-500">{reposts}</Text>
        </TouchableOpacity>

        {/* Bookmark */}
        <TouchableOpacity activeOpacity={0.7} onPress={handleBookmark}>
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={18}
            color={bookmarked ? "#2563EB" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Timestamp */}
      {timestamp && (
        <Text className="text-xs text-gray-400 mt-2">{timestamp}</Text>
      )}
    </TouchableOpacity>
  );
}
