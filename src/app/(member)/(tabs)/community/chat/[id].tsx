import React, { useEffect, useMemo, useRef, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { MemberShell } from "@/components/MemberShell";
import { useConversation, useMarkRead, useMessages, useSendMessage } from "@/hooks/useChat";
import { useChatRealtime } from "@/hooks/useChatRealtime";
import { getUserProfile } from "@/services/communityService";
import { getCurrentUserProfile } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

interface PickedMedia {
  uri: string;
  type: "image" | "video";
}

function formatMessageTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CommunityChatConversation() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const conversationId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pickedMedia, setPickedMedia] = useState<PickedMedia | null>(null);
  const flatListRef = useRef<FlatList<Message>>(null);
  const markedConversationRef = useRef<string | null>(null);

  const { session, user, isLoading: isAuthLoading } = useAuthStore();
  const currentUserId = user?.id;
  const token = session?.access_token;
  const currentUserProfileQuery = useQuery({
    queryKey: ["chat", "me", token],
    queryFn: () => {
      if (!token) throw new Error("Missing token");
      return getCurrentUserProfile(token);
    },
    enabled: !!token,
  });

  const conversationQuery = useConversation(conversationId);
  const messagesQuery = useMessages(conversationId);
  const sendMessageMutation = useSendMessage(conversationId);
  const markReadMutation = useMarkRead(conversationId);

  useChatRealtime(conversationId, currentUserId);

  const otherParticipantIdFromMessages = useMemo(() => {
    const messageResponses = messagesQuery.data?.pages.flatMap((page) => page.results) ?? [];
    return messageResponses.find((item) => item.sender_user_id !== currentUserId)?.sender_user_id ?? null;
  }, [messagesQuery.data, currentUserId]);

  const shouldFetchParticipantProfile =
    !!token &&
    !!conversationId &&
    !!otherParticipantIdFromMessages &&
    conversationQuery.data?.other_participant.id === currentUserId;

  const otherParticipantProfileQuery = useQuery({
    queryKey: ["chat", "participant", conversationId, otherParticipantIdFromMessages],
    queryFn: () => {
      if (!token || !otherParticipantIdFromMessages) throw new Error("Missing participant id");
      return getUserProfile(otherParticipantIdFromMessages, token);
    },
    enabled: shouldFetchParticipantProfile,
  });

  useEffect(() => {
    if (!conversationId || !conversationQuery.data || conversationQuery.data.unread_count <= 0) return;
    if (markedConversationRef.current === conversationId) return;

    markReadMutation.mutate();
    markedConversationRef.current = conversationId;
  }, [conversationId, conversationQuery.data, markReadMutation]);

  const messages: Message[] = useMemo(() => {
    const messageResponses = messagesQuery.data?.pages.flatMap((page) => page.results) ?? [];

    return messageResponses.map((item) => ({
      id: item.id,
      text: item.content,
      senderId: item.sender_user_id === currentUserId ? "sender" : "receiver",
      timestamp: formatMessageTime(item.created_at),
      mediaUrl: item.media_url ?? undefined,
      mediaType: item.media_type === "video" ? "video" : item.media_type === "image" ? "image" : undefined,
    }));
  }, [messagesQuery.data, currentUserId]);

  const resolvedOtherParticipant = otherParticipantProfileQuery.data ?? conversationQuery.data?.other_participant;
  const conversationParticipant = conversationQuery.data?.other_participant;

  const handleSend = () => {
    const content = message.trim();
    if (!content && !pickedMedia) return;

    sendMessageMutation.mutate(
      {
        content,
        mediaUrl: pickedMedia?.uri,
        mediaType: pickedMedia?.type,
      },
      {
        onSuccess: () => {
          setMessage("");
          setPickedMedia(null);
          requestAnimationFrame(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          });
        },
      },
    );
  };

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera permissions to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'], // Updated from MediaTypeOptions.All
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPickedMedia({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      });
      Alert.alert("Media Captured", `Captured: ${result.assets[0].type}`);
    }
  };

  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need gallery permissions to pick media.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'], // Updated from MediaTypeOptions.All
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setPickedMedia({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      });
      Alert.alert("Media Selected", `Selected: ${result.assets[0].type}`);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === "sender";
    return (
      <View className={`flex-row ${isMe ? "justify-end" : "justify-start"} mb-4 px-3`}>
        {!isMe && (
          resolvedOtherParticipant?.avatar_url ? (
            <Image 
              source={{ uri: resolvedOtherParticipant.avatar_url }} 
              style={{ width: 30, height: 30, borderRadius: 999, marginRight: 8 }} 
              contentFit="cover"
            />
          ) : (
            <View className="w-[30px] h-[30px] rounded-full bg-gray-200 items-center justify-center mr-2">
              <Ionicons name="person" size={15} color="#9CA3AF" />
            </View>
          )
        )}
        <View 
          className={`max-w-[78%] px-4 py-3 rounded-2xl ${
            isMe 
              ? "bg-blue-600 rounded-tr-none" 
              : "bg-gray-100 rounded-tl-none"
          }`}
        >
          {item.mediaUrl && (
            <Image 
              source={{ uri: item.mediaUrl }} 
              className="w-full h-48 rounded-lg mb-2" 
              contentFit="cover"
            />
          )}
          <Text className={`text-sm ${isMe ? "text-white" : "text-gray-800"}`}>
            {item.text}
          </Text>
        </View>
        {isMe && (
          currentUserProfileQuery.data?.avatar_url ? (
            <Image 
              source={{ uri: currentUserProfileQuery.data.avatar_url }} 
              style={{ width: 30, height: 30, borderRadius: 999, marginLeft: 8 }} 
              contentFit="cover"
            />
          ) : (
            <View className="w-[30px] h-[30px] rounded-full bg-gray-200 items-center justify-center ml-2">
              <Ionicons name="person" size={15} color="#9CA3AF" />
            </View>
          )
        )}
      </View>
    );
  };

  const chatHeader = (
    <View className="px-4 pt-4 pb-2">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
      >
        <Ionicons name="chevron-back" size={24} color="#374151" />
      </TouchableOpacity>

      <View className="items-center pt-6 pb-4">
        {resolvedOtherParticipant?.avatar_url ? (
          <Image
            source={{ uri: resolvedOtherParticipant.avatar_url }}
            style={{ width: 112, height: 112, borderRadius: 999, marginBottom: 14 }}
            contentFit="cover"
          />
        ) : (
          <View className="w-28 h-28 rounded-full bg-gray-200 items-center justify-center mb-4">
            <Ionicons name="person" size={44} color="#9CA3AF" />
          </View>
        )}
        <View className="flex-row items-center gap-1">
          <Text className="text-2xl font-bold text-gray-900">
            {resolvedOtherParticipant?.display_name ?? conversationParticipant?.display_name ?? "Conversation"}
          </Text>
          {(resolvedOtherParticipant?.role ?? conversationParticipant?.role) === "clinician" &&
            (resolvedOtherParticipant?.is_verified ?? conversationParticipant?.is_verified) && (
              <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
            )}
        </View>
      </View>
    </View>
  );

  const isLoading =
    isAuthLoading ||
    !conversationId ||
    conversationQuery.isLoading ||
    messagesQuery.isLoading ||
    currentUserProfileQuery.isLoading ||
    (shouldFetchParticipantProfile && otherParticipantProfileQuery.isLoading);
  const isError =
    conversationQuery.isError ||
    messagesQuery.isError ||
    !conversationQuery.data ||
    currentUserProfileQuery.isError ||
    otherParticipantProfileQuery.isError;

  if (isLoading) {
    return (
      <MemberShell showHeader={false} scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </MemberShell>
    );
  }

  if (isError) {
    return (
      <MemberShell showHeader={false} scrollable={false}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">
            {conversationId ? "Failed to load conversation." : "Missing conversation id."}
          </Text>
        </View>
      </MemberShell>
    );
  }

  return (
    <MemberShell showHeader={false} scrollable={false}>
      <SafeAreaView className="flex-1">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          ListHeaderComponent={chatHeader}
          ListEmptyComponent={
            <View className="items-center justify-center py-10 px-4">
              <Text className="text-gray-500">No messages yet</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          className="flex-1"
        />

        {/* Input Bar */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          className="px-4 pb-4 pt-2"
        >
          <View className="flex-row items-end gap-2 rounded-3xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <TouchableOpacity className="p-2 rounded-full bg-gray-100" onPress={handleCameraPress}>
              <Ionicons name="camera-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 rounded-full bg-gray-100" onPress={handleGalleryPress}>
              <Ionicons name="images-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TextInput
              className="flex-1 min-h-[44px] max-h-28 px-2 py-2 text-base text-gray-900"
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity
              className={`h-11 w-11 rounded-full items-center justify-center ${
                message.trim() || pickedMedia ? "bg-blue-600" : "bg-blue-300"
              }`}
              onPress={handleSend}
              disabled={sendMessageMutation.isPending || (!message.trim() && !pickedMedia)}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MemberShell>
  );
}
