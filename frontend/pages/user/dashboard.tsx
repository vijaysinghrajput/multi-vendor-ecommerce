import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import RouteGuard from '../../components/RouteGuard';
import { getUserData, logout } from '../../utils/auth';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Avatar,
  Chip,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Person,
  ShoppingCart,
  FavoriteOutlined,
  HistoryOutlined,
  AccountCircle,
  ExitToApp,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import Head from 'next/head';

interface UserData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Get user data from auth utilities
    const storedUserData = getUserData('user');
    if (storedUserData) {
      setUserData(storedUserData);
    }
  }, []);

  const handleLogout = () => {
    logout('user');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <RouteGuard requiredRole="user">
      <Head>
        <title>Customer Dashboard - Multi-Vendor E-commerce</title>
        <meta name="description" content="Customer dashboard for multi-vendor e-commerce platform" />
      </Head>

      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Customer Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              icon={<Person />}
              label={userData.role.toUpperCase()}
              color="secondary"
              size="small"
              sx={{ mr: 2 }}
            />
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <AccountCircle sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.dark', mr: 2, width: 56, height: 56 }}>
                  <Person sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Welcome back, {userData.firstName || userData.email}!
                  </Typography>
                  <Typography variant="body1">
                    Manage your orders, wishlist, and account settings from your customer dashboard.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <ShoppingCart sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" component="h2" gutterBottom>
                  My Orders
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  View and track your current and past orders
                </Typography>
                <Button variant="contained" fullWidth>
                  View Orders
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <FavoriteOutlined sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h6" component="h2" gutterBottom>
                  Wishlist
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Manage your saved items and favorites
                </Typography>
                <Button variant="contained" color="secondary" fullWidth>
                  View Wishlist
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <HistoryOutlined sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" component="h2" gutterBottom>
                  Order History
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Browse your complete purchase history
                </Typography>
                <Button variant="contained" color="info" fullWidth>
                  View History
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Account Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Account Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {userData.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Account Type
                    </Typography>
                    <Chip label={userData.role.toUpperCase()} color="primary" size="small" />
                  </Grid>
                  {userData.firstName && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        First Name
                      </Typography>
                      <Typography variant="body1">
                        {userData.firstName}
                      </Typography>
                    </Grid>
                  )}
                  {userData.lastName && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Last Name
                      </Typography>
                      <Typography variant="body1">
                        {userData.lastName}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Button variant="outlined" sx={{ mr: 2 }}>
                    Edit Profile
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleLogout}>
                    Logout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </RouteGuard>
  );
};

export default UserDashboard;