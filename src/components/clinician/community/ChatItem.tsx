import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface ChatItemProps {
  id: string;
  avatarUrl?: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  seen?: boolean;
  isGroup?: boolean;
}

export function ChatItem({
  id,
  avatarUrl,
  name,
  lastMessage,
  timestamp,
  unread,
  seen,
  isGroup,
}: ChatItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/(clinician)/(tabs)/community/chat/${id}`);
  };

  return (
    <TouchableOpacity 
      className="flex-row items-center px-5 py-3 border-b border-gray-100" 
      activeOpacity={0.7}
      onPress={handlePress}
    >

      {/* Avatar */}
      <View className="relative">
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="w-12 h-12 rounded-full" />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
            <Ionicons name="person" size={22} color="#6B7280" />
          </View>
        )}
        {isGroup && (
          <View className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full items-center justify-center">
            <Ionicons name="people" size={8} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-gray-900">{name}</Text>
          <Text className={`text-xs ${unread ? "text-blue-500 font-semibold" : "text-gray-400"}`}>
            {timestamp}
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-0.5">
          <Text className="text-sm text-gray-500 flex-1 mr-2" numberOfLines={1}>
            {lastMessage}
          </Text>
          <View className="flex-row items-center gap-1.5">
            {seen && !unread && (
              <Text className="text-xs text-gray-400">Seen</Text>
            )}
            {unread !== undefined && unread > 0 && (
              <View className="w-5 h-5 bg-gray-900 rounded-full items-center justify-center">
                <Text className="text-xs text-white font-semibold">{unread}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
