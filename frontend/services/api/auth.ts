import { apiClient } from './client';
import { User } from '../../store/slices/authSlice';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface OTPResponse {
  message: string;
  tempToken?: string;
}

export interface VerifyOTPResponse {
  tempToken: string;
  isNewUser: boolean;
}

export const authAPI = {
  // Send OTP for login/registration
  sendOTP: (identifier: string, type: 'email' | 'phone') => {
    return apiClient.post<OTPResponse>('/auth/send-otp', {
      identifier,
      type,
    });
  },

  // Verify OTP
  verifyOTP: (identifier: string, otp: string, type: 'email' | 'phone') => {
    return apiClient.post<VerifyOTPResponse>('/auth/verify-otp', {
      identifier,
      otp,
      type,
    });
  },

  // Complete registration for new users
  completeRegistration: (userData: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    role: 'customer' | 'vendor';
    tempToken: string;
  }) => {
    return apiClient.post<AuthResponse>('/auth/complete-registration', userData);
  },

  // Login existing user
  login: (identifier: string, otp: string, type: 'email' | 'phone') => {
    return apiClient.post<AuthResponse>('/auth/login', {
      identifier,
      otp,
      type,
    });
  },

  // Refresh access token
  refreshToken: (refreshToken: string) => {
    return apiClient.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    });
  },

  // Logout
  logout: () => {
    return apiClient.post('/auth/logout');
  },

  // Get current user profile
  getProfile: () => {
    return apiClient.get<{ user: User }>('/auth/profile');
  },

  // Update user profile
  updateProfile: (userData: Partial<User>) => {
    return apiClient.put<{ user: User }>('/auth/profile', userData);
  },

  // Change password (for users who have password)
  changePassword: (currentPassword: string, newPassword: string) => {
    return apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  // Request password reset
  requestPasswordReset: (identifier: string, type: 'email' | 'phone') => {
    return apiClient.post('/auth/request-password-reset', {
      identifier,
      type,
    });
  },

  // Reset password with OTP
  resetPassword: (identifier: string, otp: string, newPassword: string, type: 'email' | 'phone') => {
    return apiClient.post('/auth/reset-password', {
      identifier,
      otp,
      newPassword,
      type,
    });
  },

  // Verify email
  verifyEmail: (token: string) => {
    return apiClient.post('/auth/verify-email', { token });
  },

  // Verify phone
  verifyPhone: (otp: string) => {
    return apiClient.post('/auth/verify-phone', { otp });
  },

  // Resend verification email
  resendEmailVerification: () => {
    return apiClient.post('/auth/resend-email-verification');
  },

  // Resend phone verification OTP
  resendPhoneVerification: () => {
    return apiClient.post('/auth/resend-phone-verification');
  },

  // Social login (Google, Facebook, etc.)
  socialLogin: (provider: string, token: string) => {
    return apiClient.post<AuthResponse>('/auth/social-login', {
      provider,
      token,
    });
  },

  // Link social account
  linkSocialAccount: (provider: string, token: string) => {
    return apiClient.post('/auth/link-social-account', {
      provider,
      token,
    });
  },

  // Unlink social account
  unlinkSocialAccount: (provider: string) => {
    return apiClient.delete(`/auth/unlink-social-account/${provider}`);
  },

  // Delete account
  deleteAccount: (password?: string) => {
    return apiClient.delete('/auth/account', {
      data: { password },
    });
  },
};