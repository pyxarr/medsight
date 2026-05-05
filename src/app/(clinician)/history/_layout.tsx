import { Stack } from "expo-router";

export default function HistoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: "fade" }} />
      <Stack.Screen name="report/[id]" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}