import { queryClient } from "@/context/QueryProvider";
import { getFeed, getFollowingFeed } from "@/services/communityService";
import { getConversations, getNotifications } from "@/lib/api";
import { getCurrentUserProfile } from "@/services/userService";

/**
 * Prefetch the community feed so data is ready before the user navigates
 * to the community tab. Errors are intentionally swallowed — prefetch
 * failures must never block the auth flow.
 */
export async function prefetchCommunityFeeds(token: string): Promise<void> {
  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["community-feed", "foryou"],
      queryFn: () => getFeed(20, 0, token),
      staleTime: 1000 * 60 * 2,
      initialPageParam: 0,
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ["community-feed", "following"],
      queryFn: () => getFollowingFeed(20, 0, token),
      staleTime: 1000 * 60 * 2,
      initialPageParam: 0,
    }),
  ]);
}

/**
 * Prefetch the authenticated user's profile for both clinician and member
 * query key shapes used across the app.
 */
export async function prefetchUserProfile(token: string): Promise<void> {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["user", "profile"],
      queryFn: () => getCurrentUserProfile(token),
      staleTime: 1000 * 60 * 5,
    }),
    queryClient.prefetchQuery({
      queryKey: ["member", "profile", token],
      queryFn: () => getCurrentUserProfile(token),
      staleTime: 1000 * 60 * 5,
    }),
  ]);
}

/**
 * Prefetch notifications so the badge count and list are ready immediately.
 */
export async function prefetchNotifications(token: string): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: ["notifications", "list", { limit: 20, offset: 0 }],
    queryFn: () => getNotifications(token, 20, 0),
    staleTime: 1000 * 60 * 1,
  });
}

/**
 * Prefetch conversations so the chat tab loads instantly.
 */
export async function prefetchConversations(token: string): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: ["chat", "conversations"],
    queryFn: () => getConversations(token),
    staleTime: 1000 * 60 * 1,
  });
}

/**
 * Run all prefetch operations in parallel after session hydration.
 * Individual failures are isolated — one failing prefetch does not
 * affect the others.
 */
export function prefetchAll(token: string): void {
  Promise.all([
    prefetchCommunityFeeds(token).catch(() => {}),
    prefetchUserProfile(token).catch(() => {}),
    prefetchNotifications(token).catch(() => {}),
    prefetchConversations(token).catch(() => {}),
  ]);
}