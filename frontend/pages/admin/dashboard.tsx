import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import RouteGuard from '../../components/RouteGuard';
import { getUserData, logout } from '../../utils/auth';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Store,
  ShoppingCart,
  AttachMoney,
  Inventory,
  LocalShipping,
  Star,
  MoreVert,
  Visibility,
  Edit,
  Block,
  CheckCircle,
  Warning,
  Error,
  Info,
  Timeline,
  PieChart,
  BarChart,
  Assessment
} from '@mui/icons-material';

import ordersData from '../../data/orders.json';
import vendorsData from '../../data/vendors.json';
import productsData from '../../data/products.json';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: `${color}.light`,
            color: `${color}.contrastText`,
            display: 'flex',
            alignItems: 'center'
          }}>
            {icon}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: isPositive ? 'success.main' : 'error.main' }}>
            {isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
            <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'medium' }}>
              {Math.abs(change)}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const AdminDashboard: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [adminData, setAdminData] = useState<any>(null);
  
  const [timeRange, setTimeRange] = useState('7d');
  
  useEffect(() => {
    // Get admin data from auth utilities
    const storedAdminData = getUserData('admin');
    if (storedAdminData) {
      setAdminData(storedAdminData);
    }
  }, []);
  
  // Calculate metrics from mock data
  const totalRevenue = ordersData.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
  const totalOrders = ordersData.length;
  const totalVendors = vendorsData.length;
  const activeVendors = vendorsData.filter(v => v.isVerified).length;
  const totalProducts = productsData.length;
  const totalCustomers = Array.from(new Set(ordersData.map(order => order.userId))).length;
  
  // Recent orders for table
  const recentOrders = ordersData.slice(0, 5);
  
  // Top vendors by revenue
  const vendorRevenue = vendorsData.map(vendor => {
    const vendorOrders = ordersData.filter(order => 
      order.items.some(item => {
        const product = productsData.find(p => p.id === item.productId);
        return product?.vendorId === vendor.id;
      })
    );
    const revenue = vendorOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
    return { ...vendor, revenue, orderCount: vendorOrders.length };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  
  // Order status distribution
  const orderStatusCounts = ordersData.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Recent activities (mock data)
  const recentActivities = [
    { type: 'order', message: 'New order #ORD001 received', time: '2 minutes ago', icon: <ShoppingCart />, color: 'primary' },
    { type: 'vendor', message: 'TechMart Store updated their profile', time: '15 minutes ago', icon: <Store />, color: 'info' },
    { type: 'product', message: '5 new products added by Fashion Hub', time: '1 hour ago', icon: <Inventory />, color: 'success' },
    { type: 'user', message: '12 new customers registered today', time: '2 hours ago', icon: <People />, color: 'secondary' },
    { type: 'alert', message: 'Low stock alert for 3 products', time: '3 hours ago', icon: <Warning />, color: 'warning' }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <RouteGuard requiredRole="admin">
      <AdminDashboardLayout>
        <Head>
          <title>Admin Dashboard - E-commerce Platform</title>
          <meta name="description" content="Admin dashboard for multi-vendor e-commerce platform" />
        </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your platform.
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="1d">Last 24 hours</MenuItem>
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 3 months</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {/* Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              change={12.5}
              icon={<AttachMoney />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Orders"
              value={totalOrders.toLocaleString()}
              change={8.2}
              icon={<ShoppingCart />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Active Vendors"
              value={`${activeVendors}/${totalVendors}`}
              change={5.1}
              icon={<Store />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Customers"
              value={totalCustomers.toLocaleString()}
              change={15.3}
              icon={<People />}
              color="secondary"
            />
          </Grid>
        </Grid>
        
        <Grid container spacing={3}>
          {/* Recent Orders */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              #{order.id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
                                {(order.shippingAddress?.name || `Customer ${order.userId}`).charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {order.shippingAddress?.name || `Customer ${order.userId}`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {order.userId}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {formatCurrency(order.pricing?.total || 0)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status) as any}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small">
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Recent Activities */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Recent Activities
                </Typography>
                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            bgcolor: `${activity.color}.light`,
                            color: `${activity.color}.main`,
                            width: 40,
                            height: 40
                          }}>
                            {activity.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {activity.message}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Top Vendors */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Top Vendors
                  </Typography>
                  <Button size="small" endIcon={<Visibility />}>
                    View All
                  </Button>
                </Box>
                <List sx={{ p: 0 }}>
                  {vendorRevenue.map((vendor, index) => (
                    <React.Fragment key={vendor.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar src={vendor.logo} sx={{ width: 48, height: 48 }}>
                            {vendor.businessName?.charAt(0) || 'V'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                {vendor.businessName}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {formatCurrency(vendor.revenue)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                                <Typography variant="caption">
                                  {vendor.rating} • {vendor.orderCount} orders
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={(vendor.revenue / vendorRevenue[0].revenue) * 100}
                                sx={{ width: 60, height: 4, borderRadius: 2 }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < vendorRevenue.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Order Status Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Order Status Overview
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(orderStatusCounts).map(([status, count]) => (
                    <Grid item xs={6} key={status}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {count}
                        </Typography>
                        <Chip
                          label={status}
                          color={getStatusColor(status) as any}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Quick Stats */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Platform Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 2, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        mb: 2
                      }}>
                        <Inventory fontSize="large" />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {totalProducts.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Products
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 2, 
                        borderRadius: '50%', 
                        bgcolor: 'success.light',
                        color: 'success.contrastText',
                        mb: 2
                      }}>
                        <LocalShipping fontSize="large" />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {ordersData.filter(o => o.status === 'Shipped').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Orders Shipped
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 2, 
                        borderRadius: '50%', 
                        bgcolor: 'warning.light',
                        color: 'warning.contrastText',
                        mb: 2
                      }}>
                        <Assessment fontSize="large" />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ₹{(totalRevenue / totalOrders).toFixed(0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Order Value
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 2, 
                        borderRadius: '50%', 
                        bgcolor: 'info.light',
                        color: 'info.contrastText',
                        mb: 2
                      }}>
                        <Star fontSize="large" />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        4.2
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Rating
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      </AdminDashboardLayout>
    </RouteGuard>
  );
};

export default AdminDashboard;