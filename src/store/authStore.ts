import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

/**
 * State shape for the authentication store.
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  role: "clinician" | "member" | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Global store for managing authentication state across the application.
 * Role is derived from the user's metadata provided by Supabase.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  isLoading: true,

  setSession: (session) => {
    const user = session?.user ?? null;
    const role = (user?.user_metadata?.role as "clinician" | "member") ?? null;

    set({
      session,
      user,
      role,
      isLoading: false,
    });
  },

  clearSession: () => {
    set({
      user: null,
      session: null,
      role: null,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));
