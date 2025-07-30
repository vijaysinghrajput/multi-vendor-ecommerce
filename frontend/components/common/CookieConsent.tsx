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
import { Close, Cookie } from '@mui/icons-material';

const CookieConsent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Show consent banner after a short delay
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    // Initialize analytics and other tracking here
    console.log('Cookies accepted - Initialize tracking');
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
    // Disable non-essential cookies
    console.log('Cookies declined - Disable tracking');
  };

  const handleClose = () => {
    setShowConsent(false);
    // Set a temporary flag to show again later
    sessionStorage.setItem('cookieConsentDismissed', 'true');
  };

  if (!showConsent) {
    return null;
  }

  return (
    <Slide direction="up" in={showConsent} mountOnEnter unmountOnExit>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 0 : 20,
          left: isMobile ? 0 : 20,
          right: isMobile ? 0 : 20,
          zIndex: theme.zIndex.snackbar,
          p: 3,
          borderRadius: isMobile ? 0 : 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          maxWidth: isMobile ? '100%' : 600,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Cookie Icon */}
          <Cookie
            sx={{
              color: theme.palette.primary.main,
              fontSize: 24,
              mt: 0.5,
              flexShrink: 0,
            }}
          />

          {/* Content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              We use cookies
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              We use cookies to enhance your browsing experience, serve personalized
              content, and analyze our traffic. By clicking "Accept All", you consent
              to our use of cookies.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: isMobile ? 'column' : 'row',
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                onClick={handleAccept}
                size="small"
                sx={{ minWidth: isMobile ? '100%' : 120 }}
              >
                Accept All
              </Button>
              <Button
                variant="outlined"
                onClick={handleDecline}
                size="small"
                sx={{ minWidth: isMobile ? '100%' : 120 }}
              >
                Decline
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{ minWidth: isMobile ? '100%' : 'auto' }}
                href="/privacy"
              >
                Learn More
              </Button>
            </Box>
          </Box>

          {/* Close Button */}
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary,
              flexShrink: 0,
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Slide>
  );
};

export default CookieConsent;