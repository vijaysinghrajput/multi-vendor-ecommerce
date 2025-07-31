import React, { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Badge
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Edit,
  Block,
  CheckCircle,
  Visibility,
  Delete,
  Store,
  Star,
  LocationOn,
  Phone,
  Email,
  Language,
  TrendingUp,
  TrendingDown,
  Warning,
  Verified,
  Business,
  Schedule,
  AttachMoney,
  ShoppingCart,
  People,
  Assessment
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import vendorsData from '../../data/vendors.json';
import ordersData from '../../data/orders.json';
import productsData from '../../data/products.json';

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  totalProducts: number;
  isActive: boolean;
  joinedDate: string;
  logo?: string;
  website?: string;
  description: string;
}

interface VendorWithStats extends Vendor {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
}

const AdminVendors: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Enhanced vendor data with statistics
  const [vendors, setVendors] = useState<VendorWithStats[]>(() => {
    return vendorsData.map(vendor => {
      const vendorOrders = ordersData.filter(order => 
        order.items.some(item => {
          const product = productsData.find(p => p.id === item.productId);
          return product?.vendorId === vendor.id;
        })
      );
      const totalRevenue = vendorOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
      const averageOrderValue = vendorOrders.length > 0 ? totalRevenue / vendorOrders.length : 0;
      
      return {
        id: vendor.id,
        name: vendor.businessName || vendor.displayName,
        email: vendor.contact?.email || '',
        phone: vendor.contact?.phone || '',
        address: `${vendor.location?.city || ''}, ${vendor.location?.state || ''}`,
        category: vendor.categories?.[0] || 'General',
        rating: vendor.rating || 0,
        totalProducts: vendor.totalProducts || 0,
        isActive: vendor.isVerified || false,
        joinedDate: vendor.joinedDate || new Date().toISOString(),
        logo: vendor.logo,
        website: vendor.socialLinks?.website,
        description: vendor.description || '',
        totalOrders: vendorOrders.length,
        totalRevenue,
        averageOrderValue,
        status: vendor.isVerified ? 'approved' : ['pending', 'suspended', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'approved' | 'suspended' | 'rejected'
      };
    });
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedVendor, setSelectedVendor] = useState<VendorWithStats | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuVendor, setActionMenuVendor] = useState<VendorWithStats | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Filter and sort vendors
  const filteredVendors = useMemo(() => {
    let filtered = vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof VendorWithStats];
      let bValue = b[sortBy as keyof VendorWithStats];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [vendors, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);
  
  // Get unique categories
  const categories = Array.from(new Set(vendors.map(v => v.category)));
  
  // Status counts for tabs
  const statusCounts = {
    all: vendors.length,
    pending: vendors.filter(v => v.status === 'pending').length,
    approved: vendors.filter(v => v.status === 'approved').length,
    suspended: vendors.filter(v => v.status === 'suspended').length,
    rejected: vendors.filter(v => v.status === 'rejected').length
  };
  
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, vendor: VendorWithStats) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuVendor(vendor);
  };
  
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuVendor(null);
  };
  
  const handleStatusChange = (vendorId: string, newStatus: string) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === vendorId 
        ? { ...vendor, status: newStatus as any, isActive: newStatus === 'approved' }
        : vendor
    ));
    handleActionMenuClose();
  };
  
  const handleViewDetails = (vendor: VendorWithStats) => {
    setSelectedVendor(vendor);
    setDetailsDialogOpen(true);
    handleActionMenuClose();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'error';
      case 'rejected': return 'default';
      default: return 'default';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle />;
      case 'pending': return <Schedule />;
      case 'suspended': return <Block />;
      case 'rejected': return <Warning />;
      default: return undefined;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const statuses = ['all', 'pending', 'approved', 'suspended', 'rejected'];
    setStatusFilter(statuses[newValue]);
    setPage(0);
  };
  
  const renderVendorCard = (vendor: VendorWithStats) => (
    <Card key={vendor.id} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={vendor.logo}
            sx={{ width: 56, height: 56, mr: 2 }}
          >
            {vendor.name.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {vendor.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={getStatusIcon(vendor.status)}
                label={vendor.status}
                color={getStatusColor(vendor.status) as any}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
              <Chip
                icon={<Star />}
                label={vendor.rating}
                color="warning"
                size="small"
              />
            </Box>
          </Box>
          <IconButton
            onClick={(e) => handleActionMenuOpen(e, vendor)}
          >
            <MoreVert />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {vendor.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Business sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {vendor.category}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {vendor.address}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {vendor.totalProducts}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Products
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {vendor.totalOrders}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Orders
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(vendor.totalRevenue)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Revenue
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
  
  return (
    <Layout>
      <Head>
        <title>Vendor Management - Admin Dashboard</title>
        <meta name="description" content="Manage vendors on the e-commerce platform" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Vendor Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor all vendors on your platform
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            Add Vendor
          </Button>
        </Box>
        
        {/* Status Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
          >
            <Tab 
              label={
                <Badge badgeContent={statusCounts.all} color="primary">
                  All Vendors
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.pending} color="warning">
                  Pending
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.approved} color="success">
                  Approved
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.suspended} color="error">
                  Suspended
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.rejected} color="default">
                  Rejected
                </Badge>
              } 
            />
          </Tabs>
        </Paper>
        
        {/* Filters and Search */}
        <Paper sx={{ p: 3, mb: 3 }}>
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
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="totalOrders">Orders</MenuItem>
                  <MenuItem value="totalRevenue">Revenue</MenuItem>
                  <MenuItem value="joinedDate">Join Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={viewMode === 'grid'}
                    onChange={(e) => setViewMode(e.target.checked ? 'grid' : 'table')}
                  />
                }
                label="Grid View"
              />
            </Grid>
          </Grid>
        </Paper>
        
        {/* Vendors List */}
        {viewMode === 'table' ? (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Products</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Revenue</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVendors
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((vendor) => (
                    <TableRow key={vendor.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={vendor.logo}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          >
                            {vendor.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {vendor.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {vendor.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={vendor.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(vendor.status)}
                          label={vendor.status}
                          color={getStatusColor(vendor.status) as any}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {vendor.totalProducts}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {vendor.totalOrders}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(vendor.totalRevenue)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                          <Typography variant="body2">
                            {vendor.rating}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(vendor.joinedDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleActionMenuOpen(e, vendor)}
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
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredVendors
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((vendor) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={vendor.id}>
                  {renderVendorCard(vendor)}
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <TablePagination
                rowsPerPageOptions={[8, 12, 24]}
                component="div"
                count={filteredVendors.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </Box>
          </>
        )}
      </Container>
      
      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItemComponent onClick={() => actionMenuVendor && handleViewDetails(actionMenuVendor)}>
          <ListItemIcon><Visibility /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleActionMenuClose()}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText>Edit Vendor</ListItemText>
        </MenuItemComponent>
        {actionMenuVendor?.status === 'pending' && (
          <MenuItemComponent onClick={() => actionMenuVendor && handleStatusChange(actionMenuVendor.id, 'approved')}>
            <ListItemIcon><CheckCircle /></ListItemIcon>
            <ListItemText>Approve</ListItemText>
          </MenuItemComponent>
        )}
        {actionMenuVendor?.status === 'approved' && (
          <MenuItemComponent onClick={() => actionMenuVendor && handleStatusChange(actionMenuVendor.id, 'suspended')}>
            <ListItemIcon><Block /></ListItemIcon>
            <ListItemText>Suspend</ListItemText>
          </MenuItemComponent>
        )}
        {actionMenuVendor?.status === 'suspended' && (
          <MenuItemComponent onClick={() => actionMenuVendor && handleStatusChange(actionMenuVendor.id, 'approved')}>
            <ListItemIcon><CheckCircle /></ListItemIcon>
            <ListItemText>Reactivate</ListItemText>
          </MenuItemComponent>
        )}
        <MenuItemComponent onClick={() => actionMenuVendor && handleStatusChange(actionMenuVendor.id, 'rejected')}>
          <ListItemIcon><Delete /></ListItemIcon>
          <ListItemText>Reject</ListItemText>
        </MenuItemComponent>
      </Menu>
      
      {/* Vendor Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedVendor && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={selectedVendor.logo}
                  sx={{ width: 48, height: 48, mr: 2 }}
                >
                  {selectedVendor.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedVendor.name}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedVendor.status)}
                    label={selectedVendor.status}
                    color={getStatusColor(selectedVendor.status) as any}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedVendor.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedVendor.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{selectedVendor.address}</Typography>
                    </Box>
                    {selectedVendor.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Language sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{selectedVendor.website}</Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Business Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          {selectedVendor.totalProducts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Products
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                          {selectedVendor.totalOrders}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Orders
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(selectedVendor.totalRevenue)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Revenue
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Star sx={{ fontSize: 20, color: 'warning.main', mr: 0.5 }} />
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {selectedVendor.rating}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Rating
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2">
                    {selectedVendor.description}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<Edit />}>
                Edit Vendor
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default AdminVendors;