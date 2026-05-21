import { View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function CommunityHeader() {
  return (
    <View className="flex-row items-center justify-between px-1 pt-4 pb-4">
      {/* Left: User avatar placeholder */}
      <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center">
        <Ionicons name="person" size={18} color="#6B7280" />
      </View>

      <Image
        source={require("@/assets/images/logo-1.png")}
        className="w-9 h-9"
      />

      {/* Right: Spacer for symmetry */}
      <View className="w-9" />
    </View>
  );
}
