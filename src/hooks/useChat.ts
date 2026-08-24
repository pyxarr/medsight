import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import {
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
  markConversationRead,
  type ConversationResponse,
  type MessageListResponse,
  type MessageResponse,
} from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export type SendMessageVariables = {
  content: string;
  mediaUrl?: string;
  mediaType?: string;
};

type OptimisticSendContext = {
  previousMessages?: InfiniteData<MessageListResponse>;
  previousConversations?: ConversationResponse[];
  previousConversation?: ConversationResponse;
  optimisticMessageId: string;
};

function updateConversationsCache(
  old: ConversationResponse[] | undefined,
  conversationId: string,
  updater: (conversation: ConversationResponse) => ConversationResponse,
) {
  if (!old) return old;
  return old.map((conversation) => (conversation.id === conversationId ? updater(conversation) : conversation));
}

function appendMessageToCache(
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

function replaceMessageInCache(
  old: InfiniteData<MessageListResponse> | undefined,
  messageId: string,
  message: MessageResponse,
) {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      results: page.results.map((item) => (item.id === messageId ? message : item)),
    })),
  };
}

export function useConversations() {
  const token = useAuthStore((state) => state.session?.access_token);

  return useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: () => {
      if (!token) throw new Error("Unauthenticated");
      return getConversations(token);
    },
    enabled: !!token,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useConversation(conversationId?: string) {
  const token = useAuthStore((state) => state.session?.access_token);

  return useQuery({
    queryKey: ["chat", "conversation", conversationId],
    queryFn: () => {
      if (!token || !conversationId) throw new Error("Unauthenticated");
      return getConversation(token, conversationId);
    },
    enabled: !!token && !!conversationId,
  });
}

export function useMessages(conversationId?: string) {
  const token = useAuthStore((state) => state.session?.access_token);

  return useInfiniteQuery({
    queryKey: ["chat", "messages", conversationId],
    queryFn: ({ pageParam = 0 }) => {
      if (!token || !conversationId) throw new Error("Unauthenticated");
      return getMessages(token, conversationId, 50, pageParam as number);
    },
    initialPageParam: 0,
    enabled: !!token && !!conversationId,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((count, page) => count + page.results.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
  });
}

export function useSendMessage(conversationId?: string) {
  const token = useAuthStore((state) => state.session?.access_token);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, mediaUrl, mediaType }: SendMessageVariables) => {
      if (!token || !conversationId) throw new Error("Unauthenticated");
      return sendMessage(token, conversationId, content, mediaUrl, mediaType);
    },
    onMutate: async ({ content, mediaUrl, mediaType }) => {
      if (!conversationId) return;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["chat", "messages", conversationId] }),
        queryClient.cancelQueries({ queryKey: ["chat", "conversations"] }),
        queryClient.cancelQueries({ queryKey: ["chat", "conversation", conversationId] }),
      ]);

      const optimisticMessageId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimisticMessage: MessageResponse = {
        id: optimisticMessageId,
        conversation_id: conversationId,
        sender_user_id: currentUserId ?? "me",
        content,
        media_url: mediaUrl ?? null,
        media_type: mediaType ?? null,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      const previousMessages = queryClient.getQueryData<InfiniteData<MessageListResponse>>([
        "chat",
        "messages",
        conversationId,
      ]);
      const previousConversations = queryClient.getQueryData<ConversationResponse[]>(["chat", "conversations"]);
      const previousConversation = queryClient.getQueryData<ConversationResponse>(["chat", "conversation", conversationId]);

      queryClient.setQueryData<InfiniteData<MessageListResponse>>(["chat", "messages", conversationId], (old) =>
        appendMessageToCache(old, optimisticMessage),
      );

      queryClient.setQueryData<ConversationResponse[]>(["chat", "conversations"], (old) =>
        updateConversationsCache(old, conversationId, (conversation) => ({
          ...conversation,
          last_message_at: optimisticMessage.created_at,
        })),
      );

      queryClient.setQueryData<ConversationResponse>(["chat", "conversation", conversationId], (old) =>
        old
          ? {
              ...old,
              last_message_at: optimisticMessage.created_at,
            }
          : old,
      );

      return {
        previousMessages,
        previousConversations,
        previousConversation,
        optimisticMessageId,
      } satisfies OptimisticSendContext;
    },
    onError: (_error, _variables, context) => {
      if (!context || !conversationId) return;

      if (context.previousMessages) {
        queryClient.setQueryData(["chat", "messages", conversationId], context.previousMessages);
      }

      if (context.previousConversations) {
        queryClient.setQueryData(["chat", "conversations"], context.previousConversations);
      }

      if (context.previousConversation) {
        queryClient.setQueryData(["chat", "conversation", conversationId], context.previousConversation);
      }
    },
    onSuccess: (message, _variables, context) => {
      if (!conversationId) return;

      queryClient.setQueryData<InfiniteData<MessageListResponse>>(["chat", "messages", conversationId], (old) =>
        context ? replaceMessageInCache(old, context.optimisticMessageId, message) : appendMessageToCache(old, message),
      );

      queryClient.setQueryData<ConversationResponse[]>(["chat", "conversations"], (old) =>
        updateConversationsCache(old, conversationId, (conversation) => ({
          ...conversation,
          last_message_at: message.created_at,
        })),
      );

      queryClient.setQueryData<ConversationResponse>(["chat", "conversation", conversationId], (old) =>
        old
          ? {
              ...old,
              last_message_at: message.created_at,
            }
          : old,
      );
    },
  });
}

export function useMarkRead(conversationId?: string) {
  const token = useAuthStore((state) => state.session?.access_token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!token || !conversationId) throw new Error("Unauthenticated");
      return markConversationRead(token, conversationId);
    },
    onSuccess: () => {
      if (!conversationId) return;

      queryClient.setQueryData<ConversationResponse[]>(["chat", "conversations"], (old) =>
        updateConversationsCache(old, conversationId, (conversation) => ({
          ...conversation,
          unread_count: 0,
        })),
      );

      queryClient.setQueryData<ConversationResponse>(["chat", "conversation", conversationId], (old) =>
        old
          ? {
              ...old,
              unread_count: 0,
            }
          : old,
      );
    },
  });
}
