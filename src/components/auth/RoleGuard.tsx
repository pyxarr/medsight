import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: 'clinician' | 'member';
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { role, user, isLoading } = useAuthStore();

  if (isLoading) {
    return null; 
  }

  if (!role || role !== requiredRole) {
    return <Redirect href="/onboarding/role-selection" />;
  }

  if (user && !user.email_confirmed_at) {
    if (role === 'clinician') {
      return <Redirect href={`/(auth)/clinician/otp?email=${encodeURIComponent(user.email ?? '')}&flow=signup`} />;
    }
    return <Redirect href="/onboarding/role-selection" />;
  }

  if (user && (user.user_metadata?.acknowledged === false || user.user_metadata?.acknowledged === undefined)) {
    if (role === 'clinician') {
      return <Redirect href="/(auth)/clinician/acknowledge" />;
    }
    return <Redirect href="/onboarding/role-selection" />;
  }

  return <>{children}</>;
}
