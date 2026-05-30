import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClinicianShell } from "@/components/ClinicianShell";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface NotificationData {
  id: string;
  type: "grouped" | "single";
  actionType: "follow" | "like" | "repost" | "reply";
  users: User[];
  message?: string;
  content?: string;
  time?: string;
  metrics?: {
    likes: number;
    comments: number;
    reposts: number;
  };
}

const MOCK_NOTIFICATIONS: NotificationData[] = [
  {
    id: "1",
    type: "grouped",
    actionType: "follow",
    users: [
      { id: "u1", name: "Ashley", avatar: "https://i.pravatar.cc/150?u=u1" },
      { id: "u2", name: "User 2", avatar: "https://i.pravatar.cc/150?u=u2" },
      { id: "u3", name: "User 3", avatar: "https://i.pravatar.cc/150?u=u3" },
      { id: "u4", name: "User 4", avatar: "https://i.pravatar.cc/150?u=u4" },
      { id: "u5", name: "User 5", avatar: "https://i.pravatar.cc/150?u=u5" },
    ],
    message: "Ashley and 3 others followed you",
  },
  {
    id: "2",
    type: "grouped",
    actionType: "like",
    users: [
      { id: "u1", name: "Ashley", avatar: "https://i.pravatar.cc/150?u=u1" },
      { id: "u2", name: "User 2", avatar: "https://i.pravatar.cc/150?u=u2" },
      { id: "u3", name: "User 3", avatar: "https://i.pravatar.cc/150?u=u3" },
      { id: "u4", name: "User 4", avatar: "https://i.pravatar.cc/150?u=u4" },
      { id: "u5", name: "User 5", avatar: "https://i.pravatar.cc/150?u=u5" },
    ],
    message: "Ashley and 3 others liked your post",
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
  },
  {
    id: "3",
    type: "grouped",
    actionType: "repost",
    users: [
      { id: "u1", name: "Ashley", avatar: "https://i.pravatar.cc/150?u=u1" },
      { id: "u2", name: "User 2", avatar: "https://i.pravatar.cc/150?u=u2" },
      { id: "u3", name: "User 3", avatar: "https://i.pravatar.cc/150?u=u3" },
      { id: "u4", name: "User 4", avatar: "https://i.pravatar.cc/150?u=u4" },
      { id: "u5", name: "User 5", avatar: "https://i.pravatar.cc/150?u=u5" },
    ],
    message: "Ashley and 3 others liked your post",
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
  },
  {
    id: "4",
    type: "single",
    actionType: "reply",
    users: [{ id: "u6", name: "maya", avatar: "https://i.pravatar.cc/150?u=u6" }],
    time: "33m",
    message: "Replied to your post",
    content: "i'll get back to you on that",
    metrics: { likes: 29, comments: 2, reposts: 10 },
  },
  {
    id: "5",
    type: "single",
    actionType: "reply",
    users: [{ id: "u6", name: "maya", avatar: "https://i.pravatar.cc/150?u=u6" }],
    time: "33m",
    message: "Replied to your post",
    content: "i'll get back to you on that",
    metrics: { likes: 29, comments: 2, reposts: 10 },
  },
  {
    id: "6",
    type: "single",
    actionType: "reply",
    users: [{ id: "u6", name: "maya", avatar: "https://i.pravatar.cc/150?u=u6" }],
    time: "33m",
    message: "Replied to your post",
    content: "i'll get back to you on that",
    metrics: { likes: 29, comments: 2, reposts: 10 },
  },
];

const GroupedNotification = ({ item }: { item: NotificationData }) => {
  const getIcon = () => {
    switch (item.actionType) {
      case "follow": return <Ionicons name="person-outline" size={22} color="#6B7280" />;
      case "like": return <Ionicons name="thumbs-up-outline" size={22} color="#6B7280" />;
      case "repost": return <Ionicons name="repeat-outline" size={22} color="#6B7280" />;
      default: return null;
    }
  };

  return (
    <View className="flex-row px-5 py-4 border-b border-gray-100 items-start">
      <View className="w-6 mr-3 mt-1">{getIcon()}</View>
      <View className="flex-1">
        <View className="flex-row -space-x-3 mb-2">
          {item.users.map((user, index) => (
            <Image
              key={user.id}
              source={{ uri: user.avatar }}
              className="w-8 h-8 rounded-full border-2 border-white"
              style={{ marginLeft: index === 0 ? 0 : -12 }}
            />
          ))}
        </View>
        <Text className="text-sm text-gray-700 leading-5">
          {item.message}
        </Text>
        {item.content && (
          <Text className="text-sm text-gray-500 mt-1 leading-5" numberOfLines={2}>
            {item.content}
          </Text>
        )}
      </View>
    </View>
  );
};

const SingleNotification = ({ item }: { item: NotificationData }) => {
  const user = item.users[0];
  return (
    <View className="px-5 py-4 border-b border-gray-100">
      <View className="flex-row">
        <Image
          source={{ uri: user.avatar }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row items-baseline">
            <Text className="text-sm font-semibold text-gray-900 mr-2">{user.name}</Text>
            <Text className="text-xs text-gray-400">{item.time}</Text>
          </View>
          <Text className="text-sm text-gray-600">{item.message}</Text>
          <Text className="text-sm text-gray-800 mt-1">{item.content}</Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between mt-3 px-1">
        <View className="flex-row items-center gap-6">
          <TouchableOpacity className="flex-row items-center gap-1">
            <Ionicons name="thumbs-up-outline" size={16} color="#6B7280" />
            <Text className="text-xs text-gray-500">{item.metrics?.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
            <Text className="text-xs text-gray-500">{item.metrics?.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-1">
            <Ionicons name="repeat-outline" size={16} color="#6B7280" />
            <Text className="text-xs text-gray-500">{item.metrics?.reposts}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function NotificationsScreen() {
  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1">
        <View className="py-4 items-center border-b border-gray-100">
          <Text className="text-xl font-semibold text-gray-900">Notifications</Text>
        </View>
        <FlatList
          data={MOCK_NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (item.type === "grouped") return <GroupedNotification item={item} />;
            return <SingleNotification item={item} />;
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ClinicianShell>
  );
}
