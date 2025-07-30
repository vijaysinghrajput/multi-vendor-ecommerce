import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVendors: number;
  activeUsers: number;
  recentOrders: number;
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  currency: string;
  language: string;
  timezone: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailVerificationRequired: boolean;
  phoneVerificationRequired: boolean;
  commissionRate: number;
  taxRate: number;
  shippingSettings: {
    freeShippingThreshold: number;
    defaultShippingCost: number;
  };
}

interface AdminState {
  stats: AdminStats | null;
  systemSettings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  systemSettings: null,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<AdminStats>) => {
      state.stats = action.payload;
    },
    setSystemSettings: (state, action: PayloadAction<SystemSettings>) => {
      state.systemSettings = action.payload;
    },
    updateSystemSettings: (state, action: PayloadAction<Partial<SystemSettings>>) => {
      if (state.systemSettings) {
        state.systemSettings = { ...state.systemSettings, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAdminData: (state) => {
      state.stats = null;
      state.systemSettings = null;
      state.error = null;
    },
  },
});

export const {
  setStats,
  setSystemSettings,
  updateSystemSettings,
  setLoading,
  setError,
  clearError,
  clearAdminData,
} = adminSlice.actions;

export default adminSlice.reducer;