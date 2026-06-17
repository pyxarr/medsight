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
  Image,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { CommentItem } from "@/components/community/CommentItem";
import { PostCard } from "@/components/community/PostCard";
import { MemberShell } from "@/components/MemberShell";
import { useOptimisticReactions } from "@/hooks/useOptimisticReactions";
import { getPostDetail, createReply, deletePost } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";
import type { MediaFile } from "@/types/community";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
    handleRepost,
    getIsLiked,
    getIsReposted,
    getIsBookmarked,
    getLikeCount,
    getRepostCount,
    getBookmarkCount,
  } = useOptimisticReactions({ token });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Unauthenticated");
      return await deletePost(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      queryClient.invalidateQueries({ queryKey: ["community-feed", "following"] });
      router.back();
    },
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const [replyContent, setReplyContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

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
      return await createReply({ post_id: id, content: replyContent, file: selectedFile ?? undefined }, token);
    },
    onSuccess: () => {
      setReplyContent("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["post-detail", id] });
    },
  });

  const handlePickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedFile({
        uri: asset.uri,
        name: asset.fileName || `media_${Date.now()}`,
        mimeType: asset.mimeType || "image/jpeg",
      });
    }
  };

  if (isLoadingPost) {
    return (
      <MemberShell showHeader={false}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </MemberShell>
    );
  }

  if (isPostError) {
    return (
      <MemberShell showHeader={false}>
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
      </MemberShell>
    );
  }

  return (
    <MemberShell scrollable={false} showHeader={false}>
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

          <View className="px-2 pb-2">
            {detailData && (
              <PostCard 
                post={detailData}
                role="member"
                onLike={() => handleLike(id, detailData.reaction_counts.is_liked, detailData.reaction_counts.like_count, detailData.reaction_counts.is_reposted, detailData.reaction_counts.repost_count, detailData.reaction_counts.is_bookmarked, detailData.reaction_counts.bookmark_count)}
                onRepost={() => handleRepost(id, detailData.reaction_counts.is_reposted, detailData.reaction_counts.repost_count, detailData.reaction_counts.is_liked, detailData.reaction_counts.like_count, detailData.reaction_counts.is_bookmarked, detailData.reaction_counts.bookmark_count)}
                onBookmark={() => handleBookmark(id, detailData.reaction_counts.is_bookmarked, detailData.reaction_counts.bookmark_count, detailData.reaction_counts.is_liked, detailData.reaction_counts.like_count, detailData.reaction_counts.is_reposted, detailData.reaction_counts.repost_count)}
                onDelete={handleDelete}
                isAuthor={session?.user?.id === detailData.author.id}
                isLikedOverride={getIsLiked(id, detailData.reaction_counts.is_liked)}
                isRepostedOverride={getIsReposted(id, detailData.reaction_counts.is_reposted)}
                isBookmarkedOverride={getIsBookmarked(id, detailData.reaction_counts.is_bookmarked)}
                likeCountOverride={getLikeCount(id, detailData.reaction_counts.like_count)}
                repostCountOverride={getRepostCount(id, detailData.reaction_counts.repost_count)}
                bookmarkCountOverride={getBookmarkCount(id, detailData.reaction_counts.bookmark_count)}
              />
            )}
          </View>

          <View className="mt-2">
            <View className="px-5 mb-3">
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Replies ({detailData?.replies.length ?? 0})
              </Text>
            </View>
            
            {detailData?.replies.map((reply) => (
              <CommentItem 
                key={reply.id} 
                post={reply} 
                role="member"
                onLike={() => handleLike(reply.id, reply.reaction_counts.is_liked, reply.reaction_counts.like_count, reply.reaction_counts.is_reposted, reply.reaction_counts.repost_count, reply.reaction_counts.is_bookmarked, reply.reaction_counts.bookmark_count)}
                onRepost={() => handleRepost(reply.id, reply.reaction_counts.is_reposted, reply.reaction_counts.repost_count, reply.reaction_counts.is_liked, reply.reaction_counts.like_count, reply.reaction_counts.is_bookmarked, reply.reaction_counts.bookmark_count)}
                onBookmark={() => handleBookmark(reply.id, reply.reaction_counts.is_bookmarked, reply.reaction_counts.bookmark_count, reply.reaction_counts.is_liked, reply.reaction_counts.like_count, reply.reaction_counts.is_reposted, reply.reaction_counts.repost_count)}
                isLikedOverride={getIsLiked(reply.id, reply.reaction_counts.is_liked)}
                isRepostedOverride={getIsReposted(reply.id, reply.reaction_counts.is_reposted)}
                isBookmarkedOverride={getIsBookmarked(reply.id, reply.reaction_counts.is_bookmarked)}
                likeCountOverride={getLikeCount(reply.id, reply.reaction_counts.like_count)}
                repostCountOverride={getRepostCount(reply.id, reply.reaction_counts.repost_count)}
                bookmarkCountOverride={getBookmarkCount(reply.id, reply.reaction_counts.bookmark_count)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Media Preview */}
        {selectedFile && (
          <View className="px-4 pb-2">
            <View className="relative">
              <Image
                source={{ uri: selectedFile.uri }}
                className="w-24 h-24 rounded-xl"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedFile(null)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
              >
                <Ionicons name="close" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Reply Footer */}
        <View className="px-4 py-3 bg-white border-t border-gray-200 flex-row items-end gap-2">
          <TouchableOpacity 
            onPress={handlePickMedia} 
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

        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setShowDeleteModal(false)}
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
                  onPress={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-xl border border-gray-300 py-3.5 items-center"
                >
                  <Text className="font-semibold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowDeleteModal(false);
                    deleteMutation.mutate();
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
