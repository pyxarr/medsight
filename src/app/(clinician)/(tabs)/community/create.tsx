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
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { ClinicianShell } from "@/components/ClinicianShell";
import { createPost } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";
import type { MediaFile } from "@/types/community";

/**
 * Separate component for Video Preview to handle the useVideoPlayer hook.
 */
function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      style={{ width: "100%", height: 192, borderRadius: 12 }}
      player={player}
      nativeControls={true}
    />
  );
}

function CreatePost() {
  const router = useRouter();
  const { session } = useAuthStore();
  const token = session?.access_token;
  const userAvatar = session?.user?.user_metadata?.avatar_url;

  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Unauthenticated");
      return await createPost({ content, file: selectedFile ?? undefined }, token);
    },
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    },
  });

  const handlePickMedia = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required", 
          `Please allow access to your ${useCamera ? "camera" : "gallery"} in settings to upload media.`
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images', 'videos'],
        allowsEditing: !useCamera,
        aspect: !useCamera ? [4, 3] : undefined,
        quality: 1,
      };

      const result = useCamera 
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || `media_${Date.now()}`,
          mimeType: asset.mimeType || (asset.uri.endsWith(".mp4") ? "video/mp4" : "image/jpeg"),
        });
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert("Error", "An error occurred while selecting media.");
    }
  };

  return (
    <ClinicianShell scrollable={false} showHeader={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Text className="text-base text-gray-500">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => createPostMutation.mutate()}
            disabled={!content.trim() || createPostMutation.isPending}
            className="px-6 py-2 bg-blue-600 rounded-full disabled:bg-gray-300"
          >
            {createPostMutation.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-sm">Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="px-4 py-2">
            <View className="flex-row items-start">
              {/* Avatar */}
              {userAvatar ? (
                <Image
                  source={{ uri: userAvatar }}
                  className="w-12 h-12 rounded-full mr-3"
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
                  <Ionicons name="person" size={24} color="#6B7280" />
                </View>
              )}

              {/* Text Input */}
              <TextInput
                className="flex-1 text-base text-gray-900 min-h-[40px] text-left"
                placeholder="Share your thoughts"
                placeholderTextColor="#9CA3AF"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Media Toolbar */}
            <View className="flex-row gap-5 mt-4 ml-15">
              <TouchableOpacity onPress={() => handlePickMedia(true)} className="p-1">
                <Ionicons name="camera-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handlePickMedia(false)} className="p-1">
                <Ionicons name="images-outline" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Media Preview */}
            {selectedFile && (
              <View className="mt-4 relative">
                {selectedFile.mimeType?.startsWith("video") || selectedFile.uri.endsWith(".mp4") ? (
                  <VideoPreview uri={selectedFile.uri} />
                ) : (
                  <Image
                    source={{ uri: selectedFile.uri }}
                    className="w-full h-48 rounded-xl"
                    resizeMode="cover"
                  />
                )}
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
      </KeyboardAvoidingView>
    </ClinicianShell>
  );
}

export default CreatePost;