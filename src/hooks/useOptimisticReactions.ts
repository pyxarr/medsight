import { useCallback } from "react";
import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { toggleReaction, toggleBookmark } from "@/services/communityService";
import { useCommunityStore } from "@/store/communityStore";
import type { FeedResponse, PostDetailResponse, ReactionToggleResponse } from "@/types/community";

interface UseOptimisticReactionsOptions {
  token?: string;
}

export function useOptimisticReactions({ token }: UseOptimisticReactionsOptions) {
  const queryClient = useQueryClient();
  const optimisticStates = useCommunityStore((state) => state.optimisticStates);
  const setOptimisticState = useCommunityStore((state) => state.setOptimisticState);
  const removeOptimisticState = useCommunityStore((state) => state.removeOptimisticState);

  const updateFeedCache = useCallback((postId: string, reactionToggle: ReactionToggleResponse) => {
    queryClient.setQueryData(["community-feed", "foryou"], (old: InfiniteData<FeedResponse> | undefined) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map(page => ({
          ...page,
          results: page.results.map(post =>
            post.id === postId ? { ...post, reaction_counts: { ...post.reaction_counts, ...reactionToggle } } : post
          ),
        })),
      };
    });
    queryClient.setQueryData(["community-feed", "following"], (old: InfiniteData<FeedResponse> | undefined) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map(page => ({
          ...page,
          results: page.results.map(post =>
            post.id === postId ? { ...post, reaction_counts: { ...post.reaction_counts, ...reactionToggle } } : post
          ),
        })),
      };
    });
  }, [queryClient]);

  const updateBookmarkCache = useCallback((postId: string, reactionToggle: ReactionToggleResponse) => {
    queryClient.setQueryData(["community", "bookmarks"], (old: InfiniteData<FeedResponse> | undefined) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map(page => ({
          ...page,
          results: page.results.map(post =>
            post.id === postId ? { ...post, reaction_counts: { ...post.reaction_counts, ...reactionToggle } } : post
          ),
        })),
      };
    });
  }, [queryClient]);

  const updatePostDetailCache = useCallback((postId: string, reactionToggle: ReactionToggleResponse) => {
    queryClient.setQueryData(["post-detail", postId], (old: PostDetailResponse | undefined) => {
      if (!old) return old;
      return {
        ...old,
        reaction_counts: { ...old.reaction_counts, ...reactionToggle },
      };
    });
  }, [queryClient]);

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error("Unauthenticated");
      return await toggleReaction(postId, "like", token);
    },
    onSuccess: (data, postId) => {
      updateFeedCache(postId, data);
      updateBookmarkCache(postId, data);
      updatePostDetailCache(postId, data);
      queryClient.invalidateQueries({ queryKey: ["post-detail"] });
      removeOptimisticState(postId);
    },
    onError: (_err, postId) => {
      removeOptimisticState(postId);
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error("Unauthenticated");
      return await toggleBookmark(postId, token);
    },
    onSuccess: (data, postId) => {
      updateFeedCache(postId, data);
      updateBookmarkCache(postId, data);
      updatePostDetailCache(postId, data);
      queryClient.invalidateQueries({ queryKey: ["post-detail"] });
      queryClient.invalidateQueries({ queryKey: ["community", "bookmarks"] });
      removeOptimisticState(postId);
    },
    onError: (_err, postId) => {
      queryClient.invalidateQueries({ queryKey: ["community", "bookmarks"] });
      removeOptimisticState(postId);
    },
  });

  const repostMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!token) throw new Error("Unauthenticated");
      return await toggleReaction(postId, "repost", token);
    },
    onSuccess: (data, postId) => {
      updateFeedCache(postId, data);
      updateBookmarkCache(postId, data);
      updatePostDetailCache(postId, data);
      queryClient.invalidateQueries({ queryKey: ["post-detail"] });
      removeOptimisticState(postId);
    },
    onError: (_err, postId) => {
      removeOptimisticState(postId);
    },
  });

  const handleLike = useCallback((postId: string, currentIsLiked: boolean, currentLikeCount: number, currentIsReposted: boolean, currentRepostCount: number, currentIsBookmarked: boolean, currentBookmarkCount: number) => {
    const newIsLiked = !currentIsLiked;
    const newLikeCount = newIsLiked ? currentLikeCount + 1 : currentLikeCount - 1;
    const existing = optimisticStates.get(postId);
    setOptimisticState(postId, {
      isLiked: newIsLiked,
      isReposted: existing?.isReposted ?? currentIsReposted,
      isBookmarked: existing?.isBookmarked ?? currentIsBookmarked,
      likeCount: newLikeCount,
      repostCount: existing?.repostCount ?? currentRepostCount,
      bookmarkCount: existing?.bookmarkCount ?? currentBookmarkCount,
    });
    likeMutation.mutate(postId);
  }, [optimisticStates, setOptimisticState, likeMutation]);

  const handleBookmark = useCallback((postId: string, currentIsBookmarked: boolean, currentBookmarkCount: number, currentIsLiked: boolean, currentLikeCount: number, currentIsReposted: boolean, currentRepostCount: number) => {
    const newIsBookmarked = !currentIsBookmarked;
    const newBookmarkCount = newIsBookmarked ? currentBookmarkCount + 1 : currentBookmarkCount - 1;
    const existing = optimisticStates.get(postId);
    setOptimisticState(postId, {
      isLiked: existing?.isLiked ?? currentIsLiked,
      isReposted: existing?.isReposted ?? currentIsReposted,
      isBookmarked: newIsBookmarked,
      likeCount: existing?.likeCount ?? currentLikeCount,
      repostCount: existing?.repostCount ?? currentRepostCount,
      bookmarkCount: newBookmarkCount,
    });
    bookmarkMutation.mutate(postId);
  }, [optimisticStates, setOptimisticState, bookmarkMutation]);

  const handleRepost = useCallback((postId: string, currentIsReposted: boolean, currentRepostCount: number, currentIsLiked: boolean, currentLikeCount: number, currentIsBookmarked: boolean, currentBookmarkCount: number) => {
    const newIsReposted = !currentIsReposted;
    const newRepostCount = newIsReposted ? currentRepostCount + 1 : currentRepostCount - 1;
    const existing = optimisticStates.get(postId);
    setOptimisticState(postId, {
      isLiked: existing?.isLiked ?? currentIsLiked,
      isReposted: newIsReposted,
      isBookmarked: existing?.isBookmarked ?? currentIsBookmarked,
      likeCount: existing?.likeCount ?? currentLikeCount,
      repostCount: newRepostCount,
      bookmarkCount: existing?.bookmarkCount ?? currentBookmarkCount,
    });
    repostMutation.mutate(postId);
  }, [optimisticStates, setOptimisticState, repostMutation]);

  const getIsLiked = useCallback((postId: string, serverValue: boolean) => {
    const optimistic = optimisticStates.get(postId);
    return optimistic !== undefined ? optimistic.isLiked : serverValue;
  }, [optimisticStates]);

  const getIsBookmarked = useCallback((postId: string, serverValue: boolean) => {
    const optimistic = optimisticStates.get(postId);
    return optimistic !== undefined ? optimistic.isBookmarked : serverValue;
  }, [optimisticStates]);

  const getLikeCount = useCallback((postId: string, serverValue: number) => {
    const optimistic = optimisticStates.get(postId);
    return optimistic !== undefined ? optimistic.likeCount : serverValue;
  }, [optimisticStates]);

  const getBookmarkCount = useCallback((postId: string, serverValue: number) => {
    const optimistic = optimisticStates.get(postId);
    return optimistic !== undefined ? optimistic.bookmarkCount : serverValue;
  }, [optimisticStates]);

  const getIsReposted = useCallback((postId: string, serverValue: boolean) => {
    const optimistic = optimisticStates.get(postId);
    return optimistic !== undefined ? optimistic.isReposted : serverValue;
  }, [optimisticStates]);

  const getRepostCount = useCallback((postId: string, serverValue: number) => {
    const optimistic = optimisticStates.get(postId);
    return optimistic !== undefined ? optimistic.repostCount : serverValue;
  }, [optimisticStates]);

  return {
    handleLike,
    handleBookmark,
    handleRepost,
    getIsLiked,
    getIsBookmarked,
    getIsReposted,
    getLikeCount,
    getBookmarkCount,
    getRepostCount,
  };
}
