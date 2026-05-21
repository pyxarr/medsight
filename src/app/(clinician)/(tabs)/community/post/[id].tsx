import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CommentItem } from "@/components/clinician/community/CommentItem";
import { PostCard } from "@/components/clinician/community/PostCard";
import { ClinicianShell } from "@/components/ClinicianShell";

const MOCK_POST = {
  id: "1",
  author: { name: "Mary jane", handle: "@mary_23" },
  content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
  imageUrl: "https://images.unsplash.com/photo-1516733968668-dbdce39c4651?w=600&h=400&fit=crop",
  likes: 29,
  comments: 2,
  reposts: 10,
  riskScore: 100,
  timestamp: "9:50pm. 5/11/2026",
};

const MOCK_COMMENTS = [
  {
    id: "c1",
    author: { name: "maya" },
    content: "i'll get back to you on that",
    timestamp: "33m",
    likes: 29,
    comments: 2,
    reposts: 10,
  },
  {
    id: "c2",
    author: { name: "maya" },
    content: "i'll get back to you on that",
    timestamp: "33m",
    likes: 29,
    comments: 2,
    reposts: 10,
  },
  {
    id: "c3",
    author: { name: "maya" },
    content: "i'll get back to you on that",
    timestamp: "33m",
    likes: 29,
    comments: 2,
    reposts: 10,
  },
  {
    id: "c4",
    author: { name: "maya" },
    content: "i'll get back to you on that",
    timestamp: "33m",
    likes: 29,
    comments: 2,
    reposts: 10,
  },
  {
    id: "c5",
    author: { name: "maya" },
    content: "i'll get back to you on that",
    timestamp: "33m",
    likes: 29,
    comments: 2,
    reposts: 10,
  },
];

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ClinicianShell scrollable={false} showHeader={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="items-center py-4">
          <Text className="text-xl font-semibold text-gray-900">Post</Text>
        </View>

        <View className="px-5">
          <PostCard {...MOCK_POST} />
        </View>

        <View className="mt-2">
          {MOCK_COMMENTS.map((comment) => (
            <CommentItem key={comment.id} {...comment} />
          ))}
        </View>
      </ScrollView>
    </ClinicianShell>
  );
}
