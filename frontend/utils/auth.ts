// Authentication utilities and route guards

export interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'vendor' | 'admin';
  businessName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Token storage keys for different user types
const TOKEN_KEYS = {
  user: 'userToken',
  vendor: 'vendorToken',
  admin: 'adminToken',
};

const USER_DATA_KEYS = {
  user: 'userData',
  vendor: 'vendorData',
  admin: 'adminData',
};

/**
 * Get stored authentication token for a specific role
 */
export const getAuthToken = (role: 'user' | 'vendor' | 'admin'): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEYS[role]);
};

/**
 * Get stored user data for a specific role
 */
export const getUserData = (role: 'user' | 'vendor' | 'admin'): UserData | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(USER_DATA_KEYS[role]);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Store authentication token and user data
 */
export const setAuthData = (
  role: 'user' | 'vendor' | 'admin',
  token: string,
  userData: UserData
): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(TOKEN_KEYS[role], token);
  localStorage.setItem(USER_DATA_KEYS[role], JSON.stringify(userData));
};

/**
 * Clear authentication data for a specific role
 */
export const clearAuthData = (role: 'user' | 'vendor' | 'admin'): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEYS[role]);
  localStorage.removeItem(USER_DATA_KEYS[role]);
};

/**
 * Clear all authentication data (useful for complete logout)
 */
export const clearAllAuthData = (): void => {
  if (typeof window === 'undefined') return;
  
  Object.values(TOKEN_KEYS).forEach(key => localStorage.removeItem(key));
  Object.values(USER_DATA_KEYS).forEach(key => localStorage.removeItem(key));
};

/**
 * Check if user is authenticated for a specific role
 */
export const isAuthenticated = (role: 'user' | 'vendor' | 'admin'): boolean => {
  const token = getAuthToken(role);
  const userData = getUserData(role);
  
  return !!(token && userData && userData.role === role);
};

/**
 * Check if user has access to a specific route based on their role
 */
export const hasRouteAccess = (
  userRole: 'user' | 'vendor' | 'admin',
  requiredRole: 'user' | 'vendor' | 'admin'
): boolean => {
  // Admin has access to all routes
  if (userRole === 'admin') return true;
  
  // Users and vendors can only access their own routes
  return userRole === requiredRole;
};

/**
 * Get the appropriate dashboard route for a user role
 */
export const getDashboardRoute = (role: 'user' | 'vendor' | 'admin'): string => {
  switch (role) {
    case 'user':
      return '/customer/dashboard';
    case 'vendor':
      return '/vendor/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/login/user';
  }
};

/**
 * Get the appropriate login route for a user role
 */
export const getLoginRoute = (role: 'user' | 'vendor' | 'admin'): string => {
  switch (role) {
    case 'user':
      return '/login/user';
    case 'vendor':
      return '/login/vendor';
    case 'admin':
      return '/login/admin';
    default:
      return '/login/user';
  }
};

/**
 * Validate token format (basic JWT structure check)
 */
export const isValidTokenFormat = (token: string): boolean => {
  if (!token) return false;
  
  // Basic JWT format check (3 parts separated by dots)
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Check if token is expired (requires JWT payload parsing)
 */
export const isTokenExpired = (token: string): boolean => {
  if (!isValidTokenFormat(token)) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp ? payload.exp < currentTime : false;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

/**
 * Get current authenticated user across all roles
 */
export const getCurrentUser = (): { role: 'user' | 'vendor' | 'admin'; userData: UserData } | null => {
  const roles: ('user' | 'vendor' | 'admin')[] = ['admin', 'vendor', 'user'];
  
  for (const role of roles) {
    if (isAuthenticated(role)) {
      const userData = getUserData(role);
      if (userData) {
        return { role, userData };
      }
    }
  }
  
  return null;
};

/**
 * Logout user from specific role
 */
export const logout = (role: 'user' | 'vendor' | 'admin'): void => {
  clearAuthData(role);
  
  // Redirect to appropriate login page
  if (typeof window !== 'undefined') {
    window.location.href = getLoginRoute(role);
  }
};

/**
 * Logout from all roles (complete logout)
 */
export const logoutAll = (): void => {
  clearAllAuthData();
  
  // Redirect to main login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login/user';
  }
};