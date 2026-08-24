import { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getUnreadNotificationCount } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { BottomTabBarProps } from "expo-router/js-tabs";

function CommunityTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const token = useAuthStore((state) => state.session?.access_token);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadUnreadCount = async () => {
      if (!token) {
        if (active) setUnreadCount(0);
        return;
      }

      try {
        const result = await getUnreadNotificationCount(token);
        if (active) setUnreadCount(result.unread_count);
      } catch {
        if (active) setUnreadCount(0);
      }
    };

    void loadUnreadCount();
    const timer = setInterval(() => {
      void loadUnreadCount();
    }, 30000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [token]);

  const onPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        height: Platform.OS === "ios" ? 80 : 70,
        paddingBottom: Platform.OS === "ios" ? 20 : 10,
        paddingTop: 10,
        paddingHorizontal: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const labelMap: Record<string, string> = {
          index: "Home",
          search: "Search",
          chat: "Chat",
          notifications: "Notifications",
        };
        const label = labelMap[route.name] ?? options.title ?? route.name;
        const color = isFocused ? "#2563EB" : "#9CA3AF";

        const renderIcon = () => {
          switch (route.name) {
            case "home":
              return <Ionicons name={isFocused ? "home" : "home-outline"} size={24} color={color} />;
            case "search":
              return <Ionicons name={isFocused ? "search" : "search-outline"} size={24} color={color} />;
            case "chat":
              return <Ionicons name={isFocused ? "chatbubble" : "chatbubble-outline"} size={24} color={color} />;
            case "notifications":
              return <Ionicons name={isFocused ? "notifications" : "notifications-outline"} size={24} color={color} />;
            default:
              return null;
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => onPress(route, isFocused)}
            activeOpacity={0.7}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 16,
                overflow: "visible",
                backgroundColor: isFocused ? "#F3F4F6" : "transparent",
                gap: 2,
              }}
            >
              <View style={{ position: "relative", alignItems: "center", justifyContent: "center" }}>
                {renderIcon()}
                {route.name === "notifications" && unreadCount > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -12,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: "#EF4444",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#FFFFFF", fontWeight: "700" }}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ fontSize: 10, color }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function CommunityTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CommunityTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="notifications" options={{ title: "Notifications" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
    </Tabs>
  );
}
