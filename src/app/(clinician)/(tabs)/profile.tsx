import { useState } from "react";
import { Alert, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "@/components/clinician/profile/ProfileHeader";
import { ProfileRow } from "@/components/clinician/profile/ProfileRow";
import { ProfileSection } from "@/components/clinician/profile/ProfileSection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { queryClient } from "@/context/QueryProvider";
import { signOut } from "@/lib/auth";
import { getCurrentUserProfile, ApiError, uploadAvatar } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

function avatarUploadErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) return "Please select a valid image file.";
    if (error.status === 413) return "Image must be under 5MB.";
  }
  return "Upload failed. Please try again.";
}

export default function Profile() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const { session } = useAuthStore();
  const token = session?.access_token;
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token available");
      return await getCurrentUserProfile(token);
    },
    enabled: !!token,
  });

  const emailConfirmed = !!session?.user?.email_confirmed_at;

  const isFullyVerified =
    profile?.role === "clinician" &&
    profile?.is_verified === true &&
    !!profile?.medical_licence_number &&
    emailConfirmed;

  const handleAvatarPress = async () => {
    if (!token) return;

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library so you can choose a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) return;

    const asset = result.assets[0];

    if (asset.fileSize !== undefined && asset.fileSize > MAX_AVATAR_BYTES) {
      Alert.alert("Image too large", "Image must be under 5MB.");
      return;
    }

    setIsAvatarUploading(true);
    try {
      const updated = await uploadAvatar(
        {
          uri: asset.uri,
          name: asset.fileName || `avatar_${Date.now()}.jpg`,
          mimeType: asset.mimeType || "image/jpeg",
        },
        token
      );
      queryClient.setQueryData(["user", "profile"], updated);
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    } catch (error) {
      if (__DEV__) console.error("Avatar upload error:", error);
      Alert.alert("Upload failed", avatarUploadErrorMessage(error));
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setConfirmLogoutVisible(false);
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
            avatarUrl={profile?.avatar_url ?? undefined}
            verified={isFullyVerified}
            onEditPress={() => router.push("/(clinician)/edit-profile")}
            onAvatarPress={handleAvatarPress}
            isAvatarUploading={isAvatarUploading}
          />

          {/* Professional details */}
          <ProfileSection title="Professional details">
            <ProfileRow icon="business-outline"      label={profile?.institution ?? "Not set"} />
            <ProfileRow icon="medical-outline"       label={profile?.specialisation ?? "Not set"} />
            <ProfileRow icon="settings-outline"      label={`${profile?.experience_years ?? 0} years`} />
            <ProfileRow icon="location-outline"      label={profile?.location ?? "Not set"} />
          </ProfileSection>

          {/* Account */}
          <ProfileSection title="Account">
            <ProfileRow icon="mail-outline"     label={profile?.email ?? "Not set"} />
            <ProfileRow icon="lock-closed-outline" label="Password" onPress={() => router.push("/(clinician)/change-password")} />
          </ProfileSection>

          {/* Verification */}
          <ProfileSection title="Verification" badge={isFullyVerified ? undefined : 1}>
            <ProfileRow
              icon="mail-outline"
              label="Email"
              trailing={
                emailConfirmed ? (
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                    <Text className="text-xs font-medium text-green-600">Verified</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="close-circle" size={16} color="#DC2626" />
                    <Text className="text-xs font-medium text-red-500">Not verified</Text>
                  </View>
                )
              }
            />
            {isFullyVerified ? (
              <>
                <ProfileRow
                  icon="shield-checkmark-outline"
                  label="Verification"
                  trailing={
                    <View className="flex-row items-center gap-1.5">
                      <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                      <Text className="text-xs font-medium text-green-600">Verified</Text>
                    </View>
                  }
                />
                <ProfileRow
                  icon="card-outline"
                  label={profile?.medical_licence_number ?? "Not set"}
                />
              </>
            ) : profile?.medical_licence_number ? (
              <ProfileRow
                icon="shield-checkmark-outline"
                label="Verification"
                trailing={
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="time-outline" size={16} color="#D97706" />
                    <Text className="text-xs font-medium text-amber-600">In review</Text>
                  </View>
                }
              />
            ) : (
              <ProfileRow
                icon="shield-checkmark-outline"
                label="Complete verification"
                onPress={() => router.push("/(clinician)/verification")}
              />
            )}
          </ProfileSection>

          {/* Log out */}
          <View className="mx-5 mt-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="border border-gray-200 rounded-full py-4 items-center bg-white"
              onPress={() => setConfirmLogoutVisible(true)}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <ActivityIndicator color="#EF4444" />
              ) : (
                <Text className="text-red-500 font-semibold text-base">Log out</Text>
              )}
            </TouchableOpacity>
          </View>

          <Dialog open={confirmLogoutVisible} onOpenChange={setConfirmLogoutVisible}>
            <DialogContent className="items-center gap-3 rounded-3xl pt-4">
              <View className="items-center gap-2 w-full">
                <DialogTitle className="text-xl font-semibold text-center text-[#030712]">
                  Log out?
                </DialogTitle>
                <DialogDescription className="text-center text-gray-500 text-sm leading-5">
                  You will need to sign in again to access your account.
                </DialogDescription>
              </View>

              <DialogFooter className="flex-row w-full gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white border-gray-200 rounded-2xl"
                  onPress={() => setConfirmLogoutVisible(false)}
                >
                  <Text className="text-gray-700 font-medium text-base text-center">Cancel</Text>
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 bg-red-500 rounded-2xl"
                  onPress={handleLogout}
                >
                  <Text className="text-white font-semibold text-base text-center">Log out</Text>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
