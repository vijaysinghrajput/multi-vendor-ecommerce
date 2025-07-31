import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Paper
} from '@mui/material';
import {
  ShoppingCart,
  FavoriteOutlined,
  RateReview,
  TrendingUp,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import RouteGuard from '../../components/RouteGuard';
import ordersData from '../../data/orders.json';
import productsData from '../../data/products.json';

const UserDashboard = () => {
  // Mock user data - in real app, this would come from user context/API
  const userId = 'user123';
  
  // Filter user's orders
  const userOrders = ordersData.filter(order => order.userId === userId);
  
  // Calculate metrics
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
  const wishlistItems = 12; // Mock data
  const reviewsGiven = 8; // Mock data
  
  // Recent orders (last 5)
  const recentOrders = userOrders.slice(0, 5);
  
  // Mock wishlist items
  const wishlistProducts = productsData.slice(0, 4);
  
  // Mock recommended products
  const recommendedProducts = productsData.slice(4, 8);
  
  // Order status distribution
  const orderStatusCounts = userOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle color="success" />;
      case 'shipped': return <LocalShipping color="info" />;
      case 'cancelled': return <Cancel color="error" />;
      default: return <Schedule color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  return (
    <RouteGuard allowedRoles={['user']}>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              My Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's an overview of your account activity.
            </Typography>
          </Box>

          {/* Metrics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{totalOrders}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Orders
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp color="success" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">${totalSpent.toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Spent
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FavoriteOutlined color="error" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{wishlistItems}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Wishlist Items
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RateReview color="info" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h4">{reviewsGiven}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Reviews Given
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Recent Orders */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Orders
                  </Typography>
                  <List>
                    {recentOrders.map((order) => (
                      <ListItem key={order.id} divider>
                        <ListItemAvatar>
                          {getStatusIcon(order.status)}
                        </ListItemAvatar>
                        <ListItemText
                          primary={`Order #${order.orderNumber}`}
                          secondary={`${order.orderDate} • $${order.pricing?.total || 0}`}
                        />
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button variant="outlined">View All Orders</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Order Status Overview */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Status
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(orderStatusCounts).map(([status, count]) => (
                      <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {status}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {count}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Wishlist */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Wishlist Items
                  </Typography>
                  <List>
                    {wishlistProducts.map((product) => (
                      <ListItem key={product.id}>
                        <ListItemAvatar>
                          <Avatar src={product.images?.[0]} sx={{ width: 48, height: 48 }}>
                            {product.title?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={product.title}
                          secondary={`$${product.price}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button variant="outlined">View Wishlist</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recommended Products */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommended for You
                  </Typography>
                  <List>
                    {recommendedProducts.map((product) => (
                      <ListItem key={product.id}>
                        <ListItemAvatar>
                          <Avatar src={product.images?.[0]} sx={{ width: 48, height: 48 }}>
                            {product.title?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={product.title}
                          secondary={`$${product.price}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button variant="outlined">View All</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </RouteGuard>
  );
};

export default UserDashboard;