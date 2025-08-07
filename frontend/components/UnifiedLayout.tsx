import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AdminLayout from '../layouts/AdminLayout';
import Layout from './Layout';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const router = useRouter();
  
  // Get user info from Redux store
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Route detection logic
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isVendorRoute = router.pathname.startsWith('/vendor');
  const isUserDashboardRoute = router.pathname.startsWith('/user') || router.pathname.startsWith('/customer');
  const isAuthRoute = router.pathname.startsWith('/login') || router.pathname.startsWith('/register') || router.pathname.startsWith('/auth');
  
  // Auth pages (login, register) - minimal layout
  if (isAuthRoute) {
    return <>{children}</>;
  }
  
  // Admin routes use AdminLayout
  if (isAdminRoute) {
    return (
      <AdminLayout 
        fullWidth={true}
        showFooter={true}
        containerMaxWidth="xl"
      >
        {children}
      </AdminLayout>
    );
  }
  
  // Vendor routes use AdminLayout (similar dashboard interface)
  if (isVendorRoute) {
    return (
      <AdminLayout 
        fullWidth={true}
        showFooter={true}
        containerMaxWidth="xl"
      >
        {children}
      </AdminLayout>
    );
  }
  
  // User dashboard routes use AdminLayout (clean dashboard interface)  
  if (isUserDashboardRoute) {
    return (
      <AdminLayout 
        fullWidth={true}
        showFooter={true}
        containerMaxWidth="xl"
      >
        {children}
      </AdminLayout>
    );
  }
  
  // All other routes (public pages, home, product pages, etc.) use regular Layout
  return (
    <Layout 
      showFooter={true}
      containerMaxWidth="xl"
      fullWidth={false}
    >
      {children}
    </Layout>
  );
};

export default UnifiedLayout;