import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid,
  Paper
} from '@mui/material';
import {
  Phone,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Security,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

type AuthStep = 'phone' | 'otp' | 'profile';

const LoginPage: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [authStep, setAuthStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Profile form for new users
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setAuthStep('otp');
      setResendTimer(30);
      
      // Simulate checking if user exists
      const existingUser = Math.random() > 0.5;
      setIsNewUser(!existingUser);
      
      // Start countdown
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate OTP verification
      if (otpValue === '123456') {
        if (isNewUser) {
          setAuthStep('profile');
        } else {
          // Redirect to dashboard or previous page
          router.push('/');
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile.password !== profile.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (profile.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 1500);
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setError('');
    
    // Start countdown
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    console.log(`Login with ${provider}`);
  };

  const renderPhoneStep = () => (
    <Card sx={{ maxWidth: 400, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Phone sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to ShopHub
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your phone number to continue
          </Typography>
        </Box>

        <form onSubmit={handlePhoneSubmit}>
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            placeholder="9876543210"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography variant="body1">+91</Typography>
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 10 }}
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading || phoneNumber.length !== 10}
            sx={{ mb: 3 }}
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Google />}
            onClick={() => handleSocialLogin('google')}
            sx={{ textTransform: 'none' }}
          >
            Continue with Google
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Facebook />}
            onClick={() => handleSocialLogin('facebook')}
            sx={{ textTransform: 'none' }}
          >
            Continue with Facebook
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Typography>
      </CardContent>
    </Card>
  );

  const renderOtpStep = () => (
    <Card sx={{ maxWidth: 400, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Verify OTP
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We've sent a 6-digit code to
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
            +91 {phoneNumber}
          </Typography>
        </Box>

        <form onSubmit={handleOtpSubmit}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            {otp.map((digit, index) => (
              <TextField
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '1.5rem' }
                }}
                sx={{ width: 50 }}
                variant="outlined"
              />
            ))}
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading || otp.join('').length !== 6}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center' }}>
          {resendTimer > 0 ? (
            <Typography variant="body2" color="text.secondary">
              Resend OTP in {resendTimer}s
            </Typography>
          ) : (
            <Button
              variant="text"
              onClick={handleResendOtp}
              sx={{ textTransform: 'none' }}
            >
              Resend OTP
            </Button>
          )}
        </Box>

        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => setAuthStep('phone')}
          sx={{ mt: 2, textTransform: 'none' }}
        >
          Change Phone Number
        </Button>
      </CardContent>
    </Card>
  );

  const renderProfileStep = () => (
    <Card sx={{ maxWidth: 500, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Complete Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Just a few more details to get started
          </Typography>
        </Box>

        <form onSubmit={handleProfileSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={profile.password}
                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={profile.confirmPassword}
                onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
            </Grid>
          </Grid>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ mt: 3 }}
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Head>
        <title>Login - ShopHub</title>
        <meta name="description" content="Login to your ShopHub account" />
      </Head>

      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          py: 4
        }}
      >
        <Container maxWidth="sm">
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                ShopHub
              </Typography>
            </Link>
          </Box>

          {/* Auth Steps */}
          {authStep === 'phone' && renderPhoneStep()}
          {authStep === 'otp' && renderOtpStep()}
          {authStep === 'profile' && renderProfileStep()}

          {/* Security Notice */}
          <Paper sx={{ p: 2, mt: 3, bgcolor: 'rgba(255,255,255,0.9)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Security sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
              <Typography variant="caption" color="text.secondary">
                Your information is secure and encrypted
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;