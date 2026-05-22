import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClinicianShell } from "@/components/ClinicianShell";
import { createPost } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";

export default function CreatePost() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuthStore();
  const token = session?.access_token;

  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; mimeType: string } | null>(null);

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Unauthenticated");
      return await createPost({ content, file: selectedFile }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
      alert("Failed to create post. Please try again.");
    },
  });

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "image/*,video/*" });
    if (!result.canceled) {
      setSelectedFile({
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        mimeType: result.assets[0].mimeType || "application/octet-stream",
      });
    }
  };

  return (
    <ClinicianShell scrollable={false} showHeader={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Text className="text-base text-gray-500">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">New Post</Text>
          <TouchableOpacity
            onPress={() => createPostMutation.mutate()}
            disabled={!content.trim() || createPostMutation.isPending}
            className="px-4 py-2 bg-blue-600 rounded-full disabled:bg-gray-300"
          >
            {createPostMutation.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-sm">Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="p-4">
            <TextInput
              className="text-base text-gray-900 min-h-[150px] text-left"
              placeholder="What's on your mind?"
              placeholderTextColor="#9CA3AF"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            {/* Media Preview */}
            {selectedFile && (
              <View className="mt-4 relative">
                <Image
                  source={{ uri: selectedFile.uri }}
                  className="w-full h-48 rounded-xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => setSelectedFile(null)}
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5"
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-4 py-3 border-t border-gray-100 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handlePickDocument}
            className="flex-row items-center gap-2 p-2 rounded-full bg-gray-50"
          >
            <Ionicons name="image-outline" size={24} color="#2563EB" />
            <Text className="text-sm text-blue-600 font-medium">Add Media</Text>
          </TouchableOpacity>
          <Text className="text-xs text-gray-400">
            {content.length}/500
          </Text>
        </View>
      </KeyboardAvoidingView>
    </ClinicianShell>
  );
}
