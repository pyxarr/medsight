import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: 'clinician' | 'member';
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { role, isLoading } = useAuthStore();

  if (isLoading) {
    return null; 
  }

  if (!role || role !== requiredRole) {
    return <Redirect href="/onboarding/role-selection" />;
  }

  return <>{children}</>;
}
