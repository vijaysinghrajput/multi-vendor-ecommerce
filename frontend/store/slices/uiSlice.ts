import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  cartDrawerOpen: boolean;
  wishlistDrawerOpen: boolean;
  filterDrawerOpen: boolean;
  isMobile: boolean;
  loading: {
    global: boolean;
    page: boolean;
    component: Record<string, boolean>;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
    persistent?: boolean;
  }>;
  modals: {
    authModal: boolean;
    productQuickView: boolean;
    addressModal: boolean;
    confirmDialog: boolean;
  };
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
  pageTitle: string;
  metaDescription: string;
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true, // Default to true for better desktop experience
  mobileMenuOpen: false,
  searchOpen: false,
  cartDrawerOpen: false,
  wishlistDrawerOpen: false,
  filterDrawerOpen: false,
  isMobile: false,
  loading: {
    global: false,
    page: false,
    component: {},
  },
  notifications: [],
  modals: {
    authModal: false,
    productQuickView: false,
    addressModal: false,
    confirmDialog: false,
  },
  breadcrumbs: [],
  pageTitle: '',
  metaDescription: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.cartDrawerOpen = action.payload;
    },
    toggleWishlistDrawer: (state) => {
      state.wishlistDrawerOpen = !state.wishlistDrawerOpen;
    },
    setWishlistDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.wishlistDrawerOpen = action.payload;
    },
    toggleFilterDrawer: (state) => {
      state.filterDrawerOpen = !state.filterDrawerOpen;
    },
    setFilterDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.filterDrawerOpen = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.page = action.payload;
    },
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      state.loading.component[action.payload.component] = action.payload.loading;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setModal: (state, action: PayloadAction<{ modal: keyof UIState['modals']; open: boolean }>) => {
      state.modals[action.payload.modal] = action.payload.open;
    },
    // Mobile state
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<UIState['breadcrumbs']>) => {
      state.breadcrumbs = action.payload;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    setMetaDescription: (state, action: PayloadAction<string>) => {
      state.metaDescription = action.payload;
    },
    resetUI: (state) => {
      state.sidebarOpen = false;
      state.mobileMenuOpen = false;
      state.searchOpen = false;
      state.cartDrawerOpen = false;
      state.wishlistDrawerOpen = false;
      state.filterDrawerOpen = false;
      state.loading.global = false;
      state.loading.page = false;
      state.loading.component = {};
      state.notifications = [];
      state.modals = {
        authModal: false,
        productQuickView: false,
        addressModal: false,
        confirmDialog: false,
      };
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleSearch,
  setSearchOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  toggleWishlistDrawer,
  setWishlistDrawerOpen,
  toggleFilterDrawer,
  setFilterDrawerOpen,
  setGlobalLoading,
  setPageLoading,
  setComponentLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setModal,
  setIsMobile,
  setBreadcrumbs,
  setPageTitle,
  setMetaDescription,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;