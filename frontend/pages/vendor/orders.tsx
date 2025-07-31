import React, { useState } from 'react';
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
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  useTheme,
  useMediaQuery,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Alert,
  Divider,
  List,
  ListItem,
  Avatar,
  Badge,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Edit,
  LocalShipping,
  CheckCircle,
  Cancel,
  Pending,
  MoreVert,
  Print,
  Download,
  Message,
  Phone,
  LocationOn,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  AttachMoney,
  Schedule,
  Star,
  Warning,
  Info
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import ordersData from '../../data/orders.json';
import productsData from '../../data/products.json';
import vendorsData from '../../data/vendors.json';

interface OrderWithDetails {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderDate: string;
  items: Array<{
    id: string;
    productId: string;
    productTitle: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    vendorId: string;
    status: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
}

const VendorOrders: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mock vendor data (in real app, this would come from auth context)
  const currentVendor = vendorsData[0];
  const [orders, setOrders] = useState<OrderWithDetails[]>(
    ordersData.filter(order => 
      order.items.some(item => {
        const product = productsData.find(p => p.id === item.productId);
        return product?.vendorId === currentVendor.id;
      })
    ).map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      customerName: order.shippingAddress?.name || 'Customer Name',
      customerEmail: 'customer@example.com',
      customerPhone: order.shippingAddress?.phone || '+91 98765 43210',
      orderDate: order.orderDate,
      paymentMethod: order.payment?.method || 'card',
      paymentStatus: order.paymentStatus as 'pending' | 'paid' | 'failed',
      status: order.status as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
      createdAt: order.orderDate,
      updatedAt: order.orderDate,
      totalAmount: order.pricing?.total || 0,
      shippingAddress: order.shippingAddress,
      pricing: order.pricing,
      items: order.items.filter(item => {
        const product = productsData.find(p => p.id === item.productId);
        return product?.vendorId === currentVendor.id;
      }).map(item => ({
        id: item.id,
        productId: item.productId,
        productTitle: item.productTitle,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        vendorId: item.vendorId,
        status: item.status
      }))
    }))
  );
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchQuery || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    const matchesDate = !dateFilter || (() => {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          return daysDiff === 0;
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Schedule />;
      case 'confirmed':
        return <CheckCircle />;
      case 'processing':
        return <LocalShipping />;
      case 'shipped':
        return <LocalShipping />;
      case 'delivered':
        return <CheckCircle />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <Info />;
    }
  };
  
  const calculateOrderTotal = (order: any) => {
    return order.items.reduce((total: number, item: any) => {
      const product = productsData.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
    setMenuAnchor(null);
  };
  
  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setUpdateStatusOpen(true);
    setMenuAnchor(null);
  };
  
  const confirmStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id ? { ...order, status: newStatus as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' } : order
      ));
      setUpdateStatusOpen(false);
      setSelectedOrder(null);
      setNewStatus('');
    }
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: any) => {
    setMenuAnchor(event.currentTarget);
    setSelectedOrder(order);
  };
  
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedOrder(null);
  };
  
  const getOrderSteps = (status: string) => {
    const steps = [
      { label: 'Order Placed', status: 'pending' },
      { label: 'Confirmed', status: 'confirmed' },
      { label: 'Processing', status: 'processing' },
      { label: 'Shipped', status: 'shipped' },
      { label: 'Delivered', status: 'delivered' }
    ];
    
    const currentIndex = steps.findIndex(step => step.status === status.toLowerCase());
    return { steps, currentIndex };
  };
  
  const renderOrderCard = (order: any) => {
    const orderTotal = calculateOrderTotal(order);
    
    return (
      <Card key={order.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Order #{order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(order.orderDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={getStatusIcon(order.status)}
                label={order.status}
                color={getStatusColor(order.status) as any}
                size="small"
              />
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, order)}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              {order.customerName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {order.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.items.length} item(s) • ₹{orderTotal.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => handleViewOrder(order)}
            >
              View Details
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => handleUpdateStatus(order)}
            >
              Update Status
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredOrders
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((order) => {
              const orderTotal = calculateOrderTotal(order);
              
              return (
                <TableRow key={order.id}>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      #{order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                        {order.customerName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {order.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.customerEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.orderDate).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.items.length} item(s)
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      ₹{orderTotal.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Order">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Status">
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateStatus(order)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, order)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
  
  return (
    <Layout>
      <Head>
        <title>Orders - Vendor Dashboard</title>
        <meta name="description" content="Manage your orders and track deliveries" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Orders
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and track your order fulfillment
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
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {orders.length}
                    </Typography>
                  </Box>
                  <ShoppingCart sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {orders.filter(o => o.status.toLowerCase() === 'pending').length}
                    </Typography>
                  </Box>
                  <Schedule sx={{ fontSize: 40, color: 'warning.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Shipped Orders
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {orders.filter(o => o.status.toLowerCase() === 'shipped').length}
                    </Typography>
                  </Box>
                  <LocalShipping sx={{ fontSize: 40, color: 'info.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Revenue
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      ₹{orders.reduce((total, order) => total + calculateOrderTotal(order), 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, color: 'success.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
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
                  <MenuItem value="">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Orders List */}
        {isMobile ? (
          <Box>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => renderOrderCard(order))}
          </Box>
        ) : (
          renderTableView()
        )}
        
        {filteredOrders.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery || statusFilter || dateFilter
                ? 'Try adjusting your search or filters'
                : 'Orders will appear here when customers make purchases'
              }
            </Typography>
          </Box>
        )}
      </Container>
      
      {/* Order Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleViewOrder(selectedOrder)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus(selectedOrder)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update Status</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download Invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Message fontSize="small" />
          </ListItemIcon>
          <ListItemText>Contact Customer</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Order Detail Dialog */}
      <Dialog
        open={orderDetailOpen}
        onClose={() => setOrderDetailOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Order #{selectedOrder?.id}
            </Typography>
            <Chip
              icon={getStatusIcon(selectedOrder?.status || '')}
              label={selectedOrder?.status}
              color={getStatusColor(selectedOrder?.status || '') as any}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Order Progress */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Progress
                </Typography>
                {(() => {
                  const { steps, currentIndex } = getOrderSteps(selectedOrder.status);
                  return (
                    <Stepper activeStep={currentIndex} alternativeLabel>
                      {steps.map((step) => (
                        <Step key={step.label}>
                          <StepLabel>{step.label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  );
                })()}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Customer Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>
                        {selectedOrder.customerName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {selectedOrder.customerName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedOrder.customerEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {selectedOrder.customerPhone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationOn sx={{ mr: 1, fontSize: 16, mt: 0.5 }} />
                      <Typography variant="body2">
                        {selectedOrder.shippingAddress}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Order Items */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <List>
                  {selectedOrder.items.map((item: any, index: number) => {
                    const product = productsData.find(p => p.id === item.productId);
                    if (!product) return null;
                    
                    return (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            mr: 2,
                            backgroundImage: `url(${product.images[0] || '/images/placeholder.jpg'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quantity: {item.quantity} × ₹{product.price.toLocaleString()}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          ₹{(product.price * item.quantity).toLocaleString()}
                        </Typography>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
              
              {/* Order Summary */}
              <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">
                    ₹{calculateOrderTotal(selectedOrder).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Shipping:</Typography>
                  <Typography variant="body2">₹50</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ₹{(calculateOrderTotal(selectedOrder) + 50).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<Print />}>
            Print Invoice
          </Button>
          <Button variant="contained" startIcon={<Edit />} onClick={() => {
            setOrderDetailOpen(false);
            handleUpdateStatus(selectedOrder);
          }}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={updateStatusOpen} onClose={() => setUpdateStatusOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateStatusOpen(false)}>Cancel</Button>
          <Button onClick={confirmStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default VendorOrders;