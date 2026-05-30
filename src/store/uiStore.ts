import { create } from "zustand";

interface UIStore {
  isInCommunity: boolean;
  setIsInCommunity: (value: boolean) => void;
  isCommunityLoading: boolean;
  setIsCommunityLoading: (value: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isInCommunity: false,
  setIsInCommunity: (value) => set({ isInCommunity: value }),
  isCommunityLoading: false,
  setIsCommunityLoading: (value) => set({ isCommunityLoading: value }),
}));