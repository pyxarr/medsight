import { Button } from "@/components/ui/button";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>

      <Button className="bg-red-600">
        <Text className="text-white">Button</Text>
      </Button>
    </View>
  );
}

