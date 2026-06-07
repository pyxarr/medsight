import { File } from "expo-file-system";
import { fetchApi } from "@/lib/api";
import type {
  CommunityPost,
  ReactionToggleResponse,
  FeedResponse,
  SearchResponse,
  PostDetailResponse,
  CreatePostRequest,
  CreateReplyRequest,
} from "@/types/community";

/**
 * Service for handling all community-related API calls.
 */

export async function getFeed(limit = 20, offset = 0, token?: string): Promise<FeedResponse> {
  return fetchApi<FeedResponse>(`/api/community/feed`, {
    method: "GET",
    params: { limit, offset },
    token,
  });
}

export async function getFollowingFeed(limit = 20, offset = 0, token?: string): Promise<FeedResponse> {
  return fetchApi<FeedResponse>(`/api/community/feed/following`, {
    method: "GET",
    params: { limit, offset },
    token,
  });
}

export async function getPostDetail(postId: string, token?: string): Promise<PostDetailResponse> {
  return fetchApi<PostDetailResponse>(`/api/community/posts/${postId}`, {
    method: "GET",
    token,
  });
}

export async function createPost(data: CreatePostRequest, token: string): Promise<CommunityPost> {
  const formData = new FormData();
  formData.append("content", data.content);
  if (data.file) {
    const fileObj = new File(data.file.uri);
    formData.append("file", fileObj);
  }

  return fetchApi<CommunityPost>(`/api/community/posts`, {
    method: "POST",
    body: formData,
    token,
  });
}

export async function createReply(data: CreateReplyRequest, token: string): Promise<CommunityPost> {
  const formData = new FormData();
  formData.append("content", data.content);
  if (data.file) {
    const fileObj = new File(data.file.uri);
    formData.append("file", fileObj);
  }

  return fetchApi<CommunityPost>(`/api/community/posts/${data.post_id}/replies`, {
    method: "POST",
    body: formData,
    token,
  });
}

export async function toggleReaction(postId: string, reactionType: "like" | "repost", token: string): Promise<ReactionToggleResponse> {
  const endpoint = reactionType === "like" ? "like" : "repost";
  return fetchApi<ReactionToggleResponse>(`/api/community/posts/${postId}/${endpoint}`, {
    method: "POST",
    token,
  });
}

export async function toggleBookmark(postId: string, token: string): Promise<ReactionToggleResponse> {
  return fetchApi<ReactionToggleResponse>(`/api/community/posts/${postId}/bookmark`, {
    method: "POST",
    token,
  });
}

export async function followUser(userId: string, token: string): Promise<{ following: boolean }> {
  return fetchApi<{ following: boolean }>(`/api/community/follows/${userId}`, {
    method: "POST",
    token,
  });
}

export async function unfollowUser(userId: string, token: string): Promise<{ following: boolean }> {
  return fetchApi<{ following: boolean }>(`/api/community/follows/${userId}`, {
    method: "DELETE",
    token,
  });
}

export async function searchCommunity(query: string, limit = 20, token?: string): Promise<SearchResponse> {
  return fetchApi<SearchResponse>(`/api/community/search`, {
    method: "GET",
    params: { q: query, limit },
    token,
  });
}

export async function getBookmarks(limit = 20, offset = 0, token?: string): Promise<FeedResponse> {
  return fetchApi<FeedResponse>(`/api/community/bookmarks`, {
    method: "GET",
    params: { limit, offset },
    token,
  });
}

export async function deletePost(postId: string, token: string): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/api/community/posts/${postId}`, {
    method: "DELETE",
    token,
  });
}
