import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  description: string;
  logo?: string;
  banner?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  businessInfo: {
    businessName: string;
    businessType: string;
    taxId: string;
    registrationNumber: string;
  };
  rating: number;
  reviewCount: number;
  totalProducts: number;
  totalSales: number;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isVerified: boolean;
  joinedAt: string;
  lastActive: string;
}

export interface VendorStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

interface VendorState {
  vendors: Vendor[];
  currentVendor: Vendor | null;
  vendorStats: VendorStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const initialState: VendorState = {
  vendors: [],
  currentVendor: null,
  vendorStats: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.vendors = action.payload;
    },
    setCurrentVendor: (state, action: PayloadAction<Vendor | null>) => {
      state.currentVendor = action.payload;
    },
    setVendorStats: (state, action: PayloadAction<VendorStats | null>) => {
      state.vendorStats = action.payload;
    },
    addVendor: (state, action: PayloadAction<Vendor>) => {
      state.vendors.push(action.payload);
    },
    updateVendor: (state, action: PayloadAction<Vendor>) => {
      const index = state.vendors.findIndex(vendor => vendor.id === action.payload.id);
      if (index !== -1) {
        state.vendors[index] = action.payload;
      }
      
      if (state.currentVendor?.id === action.payload.id) {
        state.currentVendor = action.payload;
      }
    },
    removeVendor: (state, action: PayloadAction<string>) => {
      state.vendors = state.vendors.filter(vendor => vendor.id !== action.payload);
      
      if (state.currentVendor?.id === action.payload) {
        state.currentVendor = null;
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
    setPagination: (state, action: PayloadAction<Partial<VendorState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearVendors: (state) => {
      state.vendors = [];
      state.currentVendor = null;
      state.vendorStats = null;
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      };
    },
  },
});

export const {
  setVendors,
  setCurrentVendor,
  setVendorStats,
  addVendor,
  updateVendor,
  removeVendor,
  setLoading,
  setError,
  clearError,
  setPagination,
  clearVendors,
} = vendorSlice.actions;

export default vendorSlice.reducer;