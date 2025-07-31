import React, { useEffect } from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { setIsMobile } from '../store/slices/uiSlice';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import VendorSidebar from '../components/sidebar/VendorSidebar';
import LoadingOverlay from '../components/common/LoadingOverlay';
import NotificationSnackbar from '../components/common/NotificationSnackbar';
import CookieConsent from '../components/common/CookieConsent';
import PWAInstallBanner from '../components/common/PWAInstallBanner';
import ScrollToTop from '../components/common/ScrollToTop';

const VendorLayout = ({
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

  const sidebarWidth = 280;
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
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          pt: `${headerHeight}px`,
        }}
      >
        {/* Vendor Sidebar */}
        <VendorSidebar
          open={sidebarOpen}
          width={sidebarWidth}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            ml: !isMobile && sidebarOpen ? `${sidebarWidth}px` : 0,
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            minHeight: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          {fullWidth ? (
            <Box sx={{ flex: 1 }}>
              {children}
            </Box>
          ) : (
            <Container
              maxWidth={containerMaxWidth}
              sx={{
                flex: 1,
                py: 3,
                px: { xs: 2, sm: 3 },
              }}
            >
              {children}
            </Container>
          )}
        </Box>
      </Box>

      {/* Footer */}
      {showFooter && <Footer />}

      {/* Global Components */}
      <LoadingOverlay open={loading.global} />
      
      {/* Notifications */}
      {notifications.map((notification) => (
        <NotificationSnackbar
          key={notification.id}
          notification={notification}
        />
      ))}

      {/* Cookie Consent */}
      <CookieConsent />

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Scroll to Top */}
      <ScrollToTop />
    </Box>
  );
};

export default VendorLayout;