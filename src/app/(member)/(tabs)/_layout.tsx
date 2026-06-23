import { View, TouchableOpacity, Text, Platform } from "react-native";
import { Tabs, useSegments } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "expo-router/js-tabs";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const segments = useSegments();
  const isNonTabScreen = segments.some(
    (s) => s === "report" || s === "batch-results" || s === "community"
  );

  if (isNonTabScreen) return null;

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
          community: "Community",
          history: "Explore",
          profile: "Profile",
        };
        const label = labelMap[route.name] ?? options.title ?? route.name;
        const color = isFocused ? "#DB2777" : "#9CA3AF";

        const renderIcon = () => {
          switch (route.name) {
            case "index":
              return <Ionicons name={isFocused ? "home" : "home-outline"} size={24} color={color} />;
            case "community":
              return <MaterialCommunityIcons name={isFocused ? "account-group" : "account-group-outline"} size={24} color={color} />;
            case "explore":
              return <MaterialCommunityIcons name="navigation" size={24} color={color} />;
            case "profile":
              return <Ionicons name={isFocused ? "person-circle" : "person-circle-outline"} size={24} color={color} />;
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
                overflow: "hidden",
                backgroundColor: isFocused ? "#F3F4F6" : "transparent",
                gap: 2,
              }}
            >
              {renderIcon()}
              <Text style={{ fontSize: 12, color }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MemberLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="community" options={{ title: "Community" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}