import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ClinicianShell } from "@/components/ClinicianShell";
import { CommunityHeader } from "@/components/clinician/community/CommunityHeader";
import { PostCard } from "@/components/clinician/community/PostCard";

interface Post {
  id: string;
  author: { name: string; handle: string; avatarUrl?: string };
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  reposts: number;
  riskScore?: number;
  following?: boolean;
}

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: { name: "Mary jane", handle: "@mary_23" },
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
    likes: 29,
    comments: 2,
    reposts: 10,
    riskScore: 100,
    following: true,
  },
  {
    id: "2",
    author: { name: "Sarah Connor", handle: "@sarah_c" },
    content: "Early detection saved my life. Don't skip your screenings, ladies. Sharing my story to help others take action.",
    likes: 142,
    comments: 18,
    reposts: 56,
    riskScore: 75,
    following: false,
  },
  {
    id: "3",
    author: { name: "Mary jane", handle: "@mary_23" },
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
    imageUrl: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=600&h=400&fit=crop",
    likes: 29,
    comments: 2,
    reposts: 10,
    riskScore: 100,
    following: true,
  },
  {
    id: "4",
    author: { name: "Dr. Emily Chen", handle: "@dr_emily" },
    content: "New research shows that lifestyle changes can significantly reduce breast cancer risk. Here's what you need to know about prevention strategies.",
    likes: 89,
    comments: 12,
    reposts: 34,
    riskScore: 60,
    following: false,
  },
  {
    id: "5",
    author: { name: "Lisa Thompson", handle: "@lisa_t" },
    content: "Just got my results back - all clear! So grateful for the support from this community during my waiting period.",
    likes: 201,
    comments: 45,
    reposts: 12,
    riskScore: 15,
    following: true,
  },
];

export default function CommunityFeed() {
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");

  const filteredPosts = activeTab === "following"
    ? MOCK_POSTS.filter((post) => post.following)
    : MOCK_POSTS;

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <FlatList
        ListHeaderComponent={
          <>
            <CommunityHeader />
            <View className="px-5 pt-2 pb-4">
              <View className="flex-row items-center justify-center gap-6 border-b border-gray-100">
              <TouchableOpacity
                onPress={() => setActiveTab("foryou")}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-base pb-2 ${
                    activeTab === "foryou"
                      ? "font-semibold text-gray-900 border-b-2 border-blue-500"
                      : "text-gray-400"
                  }`}
                >
                  For you
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-300 text-base pb-2">|</Text>
              <TouchableOpacity
                onPress={() => setActiveTab("following")}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-base pb-2 ${
                    activeTab === "following"
                      ? "font-semibold text-gray-900 border-b-2 border-blue-500"
                      : "text-gray-400"
                  }`}
                >
                  Following
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          </>
        }
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard {...item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </ClinicianShell>
  );
}
