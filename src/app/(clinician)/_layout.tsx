import { Stack } from "expo-router";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function ClinicianLayout() {
  return (
    <RoleGuard requiredRole="clinician">
      <Stack screenOptions={{ headerShown: false }} />
    </RoleGuard>
  );
}
