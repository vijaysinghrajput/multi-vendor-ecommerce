import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress, Skeleton } from '@mui/material';
import AdminLayout from '../components/AdminLayout';

// Lazy load components for code splitting
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const AllVendors = React.lazy(() => import('../pages/VendorManagement/AllVendors'));
const VendorApplications = React.lazy(() => import('../pages/VendorManagement/VendorApplications'));
const VendorPayouts = React.lazy(() => import('../pages/VendorManagement/VendorPayouts'));
const CommissionSettings = React.lazy(() => import('../pages/VendorManagement/CommissionSettings'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Loading component
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      flexDirection: 'column',
      gap: 2
    }}
  >
    <CircularProgress size={40} />
    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
      Loading page...
    </Box>
  </Box>
);

// Skeleton loader for faster perceived loading
const PageSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Skeleton variant="rectangular" width="23%" height={120} />
      <Skeleton variant="rectangular" width="23%" height={120} />
      <Skeleton variant="rectangular" width="23%" height={120} />
      <Skeleton variant="rectangular" width="23%" height={120} />
    </Box>
    <Skeleton variant="rectangular" width="100%" height={300} />
  </Box>
);

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        {/* Dashboard */}
        <Route 
          index 
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          } 
        />
        
        {/* Vendor Management Routes */}
        <Route 
          path="vendors" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <AllVendors />
            </Suspense>
          } 
        />
        <Route 
          path="vendors/applications" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <VendorApplications />
            </Suspense>
          } 
        />
        <Route 
          path="vendors/payouts" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <VendorPayouts />
            </Suspense>
          } 
        />
        <Route 
          path="vendors/commissions" 
          element={
            <Suspense fallback={<PageSkeleton />}>
              <CommissionSettings />
            </Suspense>
          } 
        />
        
        {/* Placeholder routes for future implementation */}
        <Route 
          path="products" 
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <h2>Product Management</h2>
              <p>Coming soon...</p>
            </Box>
          } 
        />
        <Route 
          path="orders" 
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <h2>Order Management</h2>
              <p>Coming soon...</p>
            </Box>
          } 
        />
        <Route 
          path="customers" 
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <h2>Customer Management</h2>
              <p>Coming soon...</p>
            </Box>
          } 
        />
        <Route 
          path="reports" 
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <h2>Financial Reports</h2>
              <p>Coming soon...</p>
            </Box>
          } 
        />
        <Route 
          path="marketing" 
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <h2>Marketing & Promotions</h2>
              <p>Coming soon...</p>
            </Box>
          } 
        />
        <Route 
          path="reviews" 
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <h2>Reviews & Ratings</h2>
              <p>Coming soon...</p>
            </Box>
          } 
        />
        <Route 
          path="support" 
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <h2>Support Center</h2>
              <p>Coming soon...</p>
            </Box>
          } 
        />
        <Route 
          path="settings" 
          element={
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <h2>System Settings</h2>
              <p>Coming soon...</p>
            </Box>
          } 
        />
        
        {/* 404 Not Found */}
        <Route 
          path="*" 
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;