import { Stack } from "expo-router";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function MemberLayout() {
  return (
    // <RoleGuard requiredRole="member">
      <Stack screenOptions={{ headerShown: false }} />
    // </RoleGuard>
  );
}
