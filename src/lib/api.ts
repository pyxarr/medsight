/**
 * Base API fetch wrapper for making authenticated requests to the backend.
 */

interface FetchApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: BodyInit | Record<string, unknown>;
  params?: Record<string, unknown>;
  token?: string;
}

export interface ParticipantInfo {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  role: string;
  is_verified: boolean;
}

export interface ConversationResponse {
  id: string;
  other_participant: ParticipantInfo;
  last_message_at: string | null;
  unread_count: number;
  created_at: string;
}

export interface MessageResponse {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  is_read: boolean;
  created_at: string;
}

export interface MessageListResponse {
  total: number;
  results: MessageResponse[];
}

export interface NotificationActor {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  role: string;
  is_verified: boolean;
}

export interface NotificationUser {
  id: string;
  name?: string;
  avatar?: string;
  display_name?: string;
  username?: string;
  avatar_url?: string | null;
  role?: string;
  is_verified?: boolean;
}

export interface NotificationMetrics {
  likes: number;
  comments: number;
  reposts: number;
}

export interface NotificationResponse {
  id: string;
  type: "single" | "grouped";
  actionType: "follow" | "like" | "repost" | "reply" | "message";
  users: NotificationUser[];
  message: string;
  content?: string | null;
  time?: string | null;
  post_id?: string | null;
  conversation_id?: string | null;
  is_read: boolean;
  created_at: string;
  metrics?: NotificationMetrics | null;
}

export interface NotificationListResponse {
  total: number;
  results: NotificationResponse[];
}

export interface UnreadNotificationCountResponse {
  unread_count: number;
}

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export async function fetchApi<TResponse>(
  path: string,
  options: FetchApiOptions = {}
): Promise<TResponse> {
  const { method = "GET", body, params, token } = options;

  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Check your .env file.");
  }

  let fullPath = path;
  if (params) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    fullPath += `?${query}`;
  }

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Do not set Content-Type for FormData — let fetch set the boundary automatically
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${fullPath}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as TResponse;
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Something went wrong. Please try again.");
  }

  const parsedJson = (await response.json()) as TResponse;
  return parsedJson;
}

export async function getConversations(token: string): Promise<ConversationResponse[]> {
  return fetchApi<ConversationResponse[]>("/api/chat/conversations", {
    method: "GET",
    token,
  });
}

export async function getConversation(token: string, conversationId: string): Promise<ConversationResponse> {
  return fetchApi<ConversationResponse>(`/api/chat/conversations/${conversationId}`, {
    method: "GET",
    token,
  });
}

export async function startConversation(token: string, otherUserId: string): Promise<ConversationResponse> {
  return fetchApi<ConversationResponse>("/api/chat/conversations", {
    method: "POST",
    body: { other_user_id: otherUserId },
    token,
  });
}

export async function getMessages(token: string, conversationId: string, limit = 50, offset = 0): Promise<MessageListResponse> {
  return fetchApi<MessageListResponse>(`/api/chat/conversations/${conversationId}/messages`, {
    method: "GET",
    params: { limit, offset },
    token,
  });
}

export async function sendMessage(
  token: string,
  conversationId: string,
  content: string,
  mediaUrl?: string,
  mediaType?: string,
): Promise<MessageResponse> {
  return fetchApi<MessageResponse>(`/api/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: {
      content,
      media_url: mediaUrl ?? null,
      media_type: mediaType ?? null,
    },
    token,
  });
}

export async function markConversationRead(token: string, conversationId: string): Promise<void> {
  return fetchApi<void>(`/api/chat/conversations/${conversationId}/read`, {
    method: "POST",
    token,
  });
}

export async function getNotifications(token: string, limit = 20, offset = 0): Promise<NotificationListResponse> {
  return fetchApi<NotificationListResponse>("/api/notifications", {
    method: "GET",
    params: { limit, offset },
    token,
  });
}

export async function markAllNotificationsRead(token: string): Promise<{ marked_read: true }> {
  return fetchApi<{ marked_read: true }>("/api/notifications/read", {
    method: "POST",
    token,
  });
}

export async function markNotificationRead(token: string, notificationId: string): Promise<{ marked_read: true }> {
  return fetchApi<{ marked_read: true }>(`/api/notifications/${notificationId}/read`, {
    method: "POST",
    token,
  });
}

export async function getUnreadNotificationCount(token: string): Promise<UnreadNotificationCountResponse> {
  return fetchApi<UnreadNotificationCountResponse>("/api/notifications/unread-count", {
    method: "GET",
    token,
  });
}
