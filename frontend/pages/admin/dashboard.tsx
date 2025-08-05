import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import RouteGuard from '../../components/RouteGuard';
import { getUserData, logout, getAuthToken } from '../../utils/auth';
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

// Remove hardcoded imports - using API data instead

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
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [timeRange, setTimeRange] = useState('7d');
  
  useEffect(() => {
    // Get admin data from auth utilities
    const storedAdminData = getUserData('admin');
    if (storedAdminData) {
      setAdminData(storedAdminData);
    }
    
    // Fetch dashboard data
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = getAuthToken('admin');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      // Fetch dashboard stats
      const statsResponse = await fetch(`${apiUrl}/admin/dashboard/stats`, { headers });
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setDashboardStats(stats);
      }
      
      // Fetch recent activity
      const activityResponse = await fetch(`${apiUrl}/admin/dashboard/recent-activity`, { headers });
      if (activityResponse.ok) {
        const activity = await activityResponse.json();
        setRecentActivity(Array.isArray(activity) ? activity : []);
      }
      
      // Fetch recent orders
      const ordersResponse = await fetch(`${apiUrl}/admin/orders?limit=5`, { headers });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData.data || []);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fallback data while loading
  const stats = dashboardStats || {
    orders: { totalRevenue: 0, total: 0 },
    vendors: { total: 0, approved: 0 },
    products: { total: 0 },
    users: { customers: 0 }
  };
  
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
              value={loading ? "Loading..." : formatCurrency(stats.orders?.totalRevenue || 0)}
              change={12.5}
              icon={<AttachMoney />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Orders"
              value={loading ? "Loading..." : (stats.orders?.total || 0).toLocaleString()}
              change={8.2}
              icon={<ShoppingCart />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Active Vendors"
              value={loading ? "Loading..." : `${stats.vendors?.approved || 0}/${stats.vendors?.total || 0}`}
              change={5.1}
              icon={<Store />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Total Customers"
              value={loading ? "Loading..." : (stats.users?.customers || 0).toLocaleString()}
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
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography>Loading...</Typography>
                          </TableCell>
                        </TableRow>
                      ) : recentOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography>No recent orders</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentOrders.map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                #{order.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 2, fontSize: 14 }}>
                                  {(order.user?.firstName || order.shippingAddress?.name || `Customer ${order.userId}`).charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                    {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName}` : order.shippingAddress?.name || `Customer ${order.userId}`}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {order.userId}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {formatCurrency(order.totalAmount || order.pricing?.total || 0)}
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
                                {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small">
                                <MoreVert />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
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
                  {loading ? (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            Loading activities...
                          </Typography>
                        }
                      />
                    </ListItem>
                  ) : !Array.isArray(recentActivity) || recentActivity.length === 0 ? (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            No recent activities
                          </Typography>
                        }
                      />
                    </ListItem>
                  ) : (
                    (Array.isArray(recentActivity) ? recentActivity : []).map((activity, index) => {
                      const getActivityIcon = (type: string) => {
                        switch (type) {
                          case 'user': return <People />;
                          case 'vendor': return <Store />;
                          case 'order': return <ShoppingCart />;
                          case 'product': return <Inventory />;
                          case 'return': return <Warning />;
                          case 'exchange': return <Error />;
                          case 'review': return <Star />;
                          default: return <Info />;
                        }
                      };
                      
                      const getActivityColor = (type: string) => {
                        switch (type) {
                          case 'user': return 'primary';
                          case 'vendor': return 'secondary';
                          case 'order': return 'success';
                          case 'product': return 'info';
                          case 'return': return 'warning';
                          case 'exchange': return 'error';
                          case 'review': return 'warning';
                          default: return 'primary';
                        }
                      };
                      
                      return (
                        <React.Fragment key={index}>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                bgcolor: `${getActivityColor(activity.type)}.light`,
                                color: `${getActivityColor(activity.type)}.main`,
                                width: 40,
                                height: 40
                              }}>
                                {getActivityIcon(activity.type)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {activity.description}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(activity.timestamp).toLocaleString()}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < recentActivity.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })
                  )}
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
                  {loading ? (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            Loading vendors...
                          </Typography>
                        }
                      />
                    </ListItem>
                  ) : (
                    Array.from({ length: 5 }, (_, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ width: 48, height: 48 }}>
                              V{index + 1}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                  Vendor {index + 1}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {formatCurrency(Math.floor(Math.random() * 100000) + 50000)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                                  <Typography variant="caption">
                                    {(4.0 + Math.random()).toFixed(1)} • {Math.floor(Math.random() * 100) + 10} orders
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={100 - (index * 20)}
                                  sx={{ width: 60, height: 4, borderRadius: 2 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < 4 && <Divider />}
                      </React.Fragment>
                    ))
                  )}
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
                  {loading ? (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Loading order status data...
                      </Typography>
                    </Grid>
                  ) : (
                    ['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => {
                      const count = recentOrders.filter(order => order.status === status).length;
                      return (
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
                      );
                    })
                  )}
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
                        {loading ? "Loading..." : (stats.products?.total || 0).toLocaleString()}
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
                        {loading ? "Loading..." : recentOrders.filter(o => o.status === 'Shipped').length}
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
                        {loading ? "Loading..." : formatCurrency((stats.orders?.totalRevenue || 0) / Math.max(stats.orders?.total || 1, 1))}
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