import { useDeferredValue, useState } from "react";
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity } from "react-native";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { ClinicianShell } from "@/components/ClinicianShell";
import { ChatItem } from "@/components/community/ChatItem";
import { CommunitySearchBar } from "@/components/community/CommunitySearchBar";
import { useConversations } from "@/hooks/useChat";
import type { ConversationResponse, MessageListResponse } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type FilterType = "recents" | "unread";

interface Chat {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  seen?: boolean;
  isGroup?: boolean;
}

function formatConversationTime(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getLatestCachedMessage(queryClient: ReturnType<typeof useQueryClient>, conversationId: string) {
  const cached = queryClient.getQueryData<InfiniteData<MessageListResponse>>(["chat", "messages", conversationId]);
  return cached?.pages
    .flatMap((page) => page.results)
    .reduce<MessageListResponse["results"][number] | undefined>((latest, message) => {
      if (!latest) return message;
      return new Date(message.created_at).getTime() >= new Date(latest.created_at).getTime() ? message : latest;
    }, undefined);
}

export default function CommunityChat() {
  const queryClient = useQueryClient();
  const { data: conversations, isLoading, isError, error } = useConversations();
  const authLoading = useAuthStore((state) => state.isLoading);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [activeFilter, setActiveFilter] = useState<FilterType>("recents");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const normalizedSearch = deferredSearchQuery.trim().toLowerCase();

  const filteredConversations = (conversations ?? []).filter((conversation) => {
    if (!normalizedSearch) return true;

    const displayName = conversation.other_participant.display_name.toLowerCase();
    const username = conversation.other_participant.username.toLowerCase();
    return displayName.includes(normalizedSearch) || username.includes(normalizedSearch);
  });

  const chats: Chat[] = filteredConversations.map((conversation: ConversationResponse) => ({
    id: conversation.id,
    name: conversation.other_participant.display_name,
    avatarUrl: conversation.other_participant.avatar_url ?? undefined,
    lastMessage: getLatestCachedMessage(queryClient, conversation.id)?.content ?? "",
    timestamp: formatConversationTime(conversation.last_message_at),
    unread: conversation.unread_count > 0 ? conversation.unread_count : undefined,
    seen: (() => {
      const latestMessage = getLatestCachedMessage(queryClient, conversation.id);
      if (!latestMessage || !currentUserId) return undefined;

      return latestMessage.sender_user_id === currentUserId && latestMessage.is_read ? true : undefined;
    })(),
    isGroup: false,
  }));

  const filteredChats = chats.filter((chat) => (activeFilter === "unread" ? (chat.unread ?? 0) > 0 : true));

  if (authLoading || isLoading) {
    return (
      <ClinicianShell showHeader={false} scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </ClinicianShell>
    );
  }

  if (isError) {
    return (
      <ClinicianShell showHeader={false} scrollable={false}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">
            Failed to load conversations: {error instanceof Error ? error.message : "Unknown error"}
          </Text>
        </View>
      </ClinicianShell>
    );
  }

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1">
        {/* Header */}
        <View className="items-center py-4">
          <Text className="text-xl font-semibold text-gray-900">Chats</Text>
        </View>

        {/* Search bar */}
        <CommunitySearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search chats"
        />

        {/* Filter pills */}
        <View className="flex-row items-center gap-2 px-5 mb-2">
          <TouchableOpacity
            className={`px-4 py-1.5 rounded-full ${
              activeFilter === "recents" ? "bg-blue-500" : "bg-gray-100"
            }`}
            onPress={() => setActiveFilter("recents")}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                activeFilter === "recents" ? "text-white" : "text-gray-600"
              }`}
            >
              Recents
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-1.5 rounded-full ${
              activeFilter === "unread" ? "bg-blue-500" : "bg-gray-100"
            }`}
            onPress={() => setActiveFilter("unread")}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                activeFilter === "unread" ? "text-white" : "text-gray-600"
              }`}
            >
              Unread
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat list */}
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem {...item} />}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500">No new messages</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ClinicianShell>
  );
}
