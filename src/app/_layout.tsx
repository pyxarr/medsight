import "../../global.css";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DevSitemapFab } from "@/components/DevSitemapFab";

import QueryProvider from "@/context/QueryProvider";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const { isLoading, setSession } = useAuthStore();

  useEffect(() => {
    // Initial session hydration
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error hydrating auth session:", error);
        setSession(null);
      }
    }

    initAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <QueryProvider>
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
    </QueryProvider>
  );
}
