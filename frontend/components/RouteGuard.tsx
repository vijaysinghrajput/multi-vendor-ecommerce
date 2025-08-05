import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';
import { isAuthenticated, getUserData, getLoginRoute, hasRouteAccess, getDashboardRoute } from '../utils/auth';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole: 'user' | 'vendor' | 'admin';
  fallbackRoute?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredRole, 
  fallbackRoute 
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated for the required role
      if (!isAuthenticated(requiredRole)) {
        console.log(`RouteGuard: User not authenticated for role: ${requiredRole}`);
        // Not authenticated for this role, redirect to login
        const loginRoute = fallbackRoute || getLoginRoute(requiredRole);
        router.replace(loginRoute);
        return;
      }

      // Get user data to verify role access
      const userData = getUserData(requiredRole);
      if (!userData) {
        console.log(`RouteGuard: No user data found for role: ${requiredRole}`);
        // No user data found, redirect to login
        const loginRoute = fallbackRoute || getLoginRoute(requiredRole);
        router.replace(loginRoute);
        return;
      }

      // Check if user has access to this route
      if (!hasRouteAccess(userData.role, requiredRole)) {
        console.log(`RouteGuard: User role ${userData.role} doesn't have access to ${requiredRole}`);
        // User doesn't have access, redirect to their appropriate dashboard
        const userDashboard = getDashboardRoute(userData.role);
        router.replace(userDashboard);
        return;
      }

      console.log(`RouteGuard: User authorized for role: ${requiredRole}`);
      // User is authorized
      setIsAuthorized(true);
      setIsLoading(false);
    };

    // Only run auth check on client side
    if (router.isReady) {
      // Add a small delay to ensure localStorage is updated
      const timeoutId = setTimeout(checkAuth, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [router, requiredRole, fallbackRoute]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Verifying access...
        </Typography>
      </Box>
    );
  }

  // Only render children if user is authorized
  return isAuthorized ? <>{children}</> : null;
};



export default RouteGuard;

// Higher-order component for easier usage
export const withRouteGuard = (
  WrappedComponent: React.ComponentType<any>,
  requiredRole: 'user' | 'vendor' | 'admin',
  fallbackRoute?: string
) => {
  const GuardedComponent = (props: any) => (
    <RouteGuard requiredRole={requiredRole} fallbackRoute={fallbackRoute}>
      <WrappedComponent {...props} />
    </RouteGuard>
  );

  GuardedComponent.displayName = `withRouteGuard(${WrappedComponent.displayName || WrappedComponent.name})`;

  return GuardedComponent;
};

// Specific guards for each role
export const withUserGuard = (WrappedComponent: React.ComponentType<any>) =>
  withRouteGuard(WrappedComponent, 'user');

export const withVendorGuard = (WrappedComponent: React.ComponentType<any>) =>
  withRouteGuard(WrappedComponent, 'vendor');

export const withAdminGuard = (WrappedComponent: React.ComponentType<any>) =>
  withRouteGuard(WrappedComponent, 'admin');

// Alias for customer (which is user role)
export const withCustomerGuard = (WrappedComponent: React.ComponentType<any>) =>
  withRouteGuard(WrappedComponent, 'user');