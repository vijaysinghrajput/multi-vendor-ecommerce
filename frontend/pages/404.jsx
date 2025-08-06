import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import {
  Error as ErrorIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';

const NotFoundPage = () => {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push('/admin/dashboard');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '400px'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          maxWidth: 500
        }}
      >
        {/* Error Icon */}
        <Box sx={{ mb: 3 }}>
          <ErrorIcon
            sx={{
              fontSize: 80,
              color: 'error.main',
              opacity: 0.8
            }}
          />
        </Box>

        {/* Error Code */}
        <Typography
          variant="h1"
          sx={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: 'primary.main',
            lineHeight: 1,
            mb: 1
          }}
        >
          404
        </Typography>

        {/* Error Message */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            mb: 2,
            fontSize: '1.8rem'
          }}
        >
          Oops! Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6 }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        {/* Action Button */}
        <Button
          variant="contained"
          size="large"
          startIcon={<DashboardIcon />}
          onClick={handleBackToDashboard}
          sx={{
            px: 3,
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;