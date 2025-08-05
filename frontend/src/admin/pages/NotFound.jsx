import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme
} from '@mui/material';
import {
  Home,
  ArrowBack,
  ErrorOutline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoToDashboard = () => {
    navigate('/admin');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
            maxWidth: 500,
            width: '100%'
          }}
        >
          {/* Error Icon */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <ErrorOutline
              sx={{
                fontSize: 120,
                color: theme.palette.error.main,
                opacity: 0.8
              }}
            />
          </Box>

          {/* 404 Text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', sm: '6rem' },
              fontWeight: 'bold',
              color: theme.palette.error.main,
              mb: 2,
              lineHeight: 1
            }}
          >
            404
          </Typography>

          {/* Error Message */}
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 2,
              color: theme.palette.text.primary
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            This admin page does not exist. The page you're looking for might have been moved, deleted, or you entered the wrong URL.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={handleGoToDashboard}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                minWidth: { xs: '100%', sm: 'auto' }
              }}
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                minWidth: { xs: '100%', sm: 'auto' }
              }}
            >
              Go Back
            </Button>
          </Box>

          {/* Additional Help Text */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 4,
              display: 'block',
              fontSize: '0.9rem'
            }}
          >
            If you believe this is an error, please contact the system administrator.
          </Typography>
        </Paper>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            opacity: 0.1,
            zIndex: -1,
            display: { xs: 'none', md: 'block' }
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: theme.palette.secondary.main,
            opacity: 0.1,
            zIndex: -1,
            display: { xs: 'none', md: 'block' }
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            left: '20%',
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: theme.palette.error.main,
            opacity: 0.1,
            zIndex: -1,
            display: { xs: 'none', md: 'block' }
          }}
        />
      </Box>
    </Container>
  );
};

export default NotFound;