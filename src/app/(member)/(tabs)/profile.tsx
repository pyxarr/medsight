import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { MemberProfileHeader } from "@/components/member/profile/MemberProfileHeader";
import { MemberProfileRow } from "@/components/member/profile/MemberProfileRow";
import { MemberProfileSection } from "@/components/member/profile/MemberProfileSection";
import { MemberShell } from "@/components/MemberShell";

const MOCK_USER = {
  display_name: "Mary Jane",
  username: "@Maryl_234",
};

export default function Profile() {
  return (
    <MemberShell theme="main" scrollable={false} showHeader={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-xl font-bold text-gray-900 text-center pt-4 pb-2">
          Profile
        </Text>

        <MemberProfileHeader
          name={MOCK_USER.display_name}
          handle={MOCK_USER.username}
        />

        <MemberProfileSection title="Account">
          <MemberProfileRow icon="person-outline" label="Display name" />
          <MemberProfileRow icon="at-outline" label="Username" />
          <MemberProfileRow icon="mail-outline" label="Email" />
          <MemberProfileRow icon="lock-closed-outline" label="Password" />
        </MemberProfileSection>

        <MemberProfileSection title="Verification" badge={1} variant="muted">
          <MemberProfileRow icon="mail-outline" label="Email" showDot />
        </MemberProfileSection>

        <View className="mx-5 mt-2 gap-3">
          <TouchableOpacity
            activeOpacity={0.8}
            className="border border-gray-300 rounded-full py-4 items-center bg-white"
          >
            <Text className="text-[#DB2777] font-semibold text-base">Log out</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} className="items-center py-2">
            <Text className="text-red-500 text-sm">Delete account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </MemberShell>
  );
}
