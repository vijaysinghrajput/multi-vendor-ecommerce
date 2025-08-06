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
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import RouteGuard from '../../components/RouteGuard';

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const vendors = [
    {
      id: 1,
      name: 'TechStore Pro',
      email: 'contact@techstore.com',
      status: 'Active',
      joinDate: '2024-01-15',
      revenue: '$45,000',
      products: 150
    },
    {
      id: 2,
      name: 'Fashion Hub',
      email: 'info@fashionhub.com',
      status: 'Pending',
      joinDate: '2024-02-20',
      revenue: '$28,500',
      products: 89
    },
    {
      id: 3,
      name: 'Home Essentials',
      email: 'support@homeessentials.com',
      status: 'Active',
      joinDate: '2024-01-08',
      revenue: '$67,200',
      products: 234
    },
    {
      id: 4,
      name: 'Sports Zone',
      email: 'hello@sportszone.com',
      status: 'Suspended',
      joinDate: '2024-03-01',
      revenue: '$15,800',
      products: 67
    },
    {
      id: 5,
      name: 'Book Paradise',
      email: 'contact@bookparadise.com',
      status: 'Active',
      joinDate: '2024-02-14',
      revenue: '$32,100',
      products: 412
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RouteGuard requiredRole="admin">
      <AdminLayout>
        <Head>
          <title>Vendor Management - Admin Portal</title>
          <meta name="description" content="Manage vendors in the admin portal" />
        </Head>
        
        <Box sx={{ height: '100%' }}>
          {/* Header Section */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              Vendor Management
            </Typography>
            <Button variant="contained" color="primary">
              Add New Vendor
            </Button>
          </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search vendors..."
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

      {/* Vendors Table */}
      <Paper sx={{ overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Revenue</TableCell>
                <TableCell>Products</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ mr: 2, bgcolor: 'primary.main' }}
                      >
                        {vendor.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {vendor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vendor.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={vendor.status}
                      color={getStatusColor(vendor.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(vendor.joinDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {vendor.revenue}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {vendor.products} items
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton size="small" title="View Details">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" title="Edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" title="More Options">
                        <MoreVertIcon />
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
            {vendors.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Vendors
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="success.main">
            {vendors.filter(v => v.status === 'Active').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Active Vendors
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="warning.main">
            {vendors.filter(v => v.status === 'Pending').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pending Approval
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" color="error.main">
            {vendors.filter(v => v.status === 'Suspended').length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Suspended
          </Typography>
        </Paper>
      </Box>
    </Box>
      </AdminLayout>
    </RouteGuard>
  );
};

export default Vendors;