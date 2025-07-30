import React, { useEffect } from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setIsMobile } from '../../store/slices/uiSlice';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import LoadingOverlay from '../common/LoadingOverlay';
import NotificationSnackbar from '../common/NotificationSnackbar';
import CookieConsent from '../common/CookieConsent';
import PWAInstallBanner from '../common/PWAInstallBanner';
import ScrollToTop from '../common/ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
  showMobileBottomNav?: boolean;
  containerMaxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
}

const Layout = ({
  children,
  showSidebar = false,
  showFooter = true,
  showMobileBottomNav = true,
  containerMaxWidth = 'lg',
  fullWidth = false,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const {
    sidebarOpen,
    loading,
    notifications,
  } = useSelector((state: RootState) => state.ui);

  // Update mobile state in Redux
  useEffect(() => {
    dispatch(setIsMobile(isMobile));
  }, [isMobile, dispatch]);

  const sidebarWidth = 280;
  const headerHeight = 64;
  const mobileBottomNavHeight = 56;

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
          pb: isMobile && showMobileBottomNav ? `${mobileBottomNavHeight}px` : 0,
        }}
      >
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            open={sidebarOpen}
            width={sidebarWidth}
            isMobile={isMobile}
          />
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            ml: showSidebar && !isMobile && sidebarOpen ? `${sidebarWidth}px` : 0,
            transition: theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            minHeight: `calc(100vh - ${headerHeight}px - ${
              isMobile && showMobileBottomNav ? mobileBottomNavHeight : 0
            }px)`,
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

      {/* Mobile Bottom Navigation */}
      {isMobile && showMobileBottomNav && <MobileBottomNav />}

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

export default Layout;