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
  Button,
  Avatar,
  Grid,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  DatePicker
} from '@mui/material';
import {
  Search,
  FilterList,
  AttachMoney,
  TrendingUp,
  Schedule,
  CheckCircle,
  MoreVert,
  Visibility,
  Payment,
  Cancel,
  Download,
  CalendarToday
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const VendorPayouts = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', payout: null });

  // Mock payout data
  const payouts = [
    {
      id: 'PAY-001',
      vendorId: 1,
      vendorName: 'TechStore Pro',
      vendorEmail: 'contact@techstorepro.com',
      amount: 2450.75,
      commission: 245.08,
      netAmount: 2205.67,
      status: 'completed',
      requestDate: '2024-01-10',
      processedDate: '2024-01-12',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-789456123',
      period: 'December 2023'
    },
    {
      id: 'PAY-002',
      vendorId: 2,
      vendorName: 'Fashion Hub',
      vendorEmail: 'info@fashionhub.com',
      amount: 1890.50,
      commission: 189.05,
      netAmount: 1701.45,
      status: 'pending',
      requestDate: '2024-01-14',
      processedDate: null,
      paymentMethod: 'Bank Transfer',
      transactionId: null,
      period: 'December 2023'
    },
    {
      id: 'PAY-003',
      vendorId: 3,
      vendorName: 'Home Essentials',
      vendorEmail: 'support@homeessentials.com',
      amount: 1650.25,
      commission: 165.03,
      netAmount: 1485.22,
      status: 'processing',
      requestDate: '2024-01-08',
      processedDate: null,
      paymentMethod: 'PayPal',
      transactionId: null,
      period: 'December 2023'
    },
    {
      id: 'PAY-004',
      vendorId: 4,
      vendorName: 'Beauty Corner',
      vendorEmail: 'hello@beautycorner.com',
      amount: 1320.80,
      commission: 132.08,
      netAmount: 1188.72,
      status: 'completed',
      requestDate: '2024-01-05',
      processedDate: '2024-01-07',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-456789012',
      period: 'November 2023'
    },
    {
      id: 'PAY-005',
      vendorId: 5,
      vendorName: 'Sports Gear',
      vendorEmail: 'team@sportsgear.com',
      amount: 980.40,
      commission: 98.04,
      netAmount: 882.36,
      status: 'failed',
      requestDate: '2024-01-12',
      processedDate: '2024-01-13',
      paymentMethod: 'Bank Transfer',
      transactionId: null,
      period: 'December 2023',
      failureReason: 'Invalid bank account details'
    },
    {
      id: 'PAY-006',
      vendorId: 6,
      vendorName: 'Digital World',
      vendorEmail: 'contact@digitalworld.com',
      amount: 2100.60,
      commission: 210.06,
      netAmount: 1890.54,
      status: 'cancelled',
      requestDate: '2024-01-09',
      processedDate: null,
      paymentMethod: 'Bank Transfer',
      transactionId: null,
      period: 'December 2023',
      cancellationReason: 'Requested by vendor'
    }
  ];

  const statuses = ['completed', 'pending', 'processing', 'failed', 'cancelled'];

  // Filter payouts
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    
    // Date range filter
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const payoutDate = new Date(payout.requestDate);
      if (dateRange.start && payoutDate < dateRange.start) matchesDate = false;
      if (dateRange.end && payoutDate > dateRange.end) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event, payout) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayout(payout);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayout(null);
  };

  const handleAction = (action) => {
    setActionDialog({ open: true, type: action, payout: selectedPayout });
    handleMenuClose();
  };

  const handleActionConfirm = () => {
    const { type, payout } = actionDialog;
    console.log(`${type} payout:`, payout.id);
    // Handle API call here
    setActionDialog({ open: false, type: '', payout: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate summary stats
  const totalPayouts = payouts.reduce((sum, payout) => sum + payout.netAmount, 0);
  const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((sum, payout) => sum + payout.netAmount, 0);
  const completedPayouts = payouts.filter(p => p.status === 'completed').length;
  const processingPayouts = payouts.filter(p => p.status === 'processing').length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Vendor Payouts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track vendor payout requests and transactions
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{formatCurrency(totalPayouts)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Payouts
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
                    <Schedule />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{formatCurrency(pendingPayouts)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Amount
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
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{completedPayouts}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
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
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{processingPayouts}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Processing
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search payouts..."
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
                    <MenuItem value="all">All Statuses</MenuItem>
                    {statuses.map(status => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <MuiDatePicker
                  label="Start Date"
                  value={dateRange.start}
                  onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <MuiDatePicker
                  label="End Date"
                  value={dateRange.end}
                  onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateRange({ start: null, end: null });
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Payouts Table */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payout ID</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Commission</TableCell>
                    <TableCell align="right">Net Amount</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Request Date</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayouts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((payout) => (
                      <TableRow key={payout.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{payout.id}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payout.period}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                              {payout.vendorName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {payout.vendorName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {payout.vendorEmail}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(payout.amount)}</TableCell>
                        <TableCell align="right">{formatCurrency(payout.commission)}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" color="primary">
                            {formatCurrency(payout.netAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell>{payout.paymentMethod}</TableCell>
                        <TableCell>{formatDate(payout.requestDate)}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            color={getStatusColor(payout.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, payout)}
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
              count={filteredPayouts.length}
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
          {selectedPayout?.status === 'pending' && (
            <MenuItem onClick={() => handleAction('process')}>
              <ListItemIcon>
                <Payment fontSize="small" />
              </ListItemIcon>
              <ListItemText>Process Payment</ListItemText>
            </MenuItem>
          )}
          {(selectedPayout?.status === 'pending' || selectedPayout?.status === 'processing') && (
            <MenuItem onClick={() => handleAction('cancel')} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Cancel fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Cancel Payout</ListItemText>
            </MenuItem>
          )}
          <MenuItem onClick={() => handleAction('download')}>
            <ListItemIcon>
              <Download fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download Receipt</ListItemText>
          </MenuItem>
        </Menu>

        {/* Action Confirmation Dialog */}
        <Dialog
          open={actionDialog.open}
          onClose={() => setActionDialog({ open: false, type: '', payout: null })}
        >
          <DialogTitle>
            Confirm {actionDialog.type?.charAt(0).toUpperCase() + actionDialog.type?.slice(1)}
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionDialog.type} payout "{actionDialog.payout?.id}" 
              for {actionDialog.payout?.vendorName}?
            </Typography>
            {actionDialog.type === 'process' && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Amount: {formatCurrency(actionDialog.payout?.netAmount || 0)}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: '', payout: null })}>
              Cancel
            </Button>
            <Button onClick={handleActionConfirm} variant="contained" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default VendorPayouts;