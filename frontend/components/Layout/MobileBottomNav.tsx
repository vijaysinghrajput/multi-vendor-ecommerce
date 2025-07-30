import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Home,
  Category,
  ShoppingCart,
  FavoriteBorder,
  AccountCircle,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const MobileBottomNav = () => {
  const theme = useTheme();
  const router = useRouter();
  
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const cartItemsCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistItemsCount = wishlistItems?.length || 0;
  
  // Determine current tab based on pathname
  const getCurrentValue = () => {
    const pathname = router.pathname;
    if (pathname === '/') return 0;
    if (pathname.startsWith('/category') || pathname === '/categories') return 1;
    if (pathname === '/cart') return 2;
    if (pathname === '/wishlist') return 3;
    if (pathname.startsWith('/profile') || pathname.startsWith('/auth')) return 4;
    return 0; // Default to home
  };
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/categories');
        break;
      case 2:
        router.push('/cart');
        break;
      case 3:
        router.push('/wishlist');
        break;
      case 4:
        if (isAuthenticated) {
          router.push('/profile');
        } else {
          router.push('/auth/login');
        }
        break;
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={handleChange}
        showLabels
        sx={{
          height: 56,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 8px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home />}
        />
        
        <BottomNavigationAction
          label="Categories"
          icon={<Category />}
        />
        
        <BottomNavigationAction
          label="Cart"
          icon={
            <Badge badgeContent={cartItemsCount} color="error">
              <ShoppingCart />
            </Badge>
          }
        />
        
        <BottomNavigationAction
          label="Wishlist"
          icon={
            <Badge badgeContent={wishlistItemsCount} color="error">
              <FavoriteBorder />
            </Badge>
          }
        />
        
        <BottomNavigationAction
          label={isAuthenticated ? "Profile" : "Login"}
          icon={<AccountCircle />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;