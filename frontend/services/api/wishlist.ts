import { apiClient } from './client';

export interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: string[];
    inStock: boolean;
    rating: number;
    reviewCount: number;
  };
  addedAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Get user's wishlist
export const getWishlist = async (params?: {
  page?: number;
  limit?: number;
}): Promise<WishlistResponse> => {
  const response = await apiClient.get('/wishlist', { params });
  return response.data;
};

// Add item to wishlist
export const addToWishlist = async (productId: string): Promise<WishlistItem> => {
  const response = await apiClient.post('/wishlist', { productId });
  return response.data;
};

// Remove item from wishlist
export const removeFromWishlist = async (itemId: string): Promise<void> => {
  await apiClient.delete(`/wishlist/${itemId}`);
};

// Remove item from wishlist by product ID
export const removeFromWishlistByProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(`/wishlist/product/${productId}`);
};

// Clear entire wishlist
export const clearWishlist = async (): Promise<void> => {
  await apiClient.delete('/wishlist');
};

// Check if product is in wishlist
export const isInWishlist = async (productId: string): Promise<boolean> => {
  const response = await apiClient.get(`/wishlist/check/${productId}`);
  return response.data.inWishlist;
};

// Move item from wishlist to cart
export const moveToCart = async (itemId: string, quantity: number = 1): Promise<void> => {
  await apiClient.post(`/wishlist/${itemId}/move-to-cart`, { quantity });
};

// Get wishlist count
export const getWishlistCount = async (): Promise<number> => {
  const response = await apiClient.get('/wishlist/count');
  return response.data.count;
};

// Share wishlist
export const shareWishlist = async (): Promise<{ shareUrl: string }> => {
  const response = await apiClient.post('/wishlist/share');
  return response.data;
};

// Get shared wishlist
export const getSharedWishlist = async (shareId: string): Promise<WishlistResponse> => {
  const response = await apiClient.get(`/wishlist/shared/${shareId}`);
  return response.data;
};