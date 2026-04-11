import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      {/* Nested routes are handled by clinician/_layout.tsx and member/_layout.tsx */}
    </Stack>
  );
}