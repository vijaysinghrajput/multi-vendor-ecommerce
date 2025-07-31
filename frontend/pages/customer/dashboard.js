import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import RouteGuard from '../../components/RouteGuard';
import { getUserData, logout } from '../../utils/auth';
import UserLayout from '../../layouts/UserLayout';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Dashboard,
  Person,
  ShoppingBag,
  FavoriteOutlined,
  ShoppingCart,
  Assignment,
  RateReview,
  Support,
  Notifications,
  AccountCircle,
  ExitToApp,
  LocalShipping,
  Payment,
  History,
  Star,
  Visibility,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Pending
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import ordersData from '../../data/orders.json';
import productsData from '../../data/products.json';

const CustomerDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  useEffect(() => {
    // Get customer data from auth utilities
    const storedCustomerData = getUserData('user');
    if (storedCustomerData) {
      setCustomerData(storedCustomerData);
    }
  }, []);
  
  // Mock customer data (fallback)
  const currentCustomer = customerData || {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'customer'
  };
  
  // Filter customer orders
  const customerOrders = ordersData.filter(order => order.customerId === currentCustomer.id).slice(0, 5);
  
  // Mock wishlist items
  const wishlistItems = productsData.slice(0, 3);
  
  // Calculate metrics
  const totalOrders = customerOrders.length;
  const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const pendingOrders = customerOrders.filter(order => order.status === 'processing' || order.status === 'shipped').length;
  const completedOrders = customerOrders.filter(order => order.status === 'delivered').length;
  
  const handleLogout = () => {
    logout('user');
  };
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  
  const getOrderStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle />;
      case 'shipped': return <LocalShipping />;
      case 'processing': return <Pending />;
      case 'cancelled': return <Cancel />;
      default: return <Assignment />;
    }
  };
  
  const MetricCard = ({ title, value, icon, color, action }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
        {action && (
          <Button variant="outlined" size="small" fullWidth onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
  
  const QuickActionCard = ({ title, description, icon, color, onClick }) => (
    <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { elevation: 4 } }} onClick={onClick}>
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ mb: 2 }}>
          {React.cloneElement(icon, { sx: { fontSize: 48, color: color } })}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Button variant="contained" sx={{ bgcolor: color }} fullWidth>
          Access
        </Button>
      </CardContent>
    </Card>
  );
  
  return (
    <RouteGuard requiredRole="user">
      <UserLayout>
        <Head>
          <title>Customer Dashboard - ShopHub</title>
          <meta name="description" content="Manage your orders, wishlist, and account" />
        </Head>
        {/* Welcome Section */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.dark', mr: 3, width: 64, height: 64 }}>
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome back, {currentCustomer.firstName || 'Customer'}!
              </Typography>
              <Typography variant="body1">
                Manage your orders, wishlist, reviews, and account settings from your personal dashboard.
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Orders"
              value={totalOrders}
              icon={<ShoppingBag />}
              color="primary.main"
              action={{
                label: "View All",
                onClick: () => router.push('/orders')
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Spent"
              value={`₹${totalSpent.toLocaleString()}`}
              icon={<Payment />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Pending Orders"
              value={pendingOrders}
              icon={<Pending />}
              color="warning.main"
              action={{
                label: "Track",
                onClick: () => router.push('/orders?status=pending')
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Completed Orders"
              value={completedOrders}
              icon={<CheckCircle />}
              color="info.main"
            />
          </Grid>
        </Grid>
        
        {/* Quick Actions */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              title="My Orders"
              description="View and track your current and past orders"
              icon={<ShoppingBag />}
              color="primary.main"
              onClick={() => router.push('/orders')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              title="Wishlist"
              description="Manage your saved items and favorites"
              icon={<FavoriteOutlined />}
              color="secondary.main"
              onClick={() => router.push('/wishlist')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              title="Shopping Cart"
              description="Review items in your cart and checkout"
              icon={<ShoppingCart />}
              color="success.main"
              onClick={() => router.push('/cart')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              title="Returns & Exchanges"
              description="Manage returns and exchange requests"
              icon={<Assignment />}
              color="warning.main"
              onClick={() => router.push('/returns')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              title="Reviews"
              description="Write and manage your product reviews"
              icon={<RateReview />}
              color="info.main"
              onClick={() => router.push('/reviews')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <QuickActionCard
              title="Support"
              description="Get help and contact customer support"
              icon={<Support />}
              color="error.main"
              onClick={() => router.push('/support')}
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Orders
                  </Typography>
                  <Button size="small" endIcon={<Visibility />} onClick={() => router.push('/orders')}>
                    View All
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>
                            {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>₹{(order.totalAmount || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip
                              icon={getOrderStatusIcon(order.status)}
                              label={order.status || 'Pending'}
                              color={getOrderStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Wishlist */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Wishlist Items
                  </Typography>
                  <Button size="small" endIcon={<Visibility />} onClick={() => router.push('/wishlist')}>
                    View All
                  </Button>
                </Box>
                <List>
                  {wishlistItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: 'primary.light' }}>
                            {item.title?.charAt(0) || 'P'}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title || 'Product Name'}
                          secondary={`₹${(item.price || 0).toLocaleString()}`}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2">
                            {item.rating || 4.5}
                          </Typography>
                        </Box>
                      </ListItem>
                      {index < wishlistItems.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Account Management */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Management
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Person />}
                  onClick={() => router.push('/profile')}
                >
                  Edit Profile
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Notifications />}
                  onClick={() => router.push('/notifications')}
                >
                  Notifications
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Payment />}
                  onClick={() => router.push('/payment-methods')}
                >
                  Payment Methods
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LocalShipping />}
                  onClick={() => router.push('/addresses')}
                >
                  Addresses
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </UserLayout>
    </RouteGuard>
  );
};

export default CustomerDashboard;