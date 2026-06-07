import { create } from "zustand";

interface OptimisticState {
  isLiked: boolean;
  isReposted: boolean;
  isBookmarked: boolean;
  likeCount: number;
  repostCount: number;
  bookmarkCount: number;
}

interface CommunityState {
  optimisticStates: Map<string, OptimisticState>;
  setOptimisticState: (postId: string, state: OptimisticState) => void;
  removeOptimisticState: (postId: string) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  optimisticStates: new Map(),

  setOptimisticState: (postId, state) => {
    set((prev) => {
      const newMap = new Map(prev.optimisticStates);
      newMap.set(postId, state);
      return { optimisticStates: newMap };
    });
  },

  removeOptimisticState: (postId) => {
    set((prev) => {
      const newMap = new Map(prev.optimisticStates);
      newMap.delete(postId);
      return { optimisticStates: newMap };
    });
  },
}));
