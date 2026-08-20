import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

interface ProfileHeaderProps {
  name: string;
  handle: string;
  avatarUrl?: string;
  verified?: boolean;
  onEditPress?: () => void;
  onAvatarPress?: () => void;
  isAvatarUploading?: boolean;
}

export function ProfileHeader({
  name,
  handle,
  avatarUrl,
  verified = false,
  onEditPress,
  onAvatarPress,
  isAvatarUploading = false,
}: ProfileHeaderProps) {
  return (
    <View className="items-center pt-4 pb-6">
      {/* Avatar */}
      <TouchableOpacity
        onPress={onAvatarPress}
        disabled={isAvatarUploading || !onAvatarPress}
        activeOpacity={0.8}
        className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4"
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: 96, height: 96 }}
            contentFit="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="person" size={40} color="#9CA3AF" />
          </View>
        )}
        {isAvatarUploading && (
          <View className="absolute inset-0 items-center justify-center bg-black/40">
            <ActivityIndicator color="white" />
          </View>
        )}
      </TouchableOpacity>

      {/* Name + verified badge */}
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-xl font-bold text-gray-900">{name}</Text>
        {verified && <Ionicons name="checkmark-circle" size={20} color="#2563EB" />}
      </View>

      {/* Handle */}
      <Text className="text-sm text-gray-400 mb-4">{handle}</Text>

      {/* Edit profile button */}
      <TouchableOpacity
        onPress={onEditPress}
        activeOpacity={0.8}
        className="flex-row items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-full"
      >
        <Ionicons name="create-outline" size={16} color="white" />
        <Text className="text-white text-sm font-semibold">Edit profile</Text>
      </TouchableOpacity>
    </View>
  );
}