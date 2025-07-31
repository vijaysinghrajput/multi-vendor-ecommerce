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
  Store,
  Inventory,
  ShoppingCart,
  Assessment,
  Settings,
  Payment,
  Campaign,
  Support,
  LocalShipping,
  RateReview,
  Chat,
  Notifications,
  ExpandLess,
  ExpandMore,
  AccountBalance,
  TrendingUp,
  LocalOffer,
  Storefront,
  BarChart,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const VendorSidebar = ({ open, width, isMobile }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = React.useState([]);

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/vendor/dashboard',
      icon: Dashboard,
    },
    {
      label: 'Store Management',
      icon: Storefront,
      children: [
        {
          label: 'Store Profile',
          href: '/vendor/store/profile',
          icon: Store,
        },
        {
          label: 'Store Settings',
          href: '/vendor/store/settings',
          icon: Settings,
        },
        {
          label: 'Vacation Mode',
          href: '/vendor/store/vacation',
          icon: Store,
        },
      ],
    },
    {
      label: 'Product Management',
      icon: Inventory,
      children: [
        {
          label: 'All Products',
          href: '/vendor/products',
          icon: Inventory,
        },
        {
          label: 'Add Product',
          href: '/vendor/products/add',
          icon: Inventory,
        },
        {
          label: 'Inventory',
          href: '/vendor/inventory',
          icon: Inventory,
        },
        {
          label: 'Bulk Upload',
          href: '/vendor/products/bulk',
          icon: Inventory,
        },
      ],
    },
    {
      label: 'Order Management',
      icon: ShoppingCart,
      children: [
        {
          label: 'All Orders',
          href: '/vendor/orders',
          icon: ShoppingCart,
        },
        {
          label: 'Pending Orders',
          href: '/vendor/orders/pending',
          icon: ShoppingCart,
        },
        {
          label: 'Returns & Refunds',
          href: '/vendor/orders/returns',
          icon: ShoppingCart,
        },
      ],
    },
    {
      label: 'Shipping Management',
      icon: LocalShipping,
      children: [
        {
          label: 'Shipping Methods',
          href: '/vendor/shipping/methods',
          icon: LocalShipping,
        },
        {
          label: 'Shipping Zones',
          href: '/vendor/shipping/zones',
          icon: LocalShipping,
        },
        {
          label: 'Print Labels',
          href: '/vendor/shipping/labels',
          icon: LocalShipping,
        },
      ],
    },
    {
      label: 'Sales & Analytics',
      icon: BarChart,
      children: [
        {
          label: 'Sales Reports',
          href: '/vendor/reports/sales',
          icon: TrendingUp,
        },
        {
          label: 'Product Performance',
          href: '/vendor/reports/products',
          icon: Assessment,
        },
        {
          label: 'Customer Insights',
          href: '/vendor/reports/customers',
          icon: Assessment,
        },
      ],
    },
    {
      label: 'Financial',
      icon: AccountBalance,
      children: [
        {
          label: 'Earnings',
          href: '/vendor/earnings',
          icon: AccountBalance,
        },
        {
          label: 'Payout History',
          href: '/vendor/payouts',
          icon: Payment,
        },
        {
          label: 'Transaction History',
          href: '/vendor/transactions',
          icon: Payment,
        },
      ],
    },
    {
      label: 'Marketing',
      icon: Campaign,
      children: [
        {
          label: 'Promotions',
          href: '/vendor/promotions',
          icon: LocalOffer,
        },
        {
          label: 'Coupons',
          href: '/vendor/coupons',
          icon: LocalOffer,
        },
        {
          label: 'SEO Tools',
          href: '/vendor/seo',
          icon: Campaign,
        },
      ],
    },
    {
      label: 'Customer Communication',
      icon: Chat,
      children: [
        {
          label: 'Messages',
          href: '/vendor/messages',
          icon: Chat,
        },
        {
          label: 'Product Q&A',
          href: '/vendor/qa',
          icon: Chat,
        },
      ],
    },
    {
      label: 'Reviews & Ratings',
      href: '/vendor/reviews',
      icon: RateReview,
    },
    {
      label: 'Notifications',
      href: '/vendor/notifications',
      icon: Notifications,
    },
    {
      label: 'Support',
      href: '/vendor/support',
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
          Vendor Portal
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
          Quick Actions
        </Typography>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/vendor/products/add')}>
              <ListItemText primary="Add New Product" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/vendor/orders/pending')}>
              <ListItemText primary="Process Orders" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/vendor/help')}>
              <ListItemText primary="Help Center" />
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

export default VendorSidebar;