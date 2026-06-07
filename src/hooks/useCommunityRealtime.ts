import { useEffect, useRef } from "react";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getPostDetail } from "@/services/communityService";
import { useAuthStore } from "@/store/authStore";
import type { FeedResponse, CommunityPost } from "@/types/community";

/**
 * useCommunityRealtime
 *
 * Listens for new community posts via Supabase Realtime INSERT events on the
 * `community_posts` table. When a new post arrives, it fetches the full post
 * data (with author info) from the REST API and prepends it to the for-you
 * feed cache in TanStack Query, so it appears instantly at the top of the list.
 *
 * The subscription is created once on mount and torn down on unmount via a
 * stable `useEffect` that depends only on `queryClient`. The optional
 * `onNewPost` callback is kept in a ref and synced after every render to avoid
 * re-subscribing the channel when the callback identity changes.
 *
 * @param onNewPost - Optional callback invoked after a new post is cached.
 */
export function useCommunityRealtime(onNewPost?: () => void) {
  const queryClient = useQueryClient();

  // Keep the latest onNewPost in a ref so the subscription effect never needs
  // to re-run when the callback changes. Synced after every render via the
  // effect below (no deps array = runs on every commit).
  const onNewPostRef = useRef(onNewPost);
  useEffect(() => {
    onNewPostRef.current = onNewPost;
  });

  // Stable subscription effect — only depends on queryClient which is
  // guaranteed stable by TanStack Query.
  useEffect(() => {
    const channel = supabase
      .channel("community-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        async (payload) => {
          const postId: string = (payload.new as Record<string, unknown>).id as string;
          if (!postId) return;

          try {
            // Read token at event time from Zustand store (avoids stale closures).
            const token = useAuthStore.getState().session?.access_token;
            // Fetch the full post shape (with author & reaction_counts) via the REST API.
            const fullPost = await getPostDetail(postId, token);

            // Map to the CommunityPost shape expected by the feed cache.
            const newPost: CommunityPost = {
              id: fullPost.id,
              content: fullPost.content,
              media_url: fullPost.media_url,
              view_count: fullPost.view_count,
              created_at: fullPost.created_at,
              author: fullPost.author,
              reaction_counts: fullPost.reaction_counts,
            };

            // Prepend the new post to page 0 of the for-you feed.
            queryClient.setQueryData<InfiniteData<FeedResponse>>(
              ["community-feed", "foryou"],
              (old) => {
                if (!old) return old;
                return {
                  ...old,
                  pages: [
                    {
                      ...old.pages[0],
                      results: [newPost, ...old.pages[0].results],
                    },
                    ...old.pages.slice(1),
                  ],
                };
              },
            );
            onNewPostRef.current?.();
          } catch (error) {
            console.error("Failed to fetch new post for feed:", error);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
