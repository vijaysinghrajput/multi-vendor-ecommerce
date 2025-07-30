import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Slide,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  GetApp,
  PhoneIphone,
} from '@mui/icons-material';
import { installPWA, isIOS, isAndroid } from '../../utils/pwa';

const PWAInstallBanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if PWA is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const hasBeenDismissed = localStorage.getItem('pwaInstallDismissed');
    
    if (isInstalled || hasBeenDismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // Show banner for iOS devices (manual installation)
    if (isIOS() && !isInstalled) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Show banner for Android devices with install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Use the deferred prompt for supported browsers
      await installPWA();
      setDeferredPrompt(null);
      setShowBanner(false);
    } else if (isIOS()) {
      // Show iOS installation instructions
      alert(
        'To install this app on your iOS device, tap the Share button and then "Add to Home Screen"'
      );
    } else {
      // Fallback for other browsers
      alert(
        'To install this app, look for the install option in your browser menu or address bar'
      );
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwaInstallDismissed', 'true');
  };

  const handleClose = () => {
    setShowBanner(false);
    // Set session storage to not show again in this session
    sessionStorage.setItem('pwaInstallDismissedSession', 'true');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 70 : 20, // Account for mobile bottom nav
          left: isMobile ? 10 : 20,
          right: isMobile ? 10 : 20,
          zIndex: theme.zIndex.snackbar - 1,
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          maxWidth: isMobile ? '100%' : 400,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* App Icon */}
          <PhoneIphone
            sx={{
              fontSize: 32,
              flexShrink: 0,
            }}
          />

          {/* Content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Install Our App
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Get the full experience with our mobile app. Fast, reliable, and works offline!
            </Typography>
          </Box>

          {/* Close Button */}
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: 'inherit',
              flexShrink: 0,
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 2,
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="text"
            size="small"
            onClick={handleDismiss}
            sx={{
              color: 'inherit',
              opacity: 0.8,
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            Not Now
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleInstall}
            startIcon={<GetApp />}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.grey[100],
              },
            }}
          >
            Install
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
};

export default PWAInstallBanner;