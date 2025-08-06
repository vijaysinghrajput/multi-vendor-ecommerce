import React from 'react';
import Head from 'next/head';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import RouteGuard from '../../components/RouteGuard';

const Dashboard = () => {
  const statsCards = [
    {
      title: 'Total Revenue',
      value: '$125,000',
      icon: TrendingUpIcon,
      color: '#4caf50',
      change: '+12.5%'
    },
    {
      title: 'Total Customers',
      value: '1,250',
      icon: PeopleIcon,
      color: '#2196f3',
      change: '+8.2%'
    },
    {
      title: 'Active Vendors',
      value: '85',
      icon: StoreIcon,
      color: '#ff9800',
      change: '+3.1%'
    },
    {
      title: 'Total Orders',
      value: '3,400',
      icon: ShoppingCartIcon,
      color: '#9c27b0',
      change: '+15.7%'
    }
  ];

  return (
    <RouteGuard requiredRole="admin">
      <AdminLayout>
        <Head>
          <title>Dashboard - Admin Portal</title>
          <meta name="description" content="Admin dashboard overview" />
        </Head>
        
        <Box sx={{ height: '100%' }}>
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

      {/* Charts Section */}
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
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">
                  Chart component would go here
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Box key={item} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Activity Item {item}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item} minutes ago
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.random() * 100} 
                    sx={{ mt: 1 }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
      </AdminLayout>
    </RouteGuard>
  );
};

export default Dashboard;