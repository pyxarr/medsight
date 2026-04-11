import "../../global.css";
import { View } from "react-native";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DevSitemapFab } from "@/components/DevSitemapFab";

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#fff" },
          }}
        />
        {__DEV__ && <DevSitemapFab />}
      </View>
      <PortalHost />
    </GestureHandlerRootView>
  );
}
