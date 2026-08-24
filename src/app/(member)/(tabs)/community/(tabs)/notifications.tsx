import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MemberShell } from "@/components/MemberShell";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";
import type { NotificationResponse } from "@/lib/api";
import { getNotificationUserAvatar, getNotificationUserName, stackNotifications } from "@/lib/notifications";

const COMMUNITY_PREFIX = "/(member)/(tabs)/community";

function formatRelativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

function notificationIcon(actionType: NotificationResponse["actionType"]) {
  switch (actionType) {
    case "follow":
      return <Ionicons name="person-outline" size={22} color="#6B7280" />;
    case "like":
      return <Ionicons name="thumbs-up-outline" size={22} color="#6B7280" />;
    case "repost":
      return <Ionicons name="repeat-outline" size={22} color="#6B7280" />;
    case "reply":
      return <Ionicons name="chatbubble-outline" size={22} color="#6B7280" />;
    case "message":
      return <Ionicons name="chatbubble-ellipses-outline" size={22} color="#6B7280" />;
    default:
      return null;
  }
}

function NotificationRow({
  item,
  onPress,
}: {
  item: NotificationResponse;
  onPress: () => void;
}) {
  const primaryUser = item.users[0];
  const primaryName = getNotificationUserName(primaryUser);
  const primaryAvatar = getNotificationUserAvatar(primaryUser);
  const timeLabel = item.time ?? formatRelativeTime(item.created_at);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className={`px-5 py-4 border-b border-gray-100 ${item.is_read ? "bg-transparent" : "bg-blue-50/40"}`}>
        {item.type === "grouped" ? (
          <View className="flex-row items-start">
            <View className="w-6 mr-3 mt-1">{notificationIcon(item.actionType)}</View>
            <View className="flex-1">
              <View className="flex-row -space-x-3 mb-2">
                {item.users.map((user, index) => (
                  <View
                    key={`${item.id}-${user.id}-${index}`}
                    style={{ marginLeft: index === 0 ? 0 : -12 }}
                  >
                    <Image
                      source={{ uri: getNotificationUserAvatar(user) ?? undefined }}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  </View>
                ))}
              </View>
              <Text className="text-sm text-gray-700 leading-5">{item.message}</Text>
              {item.content ? (
                <Text className="text-sm text-gray-500 mt-1 leading-5" numberOfLines={2}>
                  {item.content}
                </Text>
              ) : null}
            </View>
            {!item.is_read ? <View className="ml-3 mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
          </View>
        ) : (
          <View>
              <View className="flex-row">
              {primaryAvatar ? (
                <Image source={{ uri: primaryAvatar }} className="w-12 h-12 rounded-full mr-3" />
              ) : (
                <View className="w-12 h-12 rounded-full mr-3 bg-gray-200 items-center justify-center">
                  <Ionicons name="person" size={20} color="#9CA3AF" />
                </View>
              )}
              <View className="flex-1">
                <View className="flex-row items-baseline">
                  <Text className="text-sm font-semibold text-gray-900 mr-2">
                    {primaryName}
                  </Text>
                  <Text className="text-xs text-gray-400">{timeLabel}</Text>
                </View>
                <Text className="text-sm text-gray-600">{item.message}</Text>
                {item.content ? <Text className="text-sm text-gray-800 mt-1">{item.content}</Text> : null}
              </View>
            </View>

            {item.metrics ? (
              <View className="flex-row items-center justify-between mt-3 px-1">
                <View className="flex-row items-center gap-6">
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Ionicons name="thumbs-up-outline" size={16} color="#6B7280" />
                    <Text className="text-xs text-gray-500">{item.metrics.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                    <Text className="text-xs text-gray-500">{item.metrics.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Ionicons name="repeat-outline" size={16} color="#6B7280" />
                    <Text className="text-xs text-gray-500">{item.metrics.reposts}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity>
                  <Ionicons name="bookmark-outline" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            ) : null}

            {!item.is_read ? <View className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-blue-600" /> : null}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const notificationsQuery = useNotifications();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const markOneReadMutation = useMarkNotificationRead();
  const markedAllReadRef = useRef(false);
  const isFocusedRef = useRef(false);

  const notifications = useMemo(
    () => stackNotifications(notificationsQuery.data?.results ?? []),
    [notificationsQuery.data?.results],
  );

  useFocusEffect(
    React.useCallback(() => {
      isFocusedRef.current = true;
      return () => {
        isFocusedRef.current = false;
        markedAllReadRef.current = false;
      };
    }, []),
  );

  useEffect(() => {
    if (!isFocusedRef.current) return;

    const hasUnread = notificationsQuery.data?.results.some((notification) => !notification.is_read) ?? false;
    if (!hasUnread || markedAllReadRef.current) return;

    markedAllReadRef.current = true;
    markAllReadMutation.mutate();
  }, [notificationsQuery.data, markAllReadMutation]);

  const handlePress = (item: NotificationResponse) => {
    if (!item.is_read) {
      markOneReadMutation.mutate(item.id);
    }

    if (item.conversation_id) {
      router.push(`${COMMUNITY_PREFIX}/chat/${item.conversation_id}` as any);
      return;
    }

    if (item.post_id) {
      router.push(`${COMMUNITY_PREFIX}/post/${item.post_id}` as any);
    }
  };

  if (notificationsQuery.isLoading) {
    return (
      <MemberShell showHeader={false} scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#DB2777" />
        </View>
      </MemberShell>
    );
  }

  if (notificationsQuery.isError) {
    return (
      <MemberShell showHeader={false} scrollable={false}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-500">Failed to load notifications.</Text>
        </View>
      </MemberShell>
    );
  }

  return (
    <MemberShell showHeader={false} scrollable={false}>
      <View className="flex-1">
        <View className="py-4 items-center border-b border-gray-100">
          <Text className="text-xl font-semibold text-gray-900">Notifications</Text>
        </View>
        <FlatList
          data={notifications}
          keyExtractor={(item) => `${item.id}-${item.created_at}`}
          renderItem={({ item }) => <NotificationRow key={`${item.id}-${item.created_at}`} item={item} onPress={() => handlePress(item)} />}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500">No notifications yet</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </MemberShell>
  );
}
