import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CommunityHeaderProps {
  onAvatarPress: () => void;
  role?: "member" | "clinician";
  avatarUrl?: string;
}

const LOGOS = {
  member: require("@/assets/images/logo-3.png"),
  clinician: require("@/assets/images/logo-1.png"),
} as const;

export function CommunityHeader({
  onAvatarPress,
  role = "clinician",
  avatarUrl,
}: CommunityHeaderProps) {
  return (
    <View className="px-1 pt-4 pb-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onAvatarPress}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 items-center justify-center"
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <Ionicons name="person" size={18} color="#6B7280" />
          )}
        </TouchableOpacity>

        <Image
          source={LOGOS[role]}
          className="w-9 h-9"
        />

        <View className="w-9" />
      </View>
    </View>
  );
}