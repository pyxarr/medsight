import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CommunitySearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function CommunitySearchBar({ value, onChangeText, placeholder = "Search" }: CommunitySearchBarProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 8,
        marginHorizontal: 20,
        marginBottom: 16,
      }}
    >
      <Ionicons name="search-outline" size={18} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={{ flex: 1, fontSize: 14, color: "#111827" }}
      />
    </View>
  );
}
