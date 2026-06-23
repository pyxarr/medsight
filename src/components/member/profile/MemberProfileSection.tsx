import { View, Text } from "react-native";

interface MemberProfileSectionProps {
  title: string;
  badge?: number;
  children: React.ReactNode;
  variant?: "default" | "muted";
}

export function MemberProfileSection({ title, badge, children, variant = "default" }: MemberProfileSectionProps) {
  return (
    <View className="mx-5 mb-6">
      <View className="flex-row items-center gap-2 mb-3">
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        {badge !== undefined && (
          <View className="w-5 h-5 rounded-full bg-red-500 items-center justify-center">
            <Text className="text-white text-xs font-bold">{badge}</Text>
          </View>
        )}
      </View>

      <View
        className={`rounded-2xl overflow-hidden divide-y divide-gray-100 ${
          variant === "muted" ? "bg-gray-50" : "bg-white"
        }`}
      >
        {children}
      </View>
    </View>
  );
}
