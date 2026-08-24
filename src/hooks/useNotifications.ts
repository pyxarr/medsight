import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (limit: number, offset: number) => ["notifications", "list", { limit, offset }] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export function useNotifications(limit = 20, offset = 0) {
  const token = useAuthStore((state) => state.session?.access_token);

  return useQuery({
    queryKey: notificationQueryKeys.list(limit, offset),
    queryFn: () => {
      if (!token) throw new Error("Unauthenticated");
      return getNotifications(token, limit, offset);
    },
    enabled: !!token,
  });
}

export function useUnreadNotificationCount() {
  const token = useAuthStore((state) => state.session?.access_token);

  return useQuery({
    queryKey: notificationQueryKeys.unreadCount,
    queryFn: () => {
      if (!token) throw new Error("Unauthenticated");
      return getUnreadNotificationCount(token);
    },
    enabled: !!token,
    refetchInterval: 30_000,
  });
}

export function useMarkAllNotificationsRead() {
  const token = useAuthStore((state) => state.session?.access_token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Unauthenticated");
      return markAllNotificationsRead(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export function useMarkNotificationRead() {
  const token = useAuthStore((state) => state.session?.access_token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!token) throw new Error("Unauthenticated");
      return markNotificationRead(token, notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}
