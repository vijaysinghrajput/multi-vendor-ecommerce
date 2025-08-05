import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard,
  Store,
  Inventory,
  ShoppingCart,
  People,
  Assessment,
  Campaign,
  Settings,
  RateReview,
  Support,
  ExpandLess,
  ExpandMore,
  Group,
  Assignment,
  Payment,
  Percent
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = ({ open, onClose, drawerWidth = 280 }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [expandedItems, setExpandedItems] = useState({
    vendorManagement: true
  });

  const handleExpandClick = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (paths) => {
    return paths.some(path => location.pathname.startsWith(path));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin',
      exact: true
    },
    {
      id: 'vendorManagement',
      label: 'Vendor Management',
      icon: <Store />,
      expandable: true,
      children: [
        {
          id: 'allVendors',
          label: 'All Vendors',
          icon: <Group />,
          path: '/admin/vendors'
        },
        {
          id: 'vendorApplications',
          label: 'Vendor Applications',
          icon: <Assignment />,
          path: '/admin/vendors/applications'
        },
        {
          id: 'vendorPayouts',
          label: 'Vendor Payouts',
          icon: <Payment />,
          path: '/admin/vendors/payouts'
        },
        {
          id: 'commissionSettings',
          label: 'Commission Settings',
          icon: <Percent />,
          path: '/admin/vendors/commissions'
        }
      ]
    },
    {
      id: 'productManagement',
      label: 'Product Management',
      icon: <Inventory />,
      path: '/admin/products'
    },
    {
      id: 'orderManagement',
      label: 'Order Management',
      icon: <ShoppingCart />,
      path: '/admin/orders'
    },
    {
      id: 'customerManagement',
      label: 'Customer Management',
      icon: <People />,
      path: '/admin/customers'
    },
    {
      id: 'financialReports',
      label: 'Financial Reports',
      icon: <Assessment />,
      path: '/admin/reports'
    },
    {
      id: 'marketing',
      label: 'Marketing & Promotions',
      icon: <Campaign />,
      path: '/admin/marketing'
    },
    {
      id: 'reviews',
      label: 'Reviews & Ratings',
      icon: <RateReview />,
      path: '/admin/reviews'
    },
    {
      id: 'support',
      label: 'Support Center',
      icon: <Support />,
      path: '/admin/support'
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: <Settings />,
      path: '/admin/settings'
    }
  ];

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = item.exact 
      ? location.pathname === item.path
      : item.path && location.pathname.startsWith(item.path);
    
    const isChildrenActive = hasChildren && 
      item.children.some(child => location.pathname.startsWith(child.path));

    if (hasChildren) {
      return (
        <React.Fragment key={item.id}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleExpandClick(item.id)}
              sx={{
                pl: 2 + level * 2,
                backgroundColor: isChildrenActive ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color: isChildrenActive ? 'primary.main' : 'text.secondary',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isChildrenActive ? 600 : 400,
                    color: isChildrenActive ? 'primary.main' : 'text.primary'
                  }
                }}
              />
              {expandedItems[item.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem key={item.id} disablePadding>
        <ListItemButton
          onClick={() => handleNavigation(item.path)}
          sx={{
            pl: 2 + level * 2,
            backgroundColor: isItemActive ? 'action.selected' : 'transparent',
            borderRight: isItemActive ? `3px solid ${theme.palette.primary.main}` : 'none',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <ListItemIcon
            sx={{
              color: isItemActive ? 'primary.main' : 'text.secondary',
              minWidth: 40
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label}
            sx={{
              '& .MuiListItemText-primary': {
                fontWeight: isItemActive ? 600 : 400,
                color: isItemActive ? 'primary.main' : 'text.primary'
              }
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Admin Panel
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Multi-Vendor E-commerce
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ py: 1 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Sidebar Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Admin Panel v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper
        }
      }}
      ModalProps={{
        keepMounted: true // Better open performance on mobile
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AdminSidebar;