import { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "@/components/clinician/profile/ProfileHeader";
import { ProfileRow } from "@/components/clinician/profile/ProfileRow";
import { ProfileSection } from "@/components/clinician/profile/ProfileSection";
import { queryClient } from "@/context/QueryProvider";
import { signOut } from "@/lib/auth";
import { getCurrentUserProfile } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

export default function Profile() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const { session } = useAuthStore();
  const token = session?.access_token;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token available");
      return await getCurrentUserProfile(token);
    },
    enabled: !!token,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      clearSession();
      queryClient.clear();
      router.replace("/(auth)/clinician/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <LinearGradient
      colors={["#E5F1FF", "#FFFFFF"]}
      locations={[0, 0.2]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Page title */}
          <Text className="text-xl font-bold text-gray-900 text-center pt-4 pb-2">
            Profile
          </Text>

          {/* Header */}
          <ProfileHeader
            name={profile?.display_name ?? "Loading..."}
            handle={profile?.username ? `@${profile.username}` : "Loading..."}
          />

          {/* Professional details */}
          <ProfileSection title="Professional details">
            <ProfileRow icon="person-outline"        label="Role"           onPress={() => {}} />
            <ProfileRow icon="business-outline"      label={profile?.institution ?? "Not set"} onPress={() => {}} />
            <ProfileRow icon="medical-outline"       label={profile?.specialisation ?? "Not set"} onPress={() => {}} />
            <ProfileRow icon="settings-outline"      label={`${profile?.experience_years ?? 0} years`} onPress={() => {}} />
            <ProfileRow icon="location-outline"      label={profile?.location ?? "Not set"} onPress={() => {}} />
          </ProfileSection>

          {/* Account */}
          <ProfileSection title="Account">
            <ProfileRow icon="mail-outline"     label={profile?.email ?? "Not set"} onPress={() => {}} />
            <ProfileRow icon="lock-closed-outline" label="Password" onPress={() => {}} />
          </ProfileSection>

          {/* Verification */}
          <ProfileSection title="Verification" badge={profile?.is_verified ? undefined : 1}>
            <ProfileRow icon="mail-outline"        label="Email"                  onPress={() => {}} showDot={!profile?.is_verified} />
            <ProfileRow icon="document-outline"    label="License document"       onPress={() => {}} />
            <ProfileRow icon="card-outline"        label="Medical license number" onPress={() => {}} />
          </ProfileSection>

          {/* Log out */}
          <View className="mx-5 mt-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="border border-gray-200 rounded-full py-4 items-center bg-white"
              onPress={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <ActivityIndicator color="#EF4444" />
              ) : (
                <Text className="text-red-500 font-semibold text-base">Log out</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
