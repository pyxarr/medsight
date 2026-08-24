import { useEffect } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { type ConversationResponse, type MessageListResponse, type MessageResponse } from "@/lib/api";
import { supabase } from "@/lib/supabase";

function appendRealtimeMessage(
  old: InfiniteData<MessageListResponse> | undefined,
  message: MessageResponse,
) {
  if (!old) {
    return {
      pages: [{ total: 1, results: [message] }],
      pageParams: [0],
    } satisfies InfiniteData<MessageListResponse>;
  }

  const lastIndex = old.pages.length - 1;
  const nextPages = old.pages.map((page, index) => {
    const nextTotal = page.total + 1;
    if (index !== lastIndex) {
      return { ...page, total: nextTotal };
    }

    return {
      ...page,
      total: nextTotal,
      results: [...page.results, message],
    };
  });

  return {
    ...old,
    pages: nextPages,
  };
}

function updateConversationCache(
  old: ConversationResponse[] | undefined,
  conversationId: string,
  updater: (conversation: ConversationResponse) => ConversationResponse,
) {
  if (!old) return old;
  return old.map((conversation) => (conversation.id === conversationId ? updater(conversation) : conversation));
}

export function useChatRealtime(conversationId?: string, currentUserId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const message = payload.new as MessageResponse;

          queryClient.setQueryData<InfiniteData<MessageListResponse>>(["chat", "messages", conversationId], (old) =>
            appendRealtimeMessage(old, message),
          );

          queryClient.setQueryData<ConversationResponse[]>(["chat", "conversations"], (old) =>
            updateConversationCache(old, conversationId, (conversation) => ({
              ...conversation,
              last_message_at: message.created_at,
              unread_count:
                message.sender_user_id !== currentUserId
                  ? conversation.unread_count + 1
                  : conversation.unread_count,
            })),
          );

          queryClient.setQueryData<ConversationResponse>(["chat", "conversation", conversationId], (old) =>
            old
              ? {
                  ...old,
                  last_message_at: message.created_at,
                  unread_count:
                    message.sender_user_id !== currentUserId
                      ? old.unread_count + 1
                      : old.unread_count,
                }
              : old,
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId, queryClient]);
}
