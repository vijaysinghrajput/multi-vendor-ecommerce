import React, { useEffect } from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setIsMobile, setSidebarOpen } from '../store/slices/uiSlice';
import AdminHeader from '../components/headers/AdminHeader';
import AdminFooter from '../components/layout/AdminFooter';
import AdminSidebar from '../components/sidebar/AdminSidebar';
import LoadingOverlay from '../components/common/LoadingOverlay';
import NotificationSnackbar from '../components/common/NotificationSnackbar';

const AdminLayout = ({
  children,
  showFooter = true,
  containerMaxWidth = 'xl',
  fullWidth = false,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    sidebarOpen,
    loading,
    notifications,
  } = useSelector((state) => state.ui);

  // Update mobile state in Redux
  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [isMobile, dispatch]);

  const sidebarWidth = 240; // Open sidebar width
  const collapsedWidth = 60; // Collapsed sidebar width
  const headerHeight = 64;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Admin Header */}
      <AdminHeader />

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          pt: `${headerHeight}px`,
        }}
      >
        {/* Admin Sidebar */}
        <AdminSidebar
          open={sidebarOpen}
          width={sidebarWidth}
          collapsedWidth={collapsedWidth}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: '#f8fafc',
            minHeight: `calc(100vh - ${headerHeight}px)`,
            // Smooth transitions for sidebar state changes
            transition: theme.transitions.create(['margin-left'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
            // Dynamic positioning - reduced margin
            marginLeft: {
              xs: 0, // Mobile: no sidebar shift
              sm: 0, // Small tablet: no shift
              md: isMobile ? 0 : (sidebarOpen ? `${sidebarWidth}px` : `${collapsedWidth}px`), // Desktop: sidebar aware
            },
            overflow: 'auto',
            // Direct padding on main instead of nested container
            px: {
              xs: 2, // Mobile: 16px
              sm: 3, // Tablet: 24px
              md: 3, // Desktop: consistent 24px
              lg: 4, // Large: 32px
            },
            py: {
              xs: 2, // Mobile: 16px top/bottom
              sm: 3, // Tablet: 24px
              md: 3, // Desktop: 24px
            },
          }}
        >
          {/* Content wrapper with max width and centering */}
          <Box
            sx={{
              maxWidth: {
                xs: '100%',
                sm: '100%', 
                md: '100%',
                lg: '1400px', // Reasonable max width
                xl: '1600px',
              },
              mx: 'auto', // Center content
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, sm: 3 },
              // Enhanced card styling
              '& .MuiCard-root': {
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              },
              '& .MuiCardContent-root': {
                padding: { xs: 2, sm: 3 },
                '&:last-child': {
                  paddingBottom: { xs: 2, sm: 3 },
                },
              },
              // Grid improvements
              '& .MuiGrid-container': {
                '& .MuiGrid-item': {
                  display: 'flex',
                  '& > *': {
                    width: '100%',
                  },
                },
              },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>

      {/* Admin Footer */}
      {showFooter && <AdminFooter />}

      {/* Global Components */}
      <LoadingOverlay open={loading.global} />
      
      {/* Notifications */}
      {notifications.map((notification) => (
        <NotificationSnackbar
          key={notification.id}
          notification={notification}
        />
      ))}
    </Box>
  );
};

export default AdminLayout;