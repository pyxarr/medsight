import React, { useState } from "react";
import { View, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { CommunitySearchBar } from "@/components/clinician/community/CommunitySearchBar";
import { PostCard } from "@/components/clinician/community/PostCard";
import { ClinicianShell } from "@/components/ClinicianShell";
import type { CommunityPost } from "@/types/community";

const MOCK_BOOKMARKS: CommunityPost[] = [
  {
    id: "b1",
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
    created_at: new Date().toISOString(),
    media_url: "",
    view_count: 100,
    author: {
      id: "u1",
      display_name: "janet",
      username: "janet_23",
      avatar_url: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "Clinician",
      is_verified: true,
    },
    reaction_counts: {
      like_count: 29,
      reply_count: 2,
      repost_count: 10,
      bookmark_count: 100,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: true,
    },
  },
  {
    id: "b2",
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
    created_at: new Date().toISOString(),
    media_url: "",
    view_count: 100,
    author: {
      id: "u1",
      display_name: "janet",
      username: "janet_23",
      avatar_url: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "Clinician",
      is_verified: true,
    },
    reaction_counts: {
      like_count: 29,
      reply_count: 2,
      repost_count: 10,
      bookmark_count: 100,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: true,
    },
  },
  {
    id: "b3",
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
    created_at: new Date().toISOString(),
    media_url: "",
    view_count: 100,
    author: {
      id: "u1",
      display_name: "janet",
      username: "janet_23",
      avatar_url: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "Clinician",
      is_verified: true,
    },
    reaction_counts: {
      like_count: 29,
      reply_count: 2,
      repost_count: 10,
      bookmark_count: 100,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: true,
    },
  },
  {
    id: "b4",
    content: "Still learning, still healing, still hopeful. Taking my breast health journey one day at a time",
    created_at: new Date().toISOString(),
    media_url: "",
    view_count: 100,
    author: {
      id: "u1",
      display_name: "janet",
      username: "janet_23",
      avatar_url: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "Clinician",
      is_verified: true,
    },
    reaction_counts: {
      like_count: 29,
      reply_count: 2,
      repost_count: 10,
      bookmark_count: 100,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: true,
    },
  },
];

const BookmarksScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = MOCK_BOOKMARKS.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1">
        <FlashList
          data={filteredBookmarks}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="pt-6 pb-4">
              <Text className="text-3xl font-semibold text-center text-gray-900 mb-6">
                Bookmarks
              </Text>
              <CommunitySearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          }
          renderItem={({ item }) => (
            <View className="px-4">
              <PostCard 
                post={item} 
                isBookmarkedOverride={true} 
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </ClinicianShell>
  );
};

export default BookmarksScreen;
