import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Head from 'next/head';

// Example of how to use the AdminLayout
const AdminDashboardExample = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalOrders: 0
  });

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setDashboardData({
          totalRevenue: 125000,
          totalCustomers: 1250,
          totalVendors: 85,
          totalOrders: 3400
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${dashboardData.totalRevenue.toLocaleString()}`,
      icon: TrendingUpIcon,
      color: '#4caf50',
      change: '+12.5%'
    },
    {
      title: 'Total Customers',
      value: dashboardData.totalCustomers.toLocaleString(),
      icon: PeopleIcon,
      color: '#2196f3',
      change: '+8.2%'
    },
    {
      title: 'Active Vendors',
      value: dashboardData.totalVendors.toLocaleString(),
      icon: StoreIcon,
      color: '#ff9800',
      change: '+3.1%'
    },
    {
      title: 'Total Orders',
      value: dashboardData.totalOrders.toLocaleString(),
      icon: ShoppingCartIcon,
      color: '#9c27b0',
      change: '+15.7%'
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <Head>
          <title>Dashboard | Admin Portal</title>
        </Head>
        <Container maxWidth="xl">
          <LoadingSpinner message="Loading dashboard data..." />
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <Head>
        <title>Dashboard | Admin Portal</title>
        <meta name="description" content="Admin dashboard for multi-vendor e-commerce platform" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: card.color,
                          width: 48,
                          height: 48,
                          mr: 2
                        }}
                      >
                        <Icon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" fontWeight={700}>
                          {card.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.title}
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="success.main"
                      fontWeight={600}
                    >
                      {card.change} from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Additional Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Sales Analytics
              </Typography>
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}
              >
                Chart component would go here
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}
              >
                Activity feed would go here
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboardExample;