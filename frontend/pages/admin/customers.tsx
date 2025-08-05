import React, { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import RouteGuard from '../../components/RouteGuard';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout';
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
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Block,
  CheckCircle,
  Visibility,
  Delete,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  Warning,
  Verified,
  Star,
  History,
  LocalOffer
} from '@mui/icons-material';
import ordersData from '../../data/orders.json';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'blocked';
  isVerified: boolean;
  avatar?: string;
}

const AdminCustomers: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Generate customer data from orders
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const customerMap = new Map<string, any>();
    
    ordersData.forEach(order => {
      const customerId = order.userId;
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name: order.shippingAddress.name,
          email: `customer${customerId}@example.com`,
          phone: order.shippingAddress.phone,
          address: order.shippingAddress.addressLine1,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          joinedDate: order.orderDate,
          orders: [],
          totalSpent: 0,
          isVerified: Math.random() > 0.3,
          status: ['active', 'inactive', 'blocked'][Math.floor(Math.random() * 3)] as any
        });
      }
      
      const customer = customerMap.get(customerId);
      customer.orders.push(order);
      customer.totalSpent += order.pricing?.total || 0;
    });
    
    return Array.from(customerMap.values()).map(customer => ({
      ...customer,
      totalOrders: customer.orders.length,
      averageOrderValue: customer.totalSpent / customer.orders.length,
      lastOrderDate: customer.orders.sort((a: any, b: any) => 
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      )[0]?.orderDate || customer.joinedDate
    }));
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuCustomer, setActionMenuCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesVerification = verificationFilter === 'all' || 
                                 (verificationFilter === 'verified' && customer.isVerified) ||
                                 (verificationFilter === 'unverified' && !customer.isVerified);
      
      return matchesSearch && matchesStatus && matchesVerification;
    });
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Customer];
      let bValue = b[sortBy as keyof Customer];
      
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
  }, [customers, searchTerm, statusFilter, verificationFilter, sortBy, sortOrder]);
  
  // Status counts for tabs
  const statusCounts = {
    all: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    blocked: customers.filter(c => c.status === 'blocked').length,
    verified: customers.filter(c => c.isVerified).length
  };
  
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, customer: Customer) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuCustomer(customer);
  };
  
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuCustomer(null);
  };
  
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailsDialogOpen(true);
    handleActionMenuClose();
  };
  
  const handleStatusChange = (customerId: string, newStatus: 'active' | 'inactive' | 'blocked') => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    ));
    handleActionMenuClose();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'blocked': return 'error';
      default: return 'default';
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <RouteGuard requiredRole="admin">
      <AdminDashboardLayout>
        <Head>
          <title>Customer Management - Admin Dashboard</title>
          <meta name="description" content="Manage customers in the admin dashboard" />
        </Head>
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Customer Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and monitor customer accounts and activities
              </Typography>
            </Box>
          </Box>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Customers
                      </Typography>
                      <Typography variant="h4">
                        {customers.length}
                      </Typography>
                    </Box>
                    <Person sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Active Customers
                      </Typography>
                      <Typography variant="h4">
                        {statusCounts.active}
                      </Typography>
                    </Box>
                    <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Verified Customers
                      </Typography>
                      <Typography variant="h4">
                        {statusCounts.verified}
                      </Typography>
                    </Box>
                    <Verified sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
                      </Typography>
                    </Box>
                    <AttachMoney sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Filters and Search */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search customers..."
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
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="blocked">Blocked</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Verification</InputLabel>
                    <Select
                      value={verificationFilter}
                      label="Verification"
                      onChange={(e) => setVerificationFilter(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="verified">Verified</MenuItem>
                      <MenuItem value="unverified">Unverified</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="joinedDate">Join Date</MenuItem>
                      <MenuItem value="totalOrders">Total Orders</MenuItem>
                      <MenuItem value="totalSpent">Total Spent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    fullWidth
                  >
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Customers Table */}
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell>Total Spent</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCustomers
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((customer) => (
                        <TableRow key={customer.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar src={customer.avatar}>
                                {customer.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {customer.name}
                                  {customer.isVerified && (
                                    <Verified sx={{ ml: 1, fontSize: 16, color: 'success.main' }} />
                                  )}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  ID: {customer.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 16 }} />
                                {customer.email}
                              </Typography>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Phone sx={{ fontSize: 16 }} />
                                {customer.phone}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {customer.city}, {customer.state}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {customer.totalOrders}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Avg: {formatCurrency(customer.averageOrderValue)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2">
                              {formatCurrency(customer.totalSpent)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={customer.status}
                              color={getStatusColor(customer.status) as any}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(customer.joinedDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(e) => handleActionMenuOpen(e, customer)}
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
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredCustomers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </CardContent>
          </Card>
        </Container>
        
        {/* Action Menu */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
        >
          <MenuItemComponent onClick={() => actionMenuCustomer && handleViewDetails(actionMenuCustomer)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent onClick={() => actionMenuCustomer && handleStatusChange(actionMenuCustomer.id, 'active')}>
            <ListItemIcon>
              <CheckCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>Activate</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent onClick={() => actionMenuCustomer && handleStatusChange(actionMenuCustomer.id, 'blocked')}>
            <ListItemIcon>
              <Block fontSize="small" />
            </ListItemIcon>
            <ListItemText>Block</ListItemText>
          </MenuItemComponent>
        </Menu>
        
        {/* Customer Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Customer Details
          </DialogTitle>
          <DialogContent>
            {selectedCustomer && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={selectedCustomer.avatar}>
                          {selectedCustomer.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={selectedCustomer.name}
                        secondary={`Customer ID: ${selectedCustomer.id}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={selectedCustomer.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedCustomer.phone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Address"
                        secondary={`${selectedCustomer.address}, ${selectedCustomer.city}, ${selectedCustomer.state}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Account Statistics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Total Orders"
                        secondary={selectedCustomer.totalOrders}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Total Spent"
                        secondary={formatCurrency(selectedCustomer.totalSpent)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Average Order Value"
                        secondary={formatCurrency(selectedCustomer.averageOrderValue)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Last Order"
                        secondary={formatDate(selectedCustomer.lastOrderDate)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={
                          <Chip
                            label={selectedCustomer.status}
                            color={getStatusColor(selectedCustomer.status) as any}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </AdminDashboardLayout>
    </RouteGuard>
  );
};

export default AdminCustomers;