import React, { useState } from 'react';
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
  AdminPanelSettings,
  Security,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import Head from 'next/head';
import Link from 'next/link';
import { apiClient } from '../../services/api/client';

interface LoginForm {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    success: boolean;
    message: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'user' | 'vendor' | 'admin';
    };
    accessToken: string;
    refreshToken: string;
  };
}

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check if admin is already authenticated
  useEffect(() => {
    if (isAuthenticated('admin')) {
      router.replace('/admin/dashboard');
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
      const response = await apiClient.post('/auth/admin-login', formData);
      const data: ApiResponse = response.data;

      if (data.data && data.data.accessToken && data.data.user) {
        const accessToken = data.data.accessToken;
        const user = data.data.user;
        // Ensure user has correct role
        if (user.role !== 'admin') {
          setError('Invalid credentials. Please use the correct login portal for your account type.');
          return;
        }

        // Store token and user data using auth utilities
        setAuthData('admin', accessToken, user);
        
        setSuccess('Admin login successful! Redirecting...');
        
        // Immediate redirect with fallback
        router.replace('/admin/dashboard').catch(() => {
          // Fallback if router.replace fails
          window.location.href = '/admin/dashboard';
        });
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.response?.data?.message || 'Network error. Please check your connection and try again.');
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
        <title>Admin Login - Multi-Vendor E-commerce</title>
        <meta name="description" content="Admin login for multi-vendor e-commerce platform" />
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
            elevation={12}
            sx={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Box
              sx={{
                bgcolor: 'error.main',
                color: 'error.contrastText',
                p: 3,
                textAlign: 'center',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                },
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 48, mb: 1, position: 'relative', zIndex: 1 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ position: 'relative', zIndex: 1 }}>
                Admin Portal
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}>
                Secure administrative access
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                <Security sx={{ mr: 1, color: 'warning.dark' }} />
                <Typography variant="caption" color="warning.dark" fontWeight="medium">
                  Authorized personnel only - All access is logged
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Admin Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    placeholder="admin@example.com"
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
                    label="Admin Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    placeholder="Enter admin password"
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
                  startIcon={<AdminPanelSettings />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    mb: 2,
                    bgcolor: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.dark',
                    },
                  }}
                >
                  {loading ? 'Authenticating...' : 'Access Admin Panel'}
                </LoadingButton>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Test Credentials: admin@example.com / admin123
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Not an admin?{' '}
                  <MuiLink component={Link} href="/login/user" color="primary">
                    Customer Login
                  </MuiLink>
                  {' | '}
                  <MuiLink component={Link} href="/login/vendor" color="secondary">
                    Vendor Login
                  </MuiLink>
                </Typography>
              </Box>
            </CardContent>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default AdminLogin;