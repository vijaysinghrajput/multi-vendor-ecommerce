import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Collapse,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  ShoppingCart,
  Favorite,
  Person,
  History,
  RateReview,
  Support,
  Notifications,
  Payment,
  LocalShipping,
  Category,
  LocalOffer,
  NewReleases,
  TrendingUp,
  Star,
  ExpandLess,
  ExpandMore,
  Smartphone,
  Checkroom,
  Home as HomeIcon,
  SportsEsports,
  MenuBook,
  MoreHoriz,
  AccountCircle,
  Security,
  LocationOn,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const UserSidebar = ({ open, width, isMobile }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = React.useState([]);

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/user/dashboard',
      icon: Dashboard,
    },
    {
      label: 'Browse Categories',
      icon: Category,
      children: [
        {
          label: 'Electronics',
          href: '/category/electronics',
          icon: Smartphone,
        },
        {
          label: 'Fashion',
          href: '/category/fashion',
          icon: Checkroom,
        },
        {
          label: 'Home & Garden',
          href: '/category/home-garden',
          icon: HomeIcon,
        },
        {
          label: 'Sports',
          href: '/category/sports',
          icon: SportsEsports,
        },
        {
          label: 'Books',
          href: '/category/books',
          icon: MenuBook,
        },
        {
          label: 'All Categories',
          href: '/categories',
          icon: MoreHoriz,
        },
      ],
    },
    {
      label: 'Shopping',
      icon: ShoppingCart,
      children: [
        {
          label: 'My Cart',
          href: '/cart',
          icon: ShoppingCart,
        },
        {
          label: 'Wishlist',
          href: '/user/wishlist',
          icon: Favorite,
        },
        {
          label: 'Deals & Offers',
          href: '/deals',
          icon: LocalOffer,
        },
        {
          label: 'New Arrivals',
          href: '/new-arrivals',
          icon: NewReleases,
        },
        {
          label: 'Trending',
          href: '/trending',
          icon: TrendingUp,
        },
        {
          label: 'Best Sellers',
          href: '/best-sellers',
          icon: Star,
        },
      ],
    },
    {
      label: 'My Orders',
      icon: History,
      children: [
        {
          label: 'Order History',
          href: '/user/orders',
          icon: History,
        },
        {
          label: 'Track Orders',
          href: '/user/orders/track',
          icon: LocalShipping,
        },
        {
          label: 'Returns & Refunds',
          href: '/user/orders/returns',
          icon: History,
        },
      ],
    },
    {
      label: 'Account Management',
      icon: Person,
      children: [
        {
          label: 'Profile',
          href: '/user/profile',
          icon: AccountCircle,
        },
        {
          label: 'Addresses',
          href: '/user/addresses',
          icon: LocationOn,
        },
        {
          label: 'Payment Methods',
          href: '/user/payment-methods',
          icon: Payment,
        },
        {
          label: 'Security Settings',
          href: '/user/security',
          icon: Security,
        },
      ],
    },
    {
      label: 'Reviews & Ratings',
      href: '/user/reviews',
      icon: RateReview,
    },
    {
      label: 'Notifications',
      href: '/user/notifications',
      icon: Notifications,
    },
    {
      label: 'Support',
      href: '/user/support',
      icon: Support,
    },
  ];

  const handleItemClick = (item) => {
    if (item.children) {
      // Toggle expansion for items with children
      setExpandedItems(prev => 
        prev.includes(item.label)
          ? prev.filter(label => label !== item.label)
          : [...prev, item.label]
      );
    } else if (item.href) {
      // Navigate to the href
      router.push(item.href);
      // Close sidebar on mobile after navigation
      if (isMobile) {
        dispatch(setSidebarOpen(false));
      }
    }
  };

  const handleDrawerClose = () => {
    dispatch(setSidebarOpen(false));
  };

  const isItemActive = (href) => {
    return router.pathname === href;
  };

  const renderMenuItem = (item, depth = 0) => {
    const isExpanded = expandedItems.includes(item.label);
    const isActive = item.href ? isItemActive(item.href) : false;
    const IconComponent = item.icon;

    return (
      <React.Fragment key={item.label}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              pl: 2 + depth * 2,
              backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive ? theme.palette.primary.main : 'inherit',
                minWidth: 40,
              }}
            >
              <IconComponent />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                color: isActive ? theme.palette.primary.main : 'inherit',
              }}
            />
            {item.children && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
        
        {item.children && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="div" color="primary">
          My Account
        </Typography>
      </Box>

      {/* Menu Items */}
      <List>
        {menuItems.map(item => renderMenuItem(item))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Additional Links */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Quick Links
        </Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/help')}>
              <ListItemText primary="Help Center" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/contact')}>
              <ListItemText primary="Contact Us" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/about')}>
              <ListItemText primary="About Us" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/faq')}>
              <ListItemText primary="FAQ" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={handleDrawerClose}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          top: isMobile ? 0 : 64, // Account for header height
          height: isMobile ? '100%' : 'calc(100% - 64px)',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default UserSidebar;