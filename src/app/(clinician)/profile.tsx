import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "@/components/clinician/profile/ProfileHeader";
import { ProfileRow } from "@/components/clinician/profile/ProfileRow";
import { ProfileSection } from "@/components/clinician/profile/ProfileSection";

export default function Profile() {
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
            name="Dr. Micheal Scofield"
            handle="@Micheal_234"
            // onEditPress={() => console.log("edit profile")}
          />

          {/* Professional details */}
          <ProfileSection title="Professional details">
            <ProfileRow icon="person-outline"        label="Role"           onPress={() => {}} />
            <ProfileRow icon="business-outline"      label="Institution"    onPress={() => {}} />
            <ProfileRow icon="medical-outline"       label="Specialization" onPress={() => {}} />
            <ProfileRow icon="settings-outline"      label="Experience"     onPress={() => {}} />
            <ProfileRow icon="location-outline"      label="Location"       onPress={() => {}} />
          </ProfileSection>

          {/* Account */}
          <ProfileSection title="Account">
            <ProfileRow icon="mail-outline"     label="Email"    onPress={() => {}} />
            <ProfileRow icon="lock-closed-outline" label="Password" onPress={() => {}} />
          </ProfileSection>

          {/* Verification */}
          <ProfileSection title="Verification" badge={1}>
            <ProfileRow icon="mail-outline"        label="Email"                  onPress={() => {}} showDot />
            <ProfileRow icon="document-outline"    label="License document"       onPress={() => {}} />
            <ProfileRow icon="card-outline"        label="Medical license number" onPress={() => {}} />
          </ProfileSection>

          {/* Log out */}
          <View className="mx-5 mt-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="border border-gray-200 rounded-full py-4 items-center bg-white"
              // onPress={() => console.log("log out")}
            >
              <Text className="text-red-500 font-semibold text-base">Log out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}