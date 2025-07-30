import { apiClient } from './client';
import { CartItem, CartSummary } from '../../store/slices/cartSlice';

export interface CartResponse {
  items: CartItem[];
  summary: CartSummary;
}

export interface CouponResponse {
  summary: CartSummary;
  coupon: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
  };
}

export const cartAPI = {
  // Get user's cart
  getCart: () => {
    return apiClient.get<CartResponse>('/cart');
  },

  // Add item to cart
  addItem: (productId: string, variantId?: string, quantity: number = 1) => {
    return apiClient.post<CartResponse>('/cart/items', {
      productId,
      variantId,
      quantity,
    });
  },

  // Update cart item quantity
  updateItem: (itemId: string, quantity: number) => {
    return apiClient.put<CartResponse>(`/cart/items/${itemId}`, {
      quantity,
    });
  },

  // Remove item from cart
  removeItem: (itemId: string) => {
    return apiClient.delete(`/cart/items/${itemId}`);
  },

  // Clear entire cart
  clearCart: () => {
    return apiClient.delete('/cart');
  },

  // Apply coupon code
  applyCoupon: (couponCode: string) => {
    return apiClient.post<CouponResponse>('/cart/coupon', {
      code: couponCode,
    });
  },

  // Remove applied coupon
  removeCoupon: () => {
    return apiClient.delete<CartResponse>('/cart/coupon');
  },

  // Get cart summary
  getSummary: () => {
    return apiClient.get<{ summary: CartSummary }>('/cart/summary');
  },

  // Validate cart items (check availability, prices, etc.)
  validateCart: () => {
    return apiClient.post<{
      valid: boolean;
      issues: Array<{
        itemId: string;
        issue: string;
        severity: 'warning' | 'error';
      }>;
    }>('/cart/validate');
  },

  // Merge guest cart with user cart after login
  mergeCart: (guestCartItems: CartItem[]) => {
    return apiClient.post<CartResponse>('/cart/merge', {
      items: guestCartItems,
    });
  },

  // Save cart for later (wishlist-like functionality)
  saveForLater: (itemId: string) => {
    return apiClient.post(`/cart/items/${itemId}/save-for-later`);
  },

  // Move item from saved to cart
  moveToCart: (itemId: string) => {
    return apiClient.post(`/cart/items/${itemId}/move-to-cart`);
  },

  // Get saved items
  getSavedItems: () => {
    return apiClient.get<{ items: CartItem[] }>('/cart/saved-items');
  },

  // Remove saved item
  removeSavedItem: (itemId: string) => {
    return apiClient.delete(`/cart/saved-items/${itemId}`);
  },

  // Estimate shipping costs
  estimateShipping: (address: {
    country: string;
    state: string;
    city: string;
    postalCode: string;
  }) => {
    return apiClient.post<{
      options: Array<{
        id: string;
        name: string;
        cost: number;
        estimatedDays: number;
      }>;
    }>('/cart/estimate-shipping', address);
  },

  // Apply shipping option
  applyShipping: (shippingOptionId: string) => {
    return apiClient.post<CartResponse>('/cart/shipping', {
      shippingOptionId,
    });
  },
};