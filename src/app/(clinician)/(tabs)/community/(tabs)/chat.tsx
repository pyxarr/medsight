import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ChatItem } from "@/components/clinician/community/ChatItem";
import { CommunitySearchBar } from "@/components/clinician/community/CommunitySearchBar";
import { ClinicianShell } from "@/components/ClinicianShell";

type FilterType = "recents" | "unread";

interface Chat {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  seen?: boolean;
  isGroup?: boolean;
}

const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    name: "maya",
    lastMessage: "i'll get back to you on that",
    timestamp: "10:20am",
    seen: true,
  },
  {
    id: "2",
    name: "rita",
    lastMessage: "We need to move to the next stage of the....",
    timestamp: "5:30pm",
    seen: true,
  },
  {
    id: "3",
    name: "Greg",
    lastMessage: "good day sir",
    timestamp: "2:39pm",
    unread: 5,
  },
  {
    id: "4",
    name: "group",
    lastMessage: "you guys are the best",
    timestamp: "3:19pm",
    unread: 10,
    isGroup: true,
  },
  {
    id: "5",
    name: "Darlene",
    lastMessage: "ok doctor",
    timestamp: "2:10am",
    unread: 1,
  },
  {
    id: "6",
    name: "Angie",
    lastMessage: "Are you sure",
    timestamp: "2:10am",
    seen: true,
  },
  {
    id: "7",
    name: "rose",
    lastMessage: "Results will be out soon",
    timestamp: "03/01/26",
    seen: true,
  },
];

export default function CommunityChat() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("recents");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = activeFilter === "unread"
    ? MOCK_CHATS.filter((chat) => chat.unread && chat.unread > 0)
    : MOCK_CHATS;

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <View className="flex-1">
        {/* Header */}
        <View className="items-center py-4">
          <Text className="text-xl font-semibold text-gray-900">Chats</Text>
        </View>

        {/* Search bar */}
        <CommunitySearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search chats"
        />

        {/* Filter pills */}
        <View className="flex-row items-center gap-2 px-5 mb-2">
          <TouchableOpacity
            className={`px-4 py-1.5 rounded-full ${
              activeFilter === "recents" ? "bg-blue-500" : "bg-gray-100"
            }`}
            onPress={() => setActiveFilter("recents")}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                activeFilter === "recents" ? "text-white" : "text-gray-600"
              }`}
            >
              Recents
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-1.5 rounded-full ${
              activeFilter === "unread" ? "bg-blue-500" : "bg-gray-100"
            }`}
            onPress={() => setActiveFilter("unread")}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-medium ${
                activeFilter === "unread" ? "text-white" : "text-gray-600"
              }`}
            >
              Unread
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat list */}
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem {...item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ClinicianShell>
  );
}
