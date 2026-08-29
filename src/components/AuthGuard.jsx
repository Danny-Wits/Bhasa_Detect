import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { useProfile } from '../hooks/useProfile';
import { Loader, Center } from '@mantine/core';

export default function AuthGuard() {
  const { user, loading: authLoading } = useAuth();
  const { isProfileComplete, loading: profileLoading } = useProfile();
  const location = useLocation();

  if (authLoading || profileLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isProfileComplete() && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (isProfileComplete() && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
