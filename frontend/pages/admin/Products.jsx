import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import RouteGuard from '../../components/RouteGuard';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      vendor: 'TechStore Pro',
      price: '$99.99',
      stock: 45,
      status: 'Active',
      category: 'Electronics',
      image: '/api/placeholder/150/150'
    },
    {
      id: 2,
      name: 'Summer Dress',
      vendor: 'Fashion Hub',
      price: '$59.99',
      stock: 23,
      status: 'Active',
      category: 'Fashion',
      image: '/api/placeholder/150/150'
    },
    {
      id: 3,
      name: 'Coffee Maker',
      vendor: 'Home Essentials',
      price: '$129.99',
      stock: 12,
      status: 'Low Stock',
      category: 'Home & Kitchen',
      image: '/api/placeholder/150/150'
    },
    {
      id: 4,
      name: 'Running Shoes',
      vendor: 'Sports Zone',
      price: '$89.99',
      stock: 0,
      status: 'Out of Stock',
      category: 'Sports',
      image: '/api/placeholder/150/150'
    },
    {
      id: 5,
      name: 'Programming Book',
      vendor: 'Book Paradise',
      price: '$39.99',
      stock: 67,
      status: 'Active',
      category: 'Books',
      image: '/api/placeholder/150/150'
    },
    {
      id: 6,
      name: 'Smartphone Case',
      vendor: 'TechStore Pro',
      price: '$19.99',
      stock: 156,
      status: 'Active',
      category: 'Electronics',
      image: '/api/placeholder/150/150'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      case 'Inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RouteGuard requiredRole="admin">
      <AdminLayout>
        <Head>
          <title>Product Management - Admin Portal</title>
          <meta name="description" content="Manage products in the admin portal" />
        </Head>
        
        <Box sx={{ height: '100%' }}>
          {/* Header Section */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              Product Management
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              Add New Product
            </Button>
          </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search products..."
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
        <Button variant="outlined">
          Filter by Category
        </Button>
        <Button variant="outlined">
          Filter by Status
        </Button>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  variant="square"
                  sx={{
                    width: '100%',
                    height: 200,
                    bgcolor: 'grey.100',
                    borderRadius: '4px 4px 0 0'
                  }}
                >
                  {product.name.charAt(0)}
                </Avatar>
                <Chip
                  label={product.status}
                  color={getStatusColor(product.status)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8
                  }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
                  {product.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  by {product.vendor}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category: {product.category}
                </Typography>
                
                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      {product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.stock}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" title="View">
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" color="info" title="Edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" title="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Summary Stats */}
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Product Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight={700}>
                  {products.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Products
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight={700}>
                  {products.filter(p => p.status === 'Active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Products
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" fontWeight={700}>
                  {products.filter(p => p.status === 'Low Stock').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Low Stock
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main" fontWeight={700}>
                  {products.filter(p => p.status === 'Out of Stock').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Out of Stock
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
      </AdminLayout>
    </RouteGuard>
  );
};

export default Products;