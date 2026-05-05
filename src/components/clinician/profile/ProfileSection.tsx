import { View, Text } from "react-native";

interface ProfileSectionProps {
  title: string;
  badge?: number;
  children: React.ReactNode;
}

export function ProfileSection({ title, badge, children }: ProfileSectionProps) {
  return (
    <View className="mx-5 mb-6">
      {/* Section title */}
      <View className="flex-row items-center gap-2 mb-3">
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        {badge !== undefined && (
          <View className="w-5 h-5 rounded-full bg-blue-600 items-center justify-center">
            <Text className="text-white text-xs font-bold">{badge}</Text>
          </View>
        )}
      </View>

      {/* Card */}
      <View className="bg-gray-50 rounded-2xl overflow-hidden divide-y divide-gray-100">
        {children}
      </View>
    </View>
  );
}