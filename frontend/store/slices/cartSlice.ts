import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api/cart';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  discountedPrice?: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    vendor: {
      id: string;
      name: string;
      slug: string;
    };
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
    attributes: Record<string, string>;
  };
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: CartState = {
  items: [],
  summary: {
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  },
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await cartAPI.getCart();
  return response.data;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, variantId, quantity }: { productId: string; variantId?: string; quantity: number }) => {
    const response = await cartAPI.addItem(productId, variantId, quantity);
    return response.data;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    const response = await cartAPI.updateItem(itemId, quantity);
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string) => {
    await cartAPI.removeItem(itemId);
    return itemId;
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  await cartAPI.clearCart();
});

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (couponCode: string) => {
    const response = await cartAPI.applyCoupon(couponCode);
    return response.data;
  }
);

export const removeCoupon = createAsyncThunk('cart/removeCoupon', async () => {
  const response = await cartAPI.removeCoupon();
  return response.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateLocalCart: (state, action: PayloadAction<{ items: CartItem[]; summary: CartSummary }>) => {
      state.items = action.payload.items;
      state.summary = action.payload.summary;
      state.lastUpdated = new Date().toISOString();
    },
    addLocalItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId && 
                item.variantId === action.payload.variantId
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      // Recalculate summary
      state.summary = calculateSummary(state.items);
      state.lastUpdated = new Date().toISOString();
    },
    updateLocalItem: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
        state.summary = calculateSummary(state.items);
        state.lastUpdated = new Date().toISOString();
      }
    },
    removeLocalItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.summary = calculateSummary(state.items);
      state.lastUpdated = new Date().toISOString();
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.summary = {
        subtotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        itemCount: 0,
      };
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.summary = action.payload.summary;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update cart item';
      })
      
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.summary = calculateSummary(state.items);
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to remove item from cart';
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.summary = {
          subtotal: 0,
          discount: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          itemCount: 0,
        };
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to clear cart';
      })
      
      // Apply Coupon
      .addCase(applyCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload.summary;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to apply coupon';
      })
      
      // Remove Coupon
      .addCase(removeCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload.summary;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to remove coupon';
      });
  },
});

// Helper function to calculate cart summary
function calculateSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => {
    const price = item.discountedPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // These would typically come from the backend
  const discount = 0;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500
  const total = subtotal - discount + tax + shipping;
  
  return {
    subtotal,
    discount,
    tax,
    shipping,
    total,
    itemCount,
  };
}

export const {
  clearError,
  updateLocalCart,
  addLocalItem,
  updateLocalItem,
  removeLocalItem,
  clearLocalCart,
} = cartSlice.actions;

export default cartSlice.reducer;