import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CommentItemProps {
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
}

export function CommentItem({
  author,
  content,
  timestamp,
  likes: initialLikes,
  comments,
  reposts,
}: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <View className="px-5 py-3 border-b border-gray-100">
      <View className="flex-row items-center gap-3 mb-2">
        <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
          <Ionicons name="person" size={16} color="#6B7280" />
        </View>
        <View className="flex-row items-center gap-1.5 flex-1">
          <Text className="text-sm font-semibold text-gray-900">{author.name}</Text>
          <Text className="text-xs text-gray-400">{timestamp}</Text>
        </View>
      </View>

      <Text className="text-sm text-gray-700 mb-3">{content}</Text>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7} onPress={handleLike}>
          <Ionicons name={liked ? "thumbs-up" : "thumbs-up-outline"} size={16} color={liked ? "#2563EB" : "#6B7280"} />
          <Text className={`text-xs ${liked ? "text-blue-600" : "text-gray-500"}`}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
          <Text className="text-xs text-gray-500">{comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center gap-1.5" activeOpacity={0.7}>
          <Ionicons name="repeat-outline" size={16} color="#6B7280" />
          <Text className="text-xs text-gray-500">{reposts}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={() => setBookmarked((prev) => !prev)}>
          <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={16} color={bookmarked ? "#2563EB" : "#6B7280"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
