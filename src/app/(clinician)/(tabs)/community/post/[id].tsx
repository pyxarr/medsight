import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { CommentItem } from "@/components/clinician/community/CommentItem";
import { PostCard } from "@/components/clinician/community/PostCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import { useOptimisticReactions } from "@/hooks/useOptimisticReactions";
import { getPostDetail, createReply } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const token = session?.access_token;

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["post-detail", id] });
    }, [queryClient, id])
  );

  const {
    handleLike,
    handleBookmark,
    getIsLiked,
    getIsBookmarked,
    getLikeCount,
  } = useOptimisticReactions({ token });

  const [replyContent, setReplyContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);

  const { 
    data: detailData, 
    isLoading: isLoadingPost, 
    isError: isPostError, 
    refetch: refetchPost,
    isFetching
  } = useQuery({
    queryKey: ["post-detail", id],
    queryFn: async () => {
      if (!token) throw new Error("Unauthenticated");
      return await getPostDetail(id, token);
    },
    enabled: !!token,
  });

  const handleRefresh = async () => {
    await refetchPost();
  };

  const replyMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Unauthenticated");
      return await createReply({ post_id: id, content: replyContent, file: selectedFile }, token);
    },
    onSuccess: () => {
      setReplyContent("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["post-detail", id] });
    },
  });

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) {
      setSelectedFile({
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        mimeType: result.assets[0].mimeType || "application/octet-stream",
      });
    }
  };

  if (isLoadingPost) {
    return (
      <ClinicianShell showHeader={false}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ClinicianShell>
    );
  }

  if (isPostError) {
    return (
      <ClinicianShell showHeader={false}>
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-center text-lg font-semibold text-gray-900 mt-4">
            Post not found
          </Text>
          <TouchableOpacity 
            onPress={() => refetchPost()} 
            className="bg-blue-600 px-6 py-3 rounded-full mt-6"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </ClinicianShell>
    );
  }

  return (
    <ClinicianShell scrollable={false} showHeader={false}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1"
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={handleRefresh} colors={["#2563EB"]} />
          }
        >
          {/* Custom Header */}
          <View className="px-4 py-4">
            <Text className="text-2xl text-center font-semibold text-gray-900">Post</Text>
          </View>

          <View className="px-5 pb-2">
            {detailData && (
              <PostCard 
                post={detailData} 
                onLike={() => handleLike(id, detailData.reaction_counts.is_liked, detailData.reaction_counts.like_count, detailData.reaction_counts.is_bookmarked, detailData.reaction_counts.bookmark_count)}
                onBookmark={() => handleBookmark(id, detailData.reaction_counts.is_bookmarked, detailData.reaction_counts.bookmark_count, detailData.reaction_counts.is_liked, detailData.reaction_counts.like_count)}
                isLikedOverride={getIsLiked(id, detailData.reaction_counts.is_liked)}
                isBookmarkedOverride={getIsBookmarked(id, detailData.reaction_counts.is_bookmarked)}
                likeCountOverride={getLikeCount(id, detailData.reaction_counts.like_count)}
              />
            )}
          </View>

          <View className="mt-2">
            <View className="px-5 mb-3">
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Replies ({detailData?.reaction_counts.reply_count || 0})
              </Text>
            </View>
            
            {detailData?.replies.map((reply) => (
              <CommentItem 
                key={reply.id} 
                post={reply} 
                onLike={() => handleLike(reply.id, reply.reaction_counts.is_liked, reply.reaction_counts.like_count, reply.reaction_counts.is_bookmarked, reply.reaction_counts.bookmark_count)}
                onBookmark={() => handleBookmark(reply.id, reply.reaction_counts.is_bookmarked, reply.reaction_counts.bookmark_count, reply.reaction_counts.is_liked, reply.reaction_counts.like_count)}
                isLikedOverride={getIsLiked(reply.id, reply.reaction_counts.is_liked)}
                isBookmarkedOverride={getIsBookmarked(reply.id, reply.reaction_counts.is_bookmarked)}
                likeCountOverride={getLikeCount(reply.id, reply.reaction_counts.like_count)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Reply Footer */}
        <View className="px-4 py-3 bg-white border-t border-gray-200 flex-row items-end gap-2">
          <TouchableOpacity 
            onPress={handlePickDocument} 
            className={`p-2 rounded-full ${selectedFile ? "bg-blue-100" : "bg-gray-100"}`}
          >
            <Ionicons 
              name={selectedFile ? "image" : "image-outline"} 
              size={24} 
              color={selectedFile ? "#2563EB" : "#6B7280"} 
            />
          </TouchableOpacity>
          
          <TextInput
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 text-sm min-h-[40px] max-h-[100px]"
            placeholder="Write a reply..."
            value={replyContent}
            onChangeText={setReplyContent}
            multiline
          />
          
          <TouchableOpacity 
            onPress={() => replyMutation.mutate()} 
            disabled={!replyContent.trim() || replyMutation.isPending}
            className="p-2 rounded-full bg-blue-600 disabled:bg-gray-300"
          >
            <Ionicons 
              name={replyMutation.isPending ? "ellipse" : "send"} 
              size={20} 
              color="#fff" 
            />
            {replyMutation.isPending && <ActivityIndicator size="small" color="#fff" style={{ position: 'absolute', top: 8, left: 8 }} />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ClinicianShell>
  );
}
