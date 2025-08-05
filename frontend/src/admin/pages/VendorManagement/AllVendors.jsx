import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Button,
  Avatar,
  Rating,
  Grid,
  Paper,
  InputAdornment,
  Menu,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Edit,
  Block,
  Delete,
  Store,
  TrendingUp,
  ShoppingCart,
  AttachMoney
} from '@mui/icons-material';

const AllVendors = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', vendor: null });

  // Mock vendor data
  const vendors = [
    {
      id: 1,
      name: 'TechStore Pro',
      email: 'contact@techstorepro.com',
      category: 'Electronics',
      products: 156,
      orders: 1247,
      revenue: 45230.50,
      status: 'active',
      rating: 4.8,
      joinDate: '2023-01-15',
      avatar: 'T'
    },
    {
      id: 2,
      name: 'Fashion Hub',
      email: 'info@fashionhub.com',
      category: 'Fashion',
      products: 89,
      orders: 892,
      revenue: 38950.25,
      status: 'active',
      rating: 4.6,
      joinDate: '2023-02-20',
      avatar: 'F'
    },
    {
      id: 3,
      name: 'Home Essentials',
      email: 'support@homeessentials.com',
      category: 'Home & Garden',
      products: 234,
      orders: 567,
      revenue: 32100.75,
      status: 'active',
      rating: 4.7,
      joinDate: '2023-03-10',
      avatar: 'H'
    },
    {
      id: 4,
      name: 'Beauty Corner',
      email: 'hello@beautycorner.com',
      category: 'Beauty',
      products: 67,
      orders: 445,
      revenue: 28750.00,
      status: 'suspended',
      rating: 4.5,
      joinDate: '2023-04-05',
      avatar: 'B'
    },
    {
      id: 5,
      name: 'Sports Gear',
      email: 'team@sportsgear.com',
      category: 'Sports',
      products: 123,
      orders: 334,
      revenue: 25600.30,
      status: 'pending',
      rating: 4.4,
      joinDate: '2023-05-12',
      avatar: 'S'
    },
    {
      id: 6,
      name: 'Digital World',
      email: 'contact@digitalworld.com',
      category: 'Electronics',
      products: 78,
      orders: 289,
      revenue: 22100.80,
      status: 'active',
      rating: 4.3,
      joinDate: '2023-06-18',
      avatar: 'D'
    },
    {
      id: 7,
      name: 'Book Haven',
      email: 'info@bookhaven.com',
      category: 'Books',
      products: 456,
      orders: 178,
      revenue: 18950.45,
      status: 'inactive',
      rating: 4.2,
      joinDate: '2023-07-22',
      avatar: 'B'
    }
  ];

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Books'];
  const statuses = ['active', 'inactive', 'suspended', 'pending'];

  // Filter vendors based on search and filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, vendor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVendor(vendor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVendor(null);
  };

  const handleAction = (action) => {
    setConfirmDialog({ open: true, action, vendor: selectedVendor });
    handleMenuClose();
  };

  const handleConfirmAction = () => {
    // Handle the action here (API call)
    console.log(`${confirmDialog.action} vendor:`, confirmDialog.vendor);
    setConfirmDialog({ open: false, action: '', vendor: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Vendors
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and monitor all vendors on your platform
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Store />
                </Avatar>
                <Box>
                  <Typography variant="h6">{vendors.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Vendors
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
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {vendors.filter(v => v.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Vendors
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
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <ShoppingCart />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {vendors.reduce((sum, v) => sum + v.orders, 0).toLocaleString()}
                  </Typography>
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
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {formatCurrency(vendors.reduce((sum, v) => sum + v.revenue, 0))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Products</TableCell>
                  <TableCell align="center">Orders</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVendors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((vendor) => (
                    <TableRow key={vendor.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {vendor.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {vendor.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {vendor.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell align="center">{vendor.products}</TableCell>
                      <TableCell align="center">{vendor.orders.toLocaleString()}</TableCell>
                      <TableCell align="right">{formatCurrency(vendor.revenue)}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Rating value={vendor.rating} readOnly size="small" precision={0.1} />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {vendor.rating}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                          color={getStatusColor(vendor.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => handleMenuClick(e, vendor)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredVendors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Vendor</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('suspend')}>
          <ListItemIcon>
            <Block fontSize="small" />
          </ListItemIcon>
          <ListItemText>Suspend</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: '', vendor: null })}
      >
        <DialogTitle>
          Confirm {confirmDialog.action?.charAt(0).toUpperCase() + confirmDialog.action?.slice(1)}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action} vendor "{confirmDialog.vendor?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', vendor: null })}>
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllVendors;