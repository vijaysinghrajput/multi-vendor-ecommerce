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
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Dashboard,
  People,
  Store,
  Inventory,
  ShoppingCart,
  Assessment,
  Settings,
  Payment,
  Campaign,
  Support,
  Security,
  Category,
  LocalOffer,
  Notifications,
  ExpandLess,
  ExpandMore,
  AccountBalance,
  TrendingUp,
  RateReview,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const AdminSidebar = ({ open, width, collapsedWidth = 60, isMobile }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const [expandedItems, setExpandedItems] = React.useState([]);

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: Dashboard,
    },
    {
      label: 'Vendor Management',
      icon: Store,
      children: [
        {
          label: 'All Vendors',
          href: '/admin/vendors',
          icon: People,
        },
        {
          label: 'Vendor Applications',
          href: '/admin/vendors/applications',
          icon: People,
        },
        {
          label: 'Vendor Payouts',
          href: '/admin/vendors/payouts',
          icon: AccountBalance,
        },
        {
          label: 'Commission Settings',
          href: '/admin/vendors/commission',
          icon: TrendingUp,
        },
      ],
    },
    {
      label: 'Product Management',
      icon: Inventory,
      children: [
        {
          label: 'All Products',
          href: '/admin/products',
          icon: Inventory,
        },
        {
          label: 'Product Approval',
          href: '/admin/products/approval',
          icon: Inventory,
        },
        {
          label: 'Categories',
          href: '/admin/categories',
          icon: Category,
        },
        {
          label: 'Bulk Import/Export',
          href: '/admin/products/bulk',
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
          href: '/admin/orders',
          icon: ShoppingCart,
        },
        {
          label: 'Returns & Refunds',
          href: '/admin/orders/returns',
          icon: ShoppingCart,
        },
        {
          label: 'Disputes',
          href: '/admin/orders/disputes',
          icon: Support,
        },
      ],
    },
    {
      label: 'Customer Management',
      href: '/admin/customers',
      icon: People,
    },
    {
      label: 'Financial Reports',
      icon: Assessment,
      children: [
        {
          label: 'Sales Analytics',
          href: '/admin/reports/sales',
          icon: TrendingUp,
        },
        {
          label: 'Revenue Reports',
          href: '/admin/reports/revenue',
          icon: AccountBalance,
        },
        {
          label: 'Transaction History',
          href: '/admin/reports/transactions',
          icon: Payment,
        },
        {
          label: 'Tax Reports',
          href: '/admin/reports/tax',
          icon: Assessment,
        },
      ],
    },
    {
      label: 'Marketing & Promotions',
      icon: Campaign,
      children: [
        {
          label: 'Promotions',
          href: '/admin/promotions',
          icon: LocalOffer,
        },
        {
          label: 'Featured Products',
          href: '/admin/featured',
          icon: Campaign,
        },
        {
          label: 'Email Campaigns',
          href: '/admin/campaigns',
          icon: Campaign,
        },
      ],
    },
    {
      label: 'System Settings',
      icon: Settings,
      children: [
        {
          label: 'General Settings',
          href: '/admin/settings/general',
          icon: Settings,
        },
        {
          label: 'Payment Settings',
          href: '/admin/settings/payment',
          icon: Payment,
        },
        {
          label: 'Shipping Settings',
          href: '/admin/settings/shipping',
          icon: Settings,
        },
        {
          label: 'Notifications',
          href: '/admin/settings/notifications',
          icon: Notifications,
        },
        {
          label: 'Security',
          href: '/admin/settings/security',
          icon: Security,
        },
      ],
    },
    {
      label: 'Reviews & Ratings',
      href: '/admin/reviews',
      icon: RateReview,
    },
    {
      label: 'Support Center',
      href: '/admin/support',
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
    const isCollapsed = !open && !isMobile;

    const menuItemContent = (
      <ListItemButton
        onClick={() => handleItemClick(item)}
        sx={{
          pl: isCollapsed ? 1 : 2 + depth * 2,
          pr: 2,
          backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          minHeight: 48,
          maxWidth: '100%',
          overflow: 'hidden',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isActive ? theme.palette.primary.main : 'inherit',
            minWidth: isCollapsed ? 'auto' : 40,
            mr: isCollapsed ? 0 : 1,
          }}
        >
          <IconComponent />
        </ListItemIcon>
        {!isCollapsed && (
          <>
            <ListItemText
              primary={item.label}
              sx={{
                color: isActive ? theme.palette.primary.main : 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            />
            {item.children && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </>
        )}
      </ListItemButton>
    );

    return (
      <React.Fragment key={item.label}>
        <ListItem disablePadding>
          {isCollapsed ? (
            <Tooltip title={item.label} placement="right">
              {menuItemContent}
            </Tooltip>
          ) : (
            menuItemContent
          )}
        </ListItem>
        
        {!isCollapsed && item.children && (
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
          p: open || isMobile ? 2 : 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: open || isMobile ? 'left' : 'center',
        }}
      >
        {(open || isMobile) ? (
          <Typography variant="h6" component="div" color="primary">
            Admin Panel
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 32 }}>
            <AdminPanelSettings color="primary" />
          </Box>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ px: open || isMobile ? 1 : 0.5 }}>
        {menuItems.map(item => renderMenuItem(item))}
      </List>

      {(open || isMobile) && (
        <>
          <Divider sx={{ my: 2 }} />

          {/* Additional Links */}
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Quick Actions
            </Typography>
            <List dense>
              <ListItem disablePadding>
                <ListItemButton onClick={() => router.push('/admin/backup')}>
                  <ListItemText primary="System Backup" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => router.push('/admin/logs')}>
                  <ListItemText primary="System Logs" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => router.push('/admin/maintenance')}>
                  <ListItemText primary="Maintenance Mode" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open} // Responsive open state for all screen sizes
      onClose={handleDrawerClose}
      sx={{
        width: open ? width : (isMobile ? 0 : collapsedWidth),
        flexShrink: 0,
        whiteSpace: 'nowrap',
        zIndex: theme.zIndex.drawer,
        '& .MuiDrawer-paper': {
          width: open ? width : (isMobile ? width : collapsedWidth),
          boxSizing: 'border-box',
          top: isMobile ? 0 : 64, // Account for header height
          height: isMobile ? '100%' : 'calc(100% - 64px)',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          overflowX: 'hidden',
          overflowY: 'auto',
          whiteSpace: 'nowrap', // Prevent text wrapping
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.action.disabled,
            borderRadius: '3px',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
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

export default AdminSidebar;