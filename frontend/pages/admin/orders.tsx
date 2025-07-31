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
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Visibility,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  Store,
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday,
  AttachMoney,
  Receipt,
  Inventory,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  Download,
  Print,
  Refresh,
  Assignment,
  Timeline,
  ShoppingCart,
  CreditCard,
  LocalOffer
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import ordersData from '../../data/orders.json';
import productsData from '../../data/products.json';
import vendorsData from '../../data/vendors.json';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productTitle?: string;
  productImage?: string;
  vendorId?: string;
  vendorName?: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
  deliveryDate?: string;
  trackingNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  notes?: string;
}

const AdminOrders: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Enhanced orders data
  const [orders, setOrders] = useState<Order[]>(() => {
    return ordersData.map((order: any) => {
      const enhancedItems = order.items.map((item: any) => {
        const product = productsData.find(p => p.id === item.productId);
        const vendor = vendorsData.find(v => v.id === product?.vendorId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
          productTitle: item.productTitle || product?.title || 'Unknown Product',
          productImage: item.productImage || product?.images?.[0] || '/images/placeholder.jpg',
          vendorId: item.vendorId || product?.vendorId,
          vendorName: item.vendorName || vendor?.businessName || vendor?.displayName || 'Unknown Vendor'
        };
      });
      
      return {
        id: order.id,
        userId: order.userId,
        items: enhancedItems,
        total: order.pricing?.total || 0,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.payment?.method || 'card',
        shippingAddress: {
          name: order.shippingAddress.name,
          phone: order.shippingAddress.phone,
          address: order.shippingAddress.addressLine1 + (order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''),
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          pincode: order.shippingAddress.pincode
        },
        createdAt: order.orderDate,
        updatedAt: order.orderDate,
        customerName: order.shippingAddress.name,
        customerEmail: `customer${order.userId}@example.com`,
        customerPhone: order.shippingAddress.phone,
        subtotal: order.pricing?.subtotal || 0,
        shippingFee: order.pricing?.shipping || 0,
        tax: order.pricing?.tax || 0,
        discount: order.pricing?.discount || 0,
        trackingNumber: order.tracking?.trackingNumber || (order.status === 'shipped' || order.status === 'delivered' ? `TRK${order.id.toUpperCase()}` : undefined),
        deliveryDate: order.deliveredDate || (order.status === 'delivered' ? new Date(new Date(order.orderDate).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined)
      };
    });
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuOrder, setActionMenuOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // Get unique values for filters
  const vendors = Array.from(new Set(orders.flatMap(o => o.items.map(i => i.vendorName))));
  
  // Status counts for tabs
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    refunded: orders.filter(o => o.status === 'refunded').length
  };
  
  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerPhone?.includes(searchTerm) ||
                           order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.items.some(item => item.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || order.paymentStatus === paymentStatusFilter;
      const matchesVendor = vendorFilter === 'all' || order.items.some(item => item.vendorName === vendorFilter);
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        switch (dateFilter) {
          case 'today':
            matchesDate = orderDate.toDateString() === now.toDateString();
            break;
          case 'week':
            matchesDate = (now.getTime() - orderDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'month':
            matchesDate = (now.getTime() - orderDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesVendor && matchesDate;
    });
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Order];
      let bValue = b[sortBy as keyof Order];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      // Handle undefined values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [orders, searchTerm, statusFilter, paymentStatusFilter, vendorFilter, dateFilter, sortBy, sortOrder]);
  
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, order: Order) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuOrder(order);
  };
  
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuOrder(null);
  };
  
  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
        : order
    ));
    handleActionMenuClose();
  };
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
    handleActionMenuClose();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'processing': return 'primary';
      case 'shipped': return 'secondary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      case 'refunded': return 'error';
      default: return 'default';
    }
  };
  
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Pending />;
      case 'confirmed': return <CheckCircle />;
      case 'processing': return <Assignment />;
      case 'shipped': return <LocalShipping />;
      case 'delivered': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      case 'refunded': return <Cancel />;
      default: return <Receipt />;
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
    const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    setStatusFilter(statuses[newValue]);
    setPage(0);
  };
  
  const getOrderProgress = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };
  
  return (
    <Layout>
      <Head>
        <title>Order Management - Admin Dashboard</title>
        <meta name="description" content="Manage all orders on the e-commerce platform" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Order Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor and manage all orders across the platform
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
            >
              Refresh
            </Button>
          </Box>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <ShoppingCart />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {orders.length}
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
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
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
                    <Pending />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {statusCounts.pending + statusCounts.confirmed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Orders
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
                    <LocalShipping />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {statusCounts.shipped}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Shipped Orders
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
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
                  All Orders
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
                <Badge badgeContent={statusCounts.confirmed} color="info">
                  Confirmed
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.processing} color="primary">
                  Processing
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.shipped} color="secondary">
                  Shipped
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.delivered} color="success">
                  Delivered
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.cancelled} color="error">
                  Cancelled
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.refunded} color="error">
                  Refunded
                </Badge>
              } 
            />
          </Tabs>
        </Paper>
        
        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search orders, customers, products..."
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
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={paymentStatusFilter}
                  label="Payment Status"
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Payments</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date Range"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
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
                  <MenuItem value="createdAt">Order Date</MenuItem>
                  <MenuItem value="total">Order Value</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                  <MenuItem value="customerName">Customer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
              >
                More Filters
              </Button>
            </Grid>
          </Grid>
          
          {/* Advanced Filters */}
          <Accordion expanded={filtersExpanded} onChange={() => setFiltersExpanded(!filtersExpanded)}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Advanced Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Vendor</InputLabel>
                    <Select
                      value={vendorFilter}
                      label="Vendor"
                      onChange={(e) => setVendorFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Vendors</MenuItem>
                      {vendors.map(vendor => (
                        <MenuItem key={vendor} value={vendor}>{vendor}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sort Order</InputLabel>
                    <Select
                      value={sortOrder}
                      label="Sort Order"
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                      <MenuItem value="desc">Newest First</MenuItem>
                      <MenuItem value="asc">Oldest First</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Paper>
        
        {/* Orders Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            #{order.id}
                          </Typography>
                          {order.trackingNumber && (
                            <Typography variant="caption" color="text.secondary">
                              Tracking: {order.trackingNumber}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {order.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.customerPhone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.items.slice(0, 2).map(item => item.productTitle).join(', ')}
                            {order.items.length > 2 && ` +${order.items.length - 2} more`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(order.total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Chip
                            icon={getStatusIcon(order.status)}
                            label={order.status}
                            color={getStatusColor(order.status) as any}
                            size="small"
                            sx={{ textTransform: 'capitalize', mb: 1 }}
                          />
                          <LinearProgress
                            variant="determinate"
                            value={getOrderProgress(order.status)}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.paymentStatus}
                          color={getPaymentStatusColor(order.paymentStatus) as any}
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                        <Typography variant="caption" display="block" color="text.secondary">
                          {order.paymentMethod}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleActionMenuOpen(e, order)}
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
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      </Container>
      
      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItemComponent onClick={() => actionMenuOrder && handleViewDetails(actionMenuOrder)}>
          <ListItemIcon><Visibility /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleActionMenuClose()}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText>Edit Order</ListItemText>
        </MenuItemComponent>
        {actionMenuOrder?.status === 'pending' && (
          <MenuItemComponent onClick={() => actionMenuOrder && handleStatusChange(actionMenuOrder.id, 'confirmed')}>
            <ListItemIcon><CheckCircle /></ListItemIcon>
            <ListItemText>Confirm Order</ListItemText>
          </MenuItemComponent>
        )}
        {actionMenuOrder?.status === 'confirmed' && (
          <MenuItemComponent onClick={() => actionMenuOrder && handleStatusChange(actionMenuOrder.id, 'processing')}>
            <ListItemIcon><Assignment /></ListItemIcon>
            <ListItemText>Start Processing</ListItemText>
          </MenuItemComponent>
        )}
        {actionMenuOrder?.status === 'processing' && (
          <MenuItemComponent onClick={() => actionMenuOrder && handleStatusChange(actionMenuOrder.id, 'shipped')}>
            <ListItemIcon><LocalShipping /></ListItemIcon>
            <ListItemText>Mark as Shipped</ListItemText>
          </MenuItemComponent>
        )}
        {actionMenuOrder?.status === 'shipped' && (
          <MenuItemComponent onClick={() => actionMenuOrder && handleStatusChange(actionMenuOrder.id, 'delivered')}>
            <ListItemIcon><CheckCircle /></ListItemIcon>
            <ListItemText>Mark as Delivered</ListItemText>
          </MenuItemComponent>
        )}
        <MenuItemComponent onClick={() => actionMenuOrder && handleStatusChange(actionMenuOrder.id, 'cancelled')}>
          <ListItemIcon><Cancel /></ListItemIcon>
          <ListItemText>Cancel Order</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleActionMenuClose()}>
          <ListItemIcon><Print /></ListItemIcon>
          <ListItemText>Print Invoice</ListItemText>
        </MenuItemComponent>
      </Menu>
      
      {/* Order Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Order #{selectedOrder.id}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      icon={getStatusIcon(selectedOrder.status)}
                      label={selectedOrder.status}
                      color={getStatusColor(selectedOrder.status) as any}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Chip
                      label={selectedOrder.paymentStatus}
                      color={getPaymentStatusColor(selectedOrder.paymentStatus) as any}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(selectedOrder.total)}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Customer Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {selectedOrder.customerEmail}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Phone:</strong> {selectedOrder.customerPhone}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Order Information */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Order Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
                    </Typography>
                    {selectedOrder.trackingNumber && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Tracking Number:</strong> {selectedOrder.trackingNumber}
                      </Typography>
                    )}
                    {selectedOrder.deliveryDate && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Delivery Date:</strong> {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {/* Shipping Address */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2">
                    {selectedOrder.shippingAddress.name}<br />
                    {selectedOrder.shippingAddress.address}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}<br />
                    Phone: {selectedOrder.shippingAddress.phone}
                  </Typography>
                </Grid>
                
                {/* Order Items */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Order Items
                  </Typography>
                  <List>
                    {selectedOrder.items.map((item, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            src={item.productImage}
                            variant="rounded"
                            sx={{ width: 56, height: 56 }}
                          >
                            <Inventory />
                          </Avatar>
                        </ListItemAvatar>
                        <Box sx={{ flex: 1, ml: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {item.productTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Vendor: {item.vendorName}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2">
                              Qty: {item.quantity}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {formatCurrency(item.price * item.quantity)}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                
                {/* Order Summary */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Box sx={{ minWidth: 200 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.subtotal || 0)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Shipping:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.shippingFee || 0)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Tax:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.tax || 0)}</Typography>
                      </Box>
                      {selectedOrder.discount && selectedOrder.discount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="success.main">Discount:</Typography>
                          <Typography variant="body2" color="success.main">-{formatCurrency(selectedOrder.discount)}</Typography>
                        </Box>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{formatCurrency(selectedOrder.total)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
              <Button variant="outlined" startIcon={<Print />}>
                Print Invoice
              </Button>
              <Button variant="outlined" startIcon={<Edit />}>
                Edit Order
              </Button>
              <Button variant="contained" startIcon={<LocalShipping />}>
                Update Status
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default AdminOrders;