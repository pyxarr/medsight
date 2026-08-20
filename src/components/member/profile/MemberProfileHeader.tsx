import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

interface MemberProfileHeaderProps {
  name: string;
  handle: string;
  avatarUrl?: string;
  onEditPress?: () => void;
  onAvatarPress?: () => void;
  isAvatarUploading?: boolean;
}

export function MemberProfileHeader({
  name,
  handle,
  avatarUrl,
  onEditPress,
  onAvatarPress,
  isAvatarUploading = false,
}: MemberProfileHeaderProps) {
  return (
    <View className="items-center pt-4 pb-6">
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

      <Text className="text-xl font-bold text-gray-900 mb-1">{name}</Text>

      <Text className="text-sm text-gray-400 mb-4">{handle}</Text>

      <TouchableOpacity
        onPress={onEditPress}
        activeOpacity={0.8}
        className="flex-row items-center gap-2 bg-[#DB2777] px-5 py-2.5 rounded-full"
      >
        <Ionicons name="create-outline" size={16} color="white" />
        <Text className="text-white text-sm font-semibold">Edit profile</Text>
      </TouchableOpacity>
    </View>
  );
}
