import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import RouteGuard from '../../components/RouteGuard';
import { getUserData, logout } from '../../utils/auth';
import VendorDashboardLayout from '../../layouts/VendorDashboardLayout';
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
  LinearProgress,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  People,
  AttachMoney,
  Inventory,
  Star,
  Visibility,
  Edit,
  Add,
  Notifications,
  Analytics,
  Store,
  LocalShipping,
  Assignment
} from '@mui/icons-material';
// Charts temporarily disabled - recharts not installed
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts';

import ordersData from '../../data/orders.json';
import productsData from '../../data/products.json';
import vendorsData from '../../data/vendors.json';

const VendorDashboard: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [vendorData, setVendorData] = useState<any>(null);
  
  useEffect(() => {
    // Get vendor data from auth utilities
    const storedVendorData = getUserData('vendor');
    if (storedVendorData) {
      setVendorData(storedVendorData);
    }
  }, []);
  
  // Mock vendor data (fallback to first vendor if no auth data)
  const currentVendor = vendorData || vendorsData[0];
  const vendorProducts = productsData.filter(p => p.vendorId === currentVendor.id);
  const vendorOrders = ordersData.filter(order => 
    order.items && order.items.some(item => 
      vendorProducts.some(product => product.title === item.productTitle)
    )
  );
  
  // Calculate metrics
  const totalRevenue = vendorOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
  const totalOrders = vendorOrders.length;
  const totalProducts = vendorProducts.length;
  const averageRating = vendorProducts.length > 0 ? vendorProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / vendorProducts.length : 0;
  
  // Mock data for charts
  const salesData = [
    { month: 'Jan', sales: 12000, orders: 45 },
    { month: 'Feb', sales: 15000, orders: 52 },
    { month: 'Mar', sales: 18000, orders: 61 },
    { month: 'Apr', sales: 22000, orders: 73 },
    { month: 'May', sales: 25000, orders: 84 },
    { month: 'Jun', sales: 28000, orders: 92 }
  ];
  
  const categoryData = [
    { name: 'Electronics', value: 40, color: '#8884d8' },
    { name: 'Fashion', value: 30, color: '#82ca9d' },
    { name: 'Home', value: 20, color: '#ffc658' },
    { name: 'Books', value: 10, color: '#ff7300' }
  ];
  
  const recentOrders = vendorOrders.slice(0, 5).map(order => ({
    ...order,
    customerName: order.shippingAddress?.name || 'Customer Name',
    totalAmount: order.pricing?.total || 0,
    orderDate: order.orderDate || new Date().toISOString()
  }));
  const topProducts = vendorProducts
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5)
    .map(product => ({
      ...product,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      price: product.price || 0
    }));
  
  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  
  const StatCard = ({ title, value, change, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {value}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {change > 0 ? (
                  <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={change > 0 ? 'success.main' : 'error.main'}
                >
                  {Math.abs(change)}% from last month
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
  
  return (
    <RouteGuard requiredRole="vendor">
      <VendorDashboardLayout>
        <Head>
          <title>Vendor Dashboard - ShopHub</title>
          <meta name="description" content="Manage your store, products, and orders" />
        </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Welcome back, {currentVendor.businessName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your store today.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<Analytics />}>
              View Analytics
            </Button>
            <Button variant="contained" startIcon={<Add />}>
              Add Product
            </Button>
          </Box>
        </Box>
        
        {/* Quick Actions Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            You have 3 pending orders to process and 2 products running low on stock.
            <Button size="small" sx={{ ml: 1 }}>View Details</Button>
          </Typography>
        </Alert>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`₹${totalRevenue.toLocaleString()}`}
              change={12.5}
              icon={<AttachMoney />}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={totalOrders}
              change={8.2}
              icon={<ShoppingBag />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Products"
              value={totalProducts}
              change={-2.1}
              icon={<Inventory />}
              color="warning.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Average Rating"
              value={averageRating.toFixed(1)}
              change={5.3}
              icon={<Star />}
              color="info.main"
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          {/* Sales Chart */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales Overview
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                  <Typography color="text.secondary">Sales Chart Placeholder</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Category Distribution */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales by Category
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                  <Typography color="text.secondary">Category Distribution Chart Placeholder</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  {categoryData.map((category) => (
                    <Box key={category.name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          bgcolor: category.color,
                          borderRadius: '50%',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {category.value}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recent Orders */}
          <Grid item xs={12} lg={7}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Recent Orders
                  </Typography>
                  <Button size="small" endIcon={<Visibility />}>
                    View All
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status || 'Pending'}
                              color={getOrderStatusColor(order.status || 'pending') as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Top Products */}
          <Grid item xs={12} lg={5}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Top Rated Products
                  </Typography>
                  <Button size="small" endIcon={<Visibility />}>
                    View All
                  </Button>
                </Box>
                <Box>
                  {topProducts.map((product, index) => (
                    <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Inventory sx={{ color: 'grey.500' }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {product.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star sx={{ color: 'gold', fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {product.rating} ({product.reviewCount} reviews)
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" color="primary">
                        ₹{product.price.toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Quick Actions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Add />}
                      sx={{ py: 2 }}
                    >
                      Add New Product
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Assignment />}
                      sx={{ py: 2 }}
                    >
                      Manage Orders
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Store />}
                      sx={{ py: 2 }}
                    >
                      Store Settings
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Analytics />}
                      sx={{ py: 2 }}
                    >
                      View Analytics
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Performance Metrics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Store Views
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        2,847
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        +15% this month
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Conversion Rate
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        3.2%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={32}
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        +0.5% this month
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Response Time
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        2.1h
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={85}
                        color="info"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        -0.3h this month
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Customer Satisfaction
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        4.8/5
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={96}
                        color="warning"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        +0.2 this month
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </VendorDashboardLayout>
    </RouteGuard>
  );
};

export default VendorDashboard;