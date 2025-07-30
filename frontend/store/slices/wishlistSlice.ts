import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice?: number;
    images: string[];
    inStock: boolean;
    vendor: {
      id: string;
      name: string;
    };
  };
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

// Mock API calls - replace with actual API
const mockAPI = {
  getWishlist: () => Promise.resolve({ data: { items: [] } }),
  addItem: (productId: string) => Promise.resolve({ data: { item: null } }),
  removeItem: (itemId: string) => Promise.resolve({ data: {} }),
  clearWishlist: () => Promise.resolve({ data: {} }),
};

// Async thunks
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async () => {
  const response = await mockAPI.getWishlist();
  return response.data;
});

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string) => {
    const response = await mockAPI.addItem(productId);
    return response.data;
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (itemId: string) => {
    await mockAPI.removeItem(itemId);
    return itemId;
  }
);

export const clearWishlist = createAsyncThunk('wishlist/clearWishlist', async () => {
  await mockAPI.clearWishlist();
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addLocalItem: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(item => item.productId === action.payload.productId);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeLocalItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearLocalWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (action.payload.item) {
          state.items.push(action.payload.item);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { clearError, addLocalItem, removeLocalItem, clearLocalWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;