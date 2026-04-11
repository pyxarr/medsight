import { Stack } from 'expo-router';

export default function ClinicianLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'default',
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen 
        name="sign-in" 
        options={{
          animation: 'fade',
          animationDuration: 250,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="sign-up" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 300,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 300,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="otp" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 300,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="new-password" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 300,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="password" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 300,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="acknowledge" 
        options={{
          animation: 'slide_from_right',
          animationDuration: 300,
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}