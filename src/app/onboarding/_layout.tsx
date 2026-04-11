import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{
          animation: 'fade',
          animationDuration: 500,
        }}
      />
      <Stack.Screen 
        name="role-selection" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 600,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}