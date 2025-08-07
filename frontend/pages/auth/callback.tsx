import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Card,
  CardContent,
} from '@mui/material';

const AuthCallback: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const provider = urlParams.get('provider') || 'google';

        if (error) {
          setError(`Authentication failed: ${error}`);
          setIsProcessing(false);
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setIsProcessing(false);
          return;
        }

        // Exchange code for tokens
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/social/${provider}/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            redirectUri: window.location.origin + '/auth/callback',
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store user data and redirect to customer dashboard
          localStorage.setItem('userToken', data.access_token);
          localStorage.setItem('userData', JSON.stringify({
            ...data.user,
            role: 'user'
          }));

          // Redirect to customer dashboard
          router.push('/user/dashboard');
        } else {
          setError(data.message || 'Social login failed');
          setIsProcessing(false);
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        setError('Network error during authentication');
        setIsProcessing(false);
      }
    };

    // Only process if we have query parameters
    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router]);

  // Redirect to login after error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        router.push('/login/user');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          {isProcessing ? (
            <>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Processing Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we complete your login...
              </Typography>
            </>
          ) : (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Redirecting to login page in 3 seconds...
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthCallback;