import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountedPrice?: number;
  sku: string;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  vendor: {
    id: string;
    name: string;
    slug: string;
    rating: number;
  };
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  variants?: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    discountedPrice?: number;
    attributes: Record<string, string>;
    inStock: boolean;
    stockQuantity: number;
  }>;
  attributes: Record<string, string>;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  vendor?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
  attributes?: Record<string, string[]>;
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'popularity';
  order: 'asc' | 'desc';
}

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  recentlyViewed: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  sort: ProductSort;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  recentlyViewed: [],
  currentProduct: null,
  filters: {},
  sort: {
    field: 'createdAt',
    order: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    addToRecentlyViewed: (state, action: PayloadAction<Product>) => {
      const exists = state.recentlyViewed.find(p => p.id === action.payload.id);
      if (!exists) {
        state.recentlyViewed.unshift(action.payload);
        // Keep only last 10 items
        if (state.recentlyViewed.length > 10) {
          state.recentlyViewed = state.recentlyViewed.slice(0, 10);
        }
      } else {
        // Move to front
        state.recentlyViewed = [
          action.payload,
          ...state.recentlyViewed.filter(p => p.id !== action.payload.id)
        ];
      }
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page when filters change
    },
    updateFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setSort: (state, action: PayloadAction<ProductSort>) => {
      state.sort = action.payload;
      state.pagination.page = 1;
    },
    setPagination: (state, action: PayloadAction<Partial<ProductState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
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
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      
      // Update current product if it's the same
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
      
      // Update featured products
      const featuredIndex = state.featuredProducts.findIndex(p => p.id === action.payload.id);
      if (featuredIndex !== -1) {
        state.featuredProducts[featuredIndex] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.featuredProducts = state.featuredProducts.filter(p => p.id !== action.payload);
      state.recentlyViewed = state.recentlyViewed.filter(p => p.id !== action.payload);
      
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct = null;
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
    resetProductState: (state) => {
      state.products = [];
      state.currentProduct = null;
      state.filters = {};
      state.sort = {
        field: 'createdAt',
        order: 'desc',
      };
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      };
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setProducts,
  setFeaturedProducts,
  setCurrentProduct,
  addToRecentlyViewed,
  setFilters,
  updateFilters,
  clearFilters,
  setSort,
  setPagination,
  setLoading,
  setError,
  clearError,
  updateProduct,
  removeProduct,
  clearRecentlyViewed,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;