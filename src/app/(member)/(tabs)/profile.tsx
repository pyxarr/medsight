import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { MemberProfileHeader } from "@/components/member/profile/MemberProfileHeader";
import { MemberProfileRow } from "@/components/member/profile/MemberProfileRow";
import { MemberProfileSection } from "@/components/member/profile/MemberProfileSection";
import { MemberShell } from "@/components/MemberShell";
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
import { ApiError, getCurrentUserProfile, uploadAvatar } from "@/services/userService";
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const clearSession = useAuthStore((state) => state.clearSession);
  const token = useAuthStore((state) => state.session?.access_token);
  const session = useAuthStore((state) => state.session);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["member", "profile", token],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }

      return await getCurrentUserProfile(token);
    },
    enabled: !!token,
  });

  const emailConfirmed = !!session?.user?.email_confirmed_at;

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
      queryClient.setQueryData(["member", "profile", token], updated);
      queryClient.invalidateQueries({ queryKey: ["community-feed"] });
    } catch (error) {
      if (__DEV__) console.error("Avatar upload error:", error);
      Alert.alert("Upload failed", avatarUploadErrorMessage(error));
    } finally {
      setIsAvatarUploading(false);
    }
  };

  if (!token) {
    return (
      <MemberShell theme="main" scrollable={false} showHeader={false}>
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-gray-400 text-sm">Sign in to view your profile.</Text>
        </View>
      </MemberShell>
    );
  }

const handleLogout = async () => {
    setIsLoggingOut(true);
    setConfirmLogoutVisible(false);
    try {
      await signOut();
      clearSession();
      queryClient.clear();
      router.replace("/(auth)/member/sign-in");
    } catch (error) {
      Alert.alert("Logout failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <MemberShell theme="main" scrollable={false} showHeader={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-xl font-bold text-gray-900 text-center pt-4 pb-2">
          Profile
        </Text>

        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator color="#DB2777" />
          </View>
        ) : null}

<MemberProfileHeader
          name={profile?.display_name ?? "Loading..."}
          handle={profile?.username ? `@${profile.username}` : "Loading..."}
          avatarUrl={profile?.avatar_url ?? undefined}
          onEditPress={() => router.push("/(member)/edit-profile")}
          onAvatarPress={handleAvatarPress}
          isAvatarUploading={isAvatarUploading}
        />

        <MemberProfileSection title="Account">
          <MemberProfileRow icon="person-outline" label={profile?.display_name ?? "Display name"} />
          <MemberProfileRow icon="at-outline" label={profile?.username ? `@${profile.username}` : "Username"} />
<MemberProfileRow icon="mail-outline" label={profile?.email ?? "Email"} />
          <MemberProfileRow
            icon="lock-closed-outline"
            label="Password"
            onPress={() => router.push("/(member)/change-password")}
          />
        </MemberProfileSection>

<MemberProfileSection
          title="Verification"
          badge={emailConfirmed ? undefined : 1}
          variant="muted"
        >
          <MemberProfileRow
            icon="mail-outline"
            label={emailConfirmed ? "Email verified" : "Email not verified"}
            showDot={!emailConfirmed}
          />
        </MemberProfileSection>

<View className="mx-5 mt-2 gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            className="border border-gray-300 rounded-full py-4 items-center bg-white"
            onPress={() => setConfirmLogoutVisible(true)}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#DB2777" />
            ) : (
              <Text className="text-[#DB2777] font-semibold text-base">Log out</Text>
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
    </MemberShell>
  );
}
