import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Store,
  AttachMoney,
  Assignment,
  Notifications,
  Star
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,563',
      change: '+12.5%',
      icon: <AttachMoney />,
      color: '#4caf50',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: '1,847',
      change: '+8.2%',
      icon: <ShoppingCart />,
      color: '#2196f3',
      trend: 'up'
    },
    {
      title: 'Active Customers',
      value: '3,256',
      change: '+15.3%',
      icon: <People />,
      color: '#ff9800',
      trend: 'up'
    },
    {
      title: 'Active Vendors',
      value: '89',
      change: '+5.1%',
      icon: <Store />,
      color: '#9c27b0',
      trend: 'up'
    }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      vendor: 'TechStore Pro',
      amount: '$299.99',
      status: 'Completed',
      date: '2024-01-15'
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      vendor: 'Fashion Hub',
      amount: '$159.50',
      status: 'Processing',
      date: '2024-01-15'
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      vendor: 'Home Essentials',
      amount: '$89.99',
      status: 'Shipped',
      date: '2024-01-14'
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Wilson',
      vendor: 'Beauty Corner',
      amount: '$199.99',
      status: 'Pending',
      date: '2024-01-14'
    },
    {
      id: '#ORD-005',
      customer: 'David Brown',
      vendor: 'Sports Gear',
      amount: '$349.99',
      status: 'Completed',
      date: '2024-01-13'
    }
  ];

  const topVendors = [
    {
      name: 'TechStore Pro',
      revenue: '$45,230',
      orders: 234,
      rating: 4.8,
      growth: 15.2
    },
    {
      name: 'Fashion Hub',
      revenue: '$38,950',
      orders: 189,
      rating: 4.6,
      growth: 12.8
    },
    {
      name: 'Home Essentials',
      revenue: '$32,100',
      orders: 156,
      rating: 4.7,
      growth: 9.5
    },
    {
      name: 'Beauty Corner',
      revenue: '$28,750',
      orders: 143,
      rating: 4.5,
      growth: 8.3
    },
    {
      name: 'Sports Gear',
      revenue: '$25,600',
      orders: 128,
      rating: 4.4,
      growth: 6.7
    }
  ];

  const recentActivities = [
    {
      type: 'order',
      message: 'New order #ORD-001 received from John Doe',
      time: '5 minutes ago',
      icon: <ShoppingCart />
    },
    {
      type: 'vendor',
      message: 'New vendor application from "Digital World"',
      time: '15 minutes ago',
      icon: <Store />
    },
    {
      type: 'payout',
      message: 'Payout of $2,450 processed for TechStore Pro',
      time: '1 hour ago',
      icon: <AttachMoney />
    },
    {
      type: 'review',
      message: 'New 5-star review for Fashion Hub',
      time: '2 hours ago',
      icon: <Star />
    },
    {
      type: 'system',
      message: 'System maintenance completed successfully',
      time: '3 hours ago',
      icon: <Notifications />
    }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'shipped': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your platform today.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: stat.trend === 'up' ? 'success.main' : 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      {stat.change}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.vendor}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Vendors */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Vendors
              </Typography>
              <List>
                {topVendors.map((vendor, index) => (
                  <ListItem key={index} divider={index < topVendors.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {vendor.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={vendor.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Revenue: {vendor.revenue} • Orders: {vendor.orders}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                            <Typography variant="body2">{vendor.rating}</Typography>
                            <Box sx={{ ml: 1, flexGrow: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={vendor.growth * 5} 
                                sx={{ height: 4, borderRadius: 2 }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} divider={index < recentActivities.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                        {React.cloneElement(activity.icon, { sx: { fontSize: 16 } })}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;