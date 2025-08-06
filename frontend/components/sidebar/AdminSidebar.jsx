import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Collapse,
  Avatar,
  useTheme,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  Assignment as OrderIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as PaymentIcon,
  ExpandLess,
  ExpandMore,
  PersonAdd as PersonAddIcon,
  StoreMallDirectory as StoreMallIcon,
  Payment as PayoutIcon,
  Percent as CommissionIcon,
  MonetizationOn as MonetizationIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';

const AdminSidebar = ({ onItemClick }) => {
  const theme = useTheme();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState({
    vendors: false,
    customers: false,
    orders: false,
    analytics: false
  });

  // Menu items configuration
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: DashboardIcon,
      path: '/admin/dashboard',
      badge: null
    },
    {
      id: 'vendors',
      label: 'Vendor Management',
      icon: StoreIcon,
      hasChildren: true,
      children: [
        {
          id: 'all-vendors',
          label: 'All Vendors',
          icon: StoreMallIcon,
          path: '/admin/vendors',
          badge: null
        },
        {
          id: 'vendor-applications',
          label: 'Applications',
          icon: PersonAddIcon,
          path: '/admin/vendors/applications',
          badge: { count: 5, color: 'warning' }
        },
        {
          id: 'vendor-payouts',
          label: 'Payouts',
          icon: PayoutIcon,
          path: '/admin/vendors/payouts',
          badge: null
        },
        {
          id: 'commissions',
          label: 'Commission Settings',
          icon: CommissionIcon,
          path: '/admin/vendors/commissions',
          badge: null
        }
      ]
    },
    {
      id: 'customers',
      label: 'Customer Management',
      icon: PeopleIcon,
      hasChildren: true,
      children: [
        {
          id: 'all-customers',
          label: 'All Customers',
          icon: PeopleIcon,
          path: '/admin/customers',
          badge: null
        },
        {
          id: 'customer-segments',
          label: 'Segments',
          icon: CategoryIcon,
          path: '/admin/customers/segments',
          badge: null
        }
      ]
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: ShoppingCartIcon,
      hasChildren: true,
      children: [
        {
          id: 'all-orders',
          label: 'All Orders',
          icon: OrderIcon,
          path: '/admin/orders',
          badge: { count: 23, color: 'info' }
        },
        {
          id: 'pending-orders',
          label: 'Pending Orders',
          icon: ShoppingCartIcon,
          path: '/admin/orders/pending',
          badge: { count: 8, color: 'warning' }
        },
        {
          id: 'returns',
          label: 'Returns & Refunds',
          icon: MonetizationIcon,
          path: '/admin/orders/returns',
          badge: { count: 3, color: 'error' }
        }
      ]
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: CategoryIcon,
      path: '/admin/products',
      badge: null
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: AnalyticsIcon,
      hasChildren: true,
      children: [
        {
          id: 'dashboard-analytics',
          label: 'Dashboard',
          icon: TrendingUpIcon,
          path: '/admin/analytics',
          badge: null
        },
        {
          id: 'sales-reports',
          label: 'Sales Reports',
          icon: MonetizationIcon,
          path: '/admin/analytics/sales',
          badge: null
        },
        {
          id: 'vendor-reports',
          label: 'Vendor Reports',
          icon: StoreIcon,
          path: '/admin/analytics/vendors',
          badge: null
        }
      ]
    },
    {
      id: 'payments',
      label: 'Payment Management',
      icon: PaymentIcon,
      path: '/admin/payments',
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      path: '/admin/settings',
      badge: null
    }
  ];

  const handleMenuToggle = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (onItemClick) {
      onItemClick();
    }
  };

  const isActiveRoute = (path) => {
    if (path === '/admin/dashboard') {
      return router.pathname === path;
    }
    return router.pathname.startsWith(path);
  };

  const renderBadge = (badge) => {
    if (!badge) return null;
    
    return (
      <Chip
        label={badge.count}
        size="small"
        color={badge.color}
        sx={{
          height: 18,
          fontSize: '0.75rem',
          fontWeight: 600,
          '& .MuiChip-label': {
            px: 1
          }
        }}
      />
    );
  };

  const renderMenuItem = (item, level = 0) => {
    const Icon = item.icon;
    const isActive = isActiveRoute(item.path || '');
    const hasChildren = item.hasChildren && item.children;
    const isOpen = openMenus[item.id];

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ pl: level * 2 }}>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleMenuToggle(item.id);
              } else if (item.path) {
                handleNavigation(item.path);
              }
            }}
            selected={isActive && !hasChildren}
            sx={{
              minHeight: 48,
              borderRadius: 1,
              mx: 1,
              my: 0.25,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                '& .MuiListItemIcon-root': {
                  color: '#fff'
                }
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: 1
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isActive && !hasChildren ? '#fff' : theme.palette.text.secondary
              }}
            >
              <Icon fontSize="small" />
            </ListItemIcon>
            
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive && !hasChildren ? 600 : 500
              }}
            />
            
            {item.badge && renderBadge(item.badge)}
            
            {hasChildren && (
              isOpen ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar Spacer */}
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          minHeight: { xs: 56, sm: 64 }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 36,
              height: 36,
              mr: 1.5
            }}
          >
            <StoreIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ lineHeight: 1.2 }}
            >
              Admin
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1 }}
            >
              Multi-Vendor Portal
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 1 }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
          sx={{ mb: 1 }}
        >
          Admin Panel v1.0.0
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          © 2025 Skyably IT Solutions
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminSidebar;