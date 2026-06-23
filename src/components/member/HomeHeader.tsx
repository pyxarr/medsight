import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HomeHeaderProps {
  onHamburgerPress: () => void;
}

export function HomeHeader({ onHamburgerPress }: HomeHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
      <TouchableOpacity
        onPress={onHamburgerPress}
        activeOpacity={0.7}
        className="w-10 h-10 rounded-full bg-white items-center justify-center"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <Ionicons name="reorder-three" size={20} color="#111827" />
      </TouchableOpacity>

      <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
        <Ionicons name="person" size={20} color="#6B7280" />
      </View>
    </View>
  );
}
