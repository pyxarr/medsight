import { useState, useMemo } from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AnalysisResults } from "@/components/member/AnalysisResults";
import { BannerCarousel } from "@/components/member/BannerCarousel";
import { HomeHeader } from "@/components/member/HomeHeader";
import { MemberDrawer } from "@/components/member/MemberDrawer";
import { QuickAccess } from "@/components/member/QuickAccess";
import { MemberShell } from "@/components/MemberShell";
import { useAuthStore } from "@/store/authStore";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const MOCK_BANNERS = [
  {
    id: "1",
    title: "Understanding DCIS Early stage Breast cancer",
    bg: "#9D6B9E",
  },
  {
    id: "2",
    title: "New screening guidelines for breast cancer",
    bg: "#5B8DAE",
  },
  {
    id: "3",
    title: "Nutrition tips during breast cancer treatment",
    bg: "#D2886E",
  },
];

const Home = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const user = useAuthStore((s) => s.user);
  const greeting = useMemo(() => getGreeting(), []);

  const firstName =
    (user?.user_metadata?.first_name as string) ||
    (user?.email?.split("@")[0]) ||
    "there";

  return (
    <View className="flex-1">
      <MemberShell theme="main" showHeader={false}>
        <HomeHeader onHamburgerPress={() => setDrawerVisible(true)} />
        <View className="px-5">
          <Text className="text-3xl">
            <Text className="text-gray-500">{greeting}, </Text>
            <Text className="font-bold text-gray-900">{firstName}</Text>
          </Text>

          <View className="flex-row items-center bg-white rounded-full px-4 py-1.5 mt-4 border border-gray-200 w-[60%]">
            <Ionicons name="search" size={16} color="#F9A8D4" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#F9A8D4"
              className="flex-1 ml-2 text-sm text-gray-900"
            />
          </View>

          <BannerCarousel banners={MOCK_BANNERS} />
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
