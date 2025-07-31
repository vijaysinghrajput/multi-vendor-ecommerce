import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Settings,
  AccountCircle,
  ExitToApp,
  DarkMode,
  LightMode,
  Storefront,
  Dashboard,
  Store,
  Assessment,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { logout } from '../../utils/auth';

interface VendorHeaderProps {
  vendorData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    businessName?: string;
  };
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

const VendorHeader: React.FC<VendorHeaderProps> = ({
  vendorData,
  onThemeToggle,
  isDarkMode = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: any) => state.ui);
  
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null);

  const handleSidebarToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null);
  };

  const handleLogout = () => {
    logout('vendor');
    router.push('/vendor/login');
    handleProfileMenuClose();
  };

  const handleProfileClick = () => {
    router.push('/vendor/profile');
    handleProfileMenuClose();
  };

  const handleSettingsClick = () => {
    router.push('/vendor/settings');
    handleProfileMenuClose();
  };

  const vendorName = vendorData?.firstName && vendorData?.lastName 
    ? `${vendorData.firstName} ${vendorData.lastName}`
    : vendorData?.email?.split('@')[0] || 'Vendor';

  const vendorInitials = vendorData?.firstName && vendorData?.lastName
    ? `${vendorData.firstName.charAt(0)}${vendorData.lastName.charAt(0)}`
    : vendorName.charAt(0).toUpperCase();

  const businessName = vendorData?.businessName || 'My Store';

  // Mock notifications - in real app, this would come from props or state
  const notifications = [
    { id: 1, title: 'New order received', time: '2 min ago', unread: true },
    { id: 2, title: 'Product review posted', time: '10 min ago', unread: true },
    { id: 3, title: 'Inventory low warning', time: '30 min ago', unread: false },
    { id: 4, title: 'Payout processed', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[1],
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* Sidebar Toggle */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={handleSidebarToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Storefront sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                display: { xs: 'none', sm: 'block' },
                lineHeight: 1.2,
              }}
            >
              Vendor Portal
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: { xs: 'none', md: 'block' },
                lineHeight: 1,
              }}
            >
              {businessName}
            </Typography>
          </Box>
        </Box>

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              color="inherit"
              onClick={onThemeToggle}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account">
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0, ml: 1 }}
            >
              <Avatar
                src={vendorData?.avatar}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                }}
              >
                {vendorInitials}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {vendorName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {vendorData?.email || 'vendor@example.com'}
          </Typography>
          <Typography variant="caption" color="primary">
            {businessName}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => router.push('/vendor/store/profile')}>
          <ListItemIcon>
            <Store fontSize="small" />
          </ListItemIcon>
          <ListItemText>Store Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => router.push('/vendor/reports/sales')}>
          <ListItemIcon>
            <Assessment fontSize="small" />
          </ListItemIcon>
          <ListItemText>Analytics</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSettingsClick}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => router.push('/vendor/dashboard')}>
          <ListItemIcon>
            <Dashboard fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 300,
            maxHeight: 400,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationMenuClose}>
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: notification.unread ? 'bold' : 'normal',
                  mb: 0.5,
                }}
              >
                {notification.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
              {notification.unread && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                />
              )}
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => router.push('/vendor/notifications')}>
          <Typography variant="body2" color="primary" sx={{ textAlign: 'center', width: '100%' }}>
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default VendorHeader;