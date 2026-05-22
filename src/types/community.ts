/**
 * Types for the Community feature.
 * Mirrors the Pydantic schemas from the backend exactly.
 */

export interface AuthorInfo {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  role: string;
  is_verified: boolean;
}

export interface ReactionCounts {
  like_count: number;
  reply_count: number;
  repost_count: number;
  bookmark_count: number;
  is_liked: boolean;
  is_reposted: boolean;
  is_bookmarked: boolean;
}

export interface ReactionToggleResponse {
  like_count: number;
  repost_count: number;
  bookmark_count: number;
  is_liked: boolean;
  is_reposted: boolean;
  is_bookmarked: boolean;
}

export interface CommunityPost {
  id: string;
  content: string;
  media_url: string | null;
  view_count: number;
  created_at: string;
  author: AuthorInfo;
  reaction_counts: ReactionCounts;
}

export interface CommunityReply extends CommunityPost {
  parent_post_id?: string;
}

export interface FeedResponse {
  total: number;
  results: CommunityPost[];
}

export interface SearchResponse {
  posts: CommunityPost[];
  users: AuthorInfo[];
}

export interface PostDetailResponse {
  id: string;
  content: string;
  media_url: string | null;
  view_count: number;
  created_at: string;
  author: AuthorInfo;
  reaction_counts: ReactionCounts;
  replies: CommunityReply[];
}

export interface CreatePostRequest {
  content: string;
  file?: any; // FormData file
}

export interface CreateReplyRequest {
  post_id: string;
  content: string;
  file?: any; // FormData file
}
