import { useState, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { AnalysisResults } from "@/components/member/AnalysisResults";
import { BannerCarousel } from "@/components/member/BannerCarousel";
import { HomeHeader } from "@/components/member/HomeHeader";
import { MemberDrawer } from "@/components/member/MemberDrawer";
import { QuickAccess } from "@/components/member/QuickAccess";
import { MemberShell } from "@/components/MemberShell";
import { ARTICLES } from "@/features/explore";
import { getCurrentUserProfile } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const Home = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.session?.access_token);
  const greeting = useMemo(() => getGreeting(), []);

  const { data: profile } = useQuery({
    queryKey: ["member", "profile", token],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token available");
      return await getCurrentUserProfile(token);
    },
    enabled: !!token,
  });

  const firstName =
    (user?.user_metadata?.first_name as string) ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader
          onHamburgerPress={() => setDrawerVisible(true)}
          avatarUrl={profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? user?.user_metadata?.avatar ?? null}
        />
        <View className="px-5">
          <Text className="text-3xl">
            <Text className="text-gray-500">{greeting}, </Text>
            <Text className="font-bold text-gray-900">{firstName}</Text>
          </Text>

          <Pressable
            onPress={() => router.push("/(member)/explore/search" as any)}
            className="flex-row items-center bg-white rounded-full px-4 py-1.5 mt-4 border border-gray-200 w-[60%]"
          >
            <Ionicons name="search" size={16} color="#F9A8D4" />
            <Text className="flex-1 ml-2 text-sm text-[#F9A8D4]">Search articles, books, videos...</Text>
          </Pressable>

          {/* <View className="flex-row items-center justify-between px-5 mb-3">
            <Text className="text-lg font-bold text-gray-900">
              Featured Articles
            </Text>
          </View> */}

          <BannerCarousel articles={ARTICLES} />
          <QuickAccess />
          <View className="mt-6">
            <AnalysisResults maxItems={2} />
          </View>
        </View>
      </MemberShell>
      <MemberDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </View>
  );
};

export default Home;
