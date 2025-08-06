import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tab,
  Tabs
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CompleteIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import RouteGuard from '../../components/RouteGuard';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const orders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      vendor: 'TechStore Pro',
      amount: '$299.99',
      status: 'Pending',
      date: '2024-01-20',
      items: 2
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      vendor: 'Fashion Hub',
      amount: '$156.50',
      status: 'Shipped',
      date: '2024-01-19',
      items: 1
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      vendor: 'Home Essentials',
      amount: '$89.99',
      status: 'Delivered',
      date: '2024-01-18',
      items: 3
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Wilson',
      vendor: 'Sports Zone',
      amount: '$425.00',
      status: 'Processing',
      date: '2024-01-17',
      items: 1
    },
    {
      id: '#ORD-005',
      customer: 'David Brown',
      vendor: 'Book Paradise',
      amount: '$67.80',
      status: 'Cancelled',
      date: '2024-01-16',
      items: 4
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Shipped':
        return 'info';
      case 'Processing':
        return 'warning';
      case 'Pending':
        return 'default';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filterOrdersByTab = (orders, tabValue) => {
    switch (tabValue) {
      case 1:
        return orders.filter(order => order.status === 'Pending');
      case 2:
        return orders.filter(order => order.status === 'Processing');
      case 3:
        return orders.filter(order => order.status === 'Shipped');
      case 4:
        return orders.filter(order => order.status === 'Delivered');
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrdersByTab(orders, tabValue).filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RouteGuard requiredRole="admin">
      <AdminLayout>
        <Head>
          <title>Order Management - Admin Portal</title>
          <meta name="description" content="Manage orders in the admin portal" />
        </Head>
        
        <Box sx={{ height: '100%' }}>
          {/* Header Section */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              Order Management
            </Typography>
            <Button variant="contained" color="primary">
              Export Orders
            </Button>
          </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Orders" />
          <Tab label="Pending" />
          <Tab label="Processing" />
          <Tab label="Shipped" />
          <Tab label="Delivered" />
        </Tabs>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>

      {/* Orders Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600} color="primary">
                      {order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.customer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.vendor}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {order.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.items} items
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton size="small" title="View Details">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" title="Update Shipping">
                        <ShippingIcon />
                      </IconButton>
                      <IconButton size="small" title="Mark Complete">
                        <CompleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary Stats */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="primary">
            {orders.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Orders
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="warning.main">
            {orders.filter(o => o.status === 'Pending').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending Orders
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="info.main">
            {orders.filter(o => o.status === 'Shipped').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Shipped Orders
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="success.main">
            {orders.filter(o => o.status === 'Delivered').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Delivered Orders
          </Typography>
        </Paper>
      </Box>
    </Box>
      </AdminLayout>
    </RouteGuard>
  );
};

export default Orders;