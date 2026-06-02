import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClinicianShell } from "@/components/ClinicianShell";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    text: "How can i help you",
    senderId: "receiver",
    timestamp: "10:00 AM",
  },
];

const MOCK_USER = {
  name: "janet",
  avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
  isVerified: true,
};

export default function CommunityChatConversation() {
  const { id: _id } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera permissions to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'], // Updated from MediaTypeOptions.All
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Captured media:", result.assets[0].uri);
      Alert.alert("Media Captured", `Captured: ${result.assets[0].type}`);
    }
  };

  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need gallery permissions to pick media.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'], // Updated from MediaTypeOptions.All
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Picked media:", result.assets[0].uri);
      Alert.alert("Media Selected", `Selected: ${result.assets[0].type}`);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === "me";
    return (
      <View className={`flex-row ${isMe ? "justify-end" : "justify-start"} mb-4 px-4`}>
        {!isMe && (
          <Image 
            source={{ uri: MOCK_USER.avatarUrl }} 
            className="w-8 h-8 rounded-full mr-2" 
            contentFit="cover"
          />
        )}
        <View 
          className={`max-w-[75%] p-3 rounded-2xl ${
            isMe 
              ? "bg-blue-600 rounded-tr-none" 
              : "bg-gray-100 rounded-tl-none"
          }`}
        >
          {item.mediaUrl && (
            <Image 
              source={{ uri: item.mediaUrl }} 
              className="w-full h-48 rounded-lg mb-2" 
              contentFit="cover"
            />
          )}
          <Text className={`text-sm ${isMe ? "text-white" : "text-gray-800"}`}>
            {item.text}
          </Text>
        </View>
        {isMe && (
          <Image 
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} 
            className="w-8 h-8 rounded-full ml-2" 
            contentFit="cover"
          />
        )}
      </View>
    );
  };

  return (
    <ClinicianShell showHeader={false} scrollable={false}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* User Profile Section */}
        <View className="items-center my-8">
          <Image 
            source={{ uri: MOCK_USER.avatarUrl }} 
            className="w-32 h-32 rounded-full mb-4" 
            contentFit="cover"
          />
          <View className="flex-row items-center gap-1">
            <Text className="text-2xl font-bold text-gray-900">{MOCK_USER.name}</Text>
            {MOCK_USER.isVerified && (
              <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
            )}
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          data={MOCK_MESSAGES}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 20 }}
          className="flex-1"
        />

        {/* Input Bar */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          className="px-4 pb-6 pt-2"
        >
          <View className="flex-row items-center gap-3 bg-white">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
              <TextInput 
                className="flex-1 h-10 text-gray-900" 
                placeholder="Type a message..." 
                value={message}
                onChangeText={setMessage}
              />
            </View>
            <TouchableOpacity 
              className="p-2" 
              onPress={handleCameraPress}
            >
              <Ionicons name="camera-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="p-2" 
              onPress={handleGalleryPress}
            >
              <Ionicons name="images-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ClinicianShell>
  );
}
