import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { setAuthData, isAuthenticated, getDashboardRoute } from '../../utils/auth';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import Head from 'next/head';
import Link from 'next/link';

interface LoginForm {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  access_token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'vendor' | 'admin';
  };
}

const UserLogin: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated('user')) {
      router.replace('/user/dashboard');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.access_token && data.user) {
        // Ensure user has correct role
        if (data.user.role !== 'user') {
          setError('Invalid credentials. Please use the correct login portal for your account type.');
          return;
        }

        // Store token and user data using auth utilities
        setAuthData('user', data.access_token, data.user);
        
        setSuccess('Login successful! Redirecting...');
        // Redirect to user dashboard after successful login
        setTimeout(() => {
          router.push('/user/dashboard');
        }, 1000);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Head>
        <title>Customer Login - Multi-Vendor E-commerce</title>
        <meta name="description" content="Customer login for multi-vendor e-commerce platform" />
      </Head>
      
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                p: 3,
                textAlign: 'center',
              }}
            >
              <Person sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h4" component="h1" fontWeight="bold">
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Sign in to your customer account
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    placeholder="customer@example.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    placeholder="Enter your password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            aria-label="toggle password visibility"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    {success}
                  </Alert>
                )}

                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<Person />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    mb: 2,
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </LoadingButton>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  New customer? Use phone login to register
                </Typography>
              </Box>
            </CardContent>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default UserLogin;