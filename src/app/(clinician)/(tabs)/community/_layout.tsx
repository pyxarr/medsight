import React, { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { CommunityLoadingScreen } from "@/components/clinician/community/CommunityLoadingScreen";

export default function CommunityLayout() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <CommunityLoadingScreen onAnimationComplete={() => setIsLoading(false)} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 250,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="profile/[id]"
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="post/[id]"
          options={{
            animation: "slide_from_right",
            animationDuration: 200,
          }}
        />
      </Stack>
    </View>
  );
}
