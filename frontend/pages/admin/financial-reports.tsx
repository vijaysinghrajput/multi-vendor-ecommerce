import React, { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import RouteGuard from '../../components/RouteGuard';
// Layout handled automatically by UnifiedLayout
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt,
  CreditCard,
  MonetizationOn,
  Assessment,
  DateRange,
  Download,
  FilterList,
  Store,
  ShoppingCart,
  Percent
} from '@mui/icons-material';
// Charts will be implemented with simple visual components
import ordersData from '../../data/orders.json';
import vendorsData from '../../data/vendors.json';
import productsData from '../../data/products.json';

interface FinancialMetrics {
  totalRevenue: number;
  totalCommission: number;
  vendorPayouts: number;
  pendingPayouts: number;
  refunds: number;
  taxes: number;
  netProfit: number;
  transactionFees: number;
}

interface VendorFinancial {
  vendorId: string;
  vendorName: string;
  totalSales: number;
  commission: number;
  payout: number;
  pendingPayout: number;
  transactionCount: number;
  averageOrderValue: number;
}

const AdminFinancialReports: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [dateRange, setDateRange] = useState('30');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Calculate financial metrics
  const financialMetrics = useMemo((): FinancialMetrics => {
    const totalRevenue = ordersData.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.totalPrice, 0);
    }, 0);
    const commissionRate = 0.15; // 15% commission
    const totalCommission = totalRevenue * commissionRate;
    const vendorPayouts = totalRevenue - totalCommission;
    const pendingPayouts = vendorPayouts * 0.3; // 30% pending
    const refunds = totalRevenue * 0.05; // 5% refunds
    const taxes = totalRevenue * 0.18; // 18% GST
    const transactionFees = totalRevenue * 0.02; // 2% transaction fees
    const netProfit = totalCommission - transactionFees;
    
    return {
      totalRevenue,
      totalCommission,
      vendorPayouts: vendorPayouts - pendingPayouts,
      pendingPayouts,
      refunds,
      taxes,
      netProfit,
      transactionFees
    };
  }, []);
  
  // Calculate vendor financial data
  const vendorFinancials = useMemo((): VendorFinancial[] => {
    return vendorsData.map(vendor => {
      const vendorOrders = ordersData.filter(order => 
        order.items.some(item => item.vendorId === vendor.id)
      );
      
      const totalSales = vendorOrders.reduce((sum, order) => {
        const vendorItems = order.items.filter(item => item.vendorId === vendor.id);
        return sum + vendorItems.reduce((itemSum, item) => itemSum + item.totalPrice, 0);
      }, 0);
      
      const commission = totalSales * 0.15;
      const payout = totalSales - commission;
      const pendingPayout = payout * 0.3;
      const transactionCount = vendorOrders.length;
      const averageOrderValue = transactionCount > 0 ? totalSales / transactionCount : 0;
      
      return {
        vendorId: vendor.id,
        vendorName: vendor.businessName || vendor.displayName,
        totalSales,
        commission,
        payout: payout - pendingPayout,
        pendingPayout,
        transactionCount,
        averageOrderValue
      };
    }).sort((a, b) => b.totalSales - a.totalSales);
  }, []);
  
  // Generate monthly revenue data
  const monthlyRevenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      revenue: Math.floor(Math.random() * 500000) + 200000,
      commission: Math.floor(Math.random() * 75000) + 30000,
      payouts: Math.floor(Math.random() * 425000) + 170000
    }));
  }, []);
  
  // Generate category revenue data
  const categoryRevenueData = useMemo(() => {
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Health'];
    return categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 100000) + 50000,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
    }));
  }, []);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1) + '%';
  };
  
  const getGrowthIcon = (isPositive: boolean) => {
    return isPositive ? <TrendingUp color="success" /> : <TrendingDown color="error" />;
  };
  
  return (
    <RouteGuard requiredRole="admin">
      <>
        <Head>
          <title>Financial Reports - Admin Dashboard</title>
          <meta name="description" content="View financial reports and analytics in the admin dashboard" />
        </Head>
        
        <Box sx={{ width: '100%' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Financial Reports
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor revenue, commissions, and vendor payouts
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small">
                <InputLabel>Period</InputLabel>
                <Select
                  value={dateRange}
                  label="Period"
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <MenuItem value="7">Last 7 days</MenuItem>
                  <MenuItem value="30">Last 30 days</MenuItem>
                  <MenuItem value="90">Last 3 months</MenuItem>
                  <MenuItem value="365">Last year</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                startIcon={<Download />}
              >
                Export Report
              </Button>
            </Box>
          </Box>
          
          {/* Financial Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(financialMetrics.totalRevenue)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {getGrowthIcon(true)}
                        <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                          +12.5%
                        </Typography>
                      </Box>
                    </Box>
                    <MonetizationOn sx={{ fontSize: 40, color: 'primary.main' }} />
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
                        Commission Earned
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(financialMetrics.totalCommission)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {getGrowthIcon(true)}
                        <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                          +8.2%
                        </Typography>
                      </Box>
                    </Box>
                    <Percent sx={{ fontSize: 40, color: 'success.main' }} />
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
                        Vendor Payouts
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(financialMetrics.vendorPayouts)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {getGrowthIcon(false)}
                        <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                          -2.1%
                        </Typography>
                      </Box>
                    </Box>
                    <AccountBalance sx={{ fontSize: 40, color: 'info.main' }} />
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
                        Net Profit
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(financialMetrics.netProfit)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {getGrowthIcon(true)}
                        <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                          +15.3%
                        </Typography>
                      </Box>
                    </Box>
                    <Assessment sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue Trends
                  </Typography>
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Revenue Chart Visualization
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue by Category
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    {categoryRevenueData.map((category, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{category.name}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(category.value)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(category.value / Math.max(...categoryRevenueData.map(c => c.value))) * 100}
                          sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Financial Breakdown */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Financial Breakdown
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Total Revenue</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(financialMetrics.totalRevenue)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{ mb: 2, height: 8, borderRadius: 4 }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Commission (15%)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(financialMetrics.totalCommission)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={15}
                      color="success"
                      sx={{ mb: 2, height: 8, borderRadius: 4 }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Transaction Fees (2%)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(financialMetrics.transactionFees)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={2}
                      color="warning"
                      sx={{ mb: 2, height: 8, borderRadius: 4 }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Refunds (5%)</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(financialMetrics.refunds)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={5}
                      color="error"
                      sx={{ mb: 2, height: 8, borderRadius: 4 }}
                    />
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Net Profit</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {formatCurrency(financialMetrics.netProfit)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payout Summary
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.contrastText' }}>
                          {formatCurrency(financialMetrics.vendorPayouts)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'success.contrastText' }}>
                          Completed Payouts
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.contrastText' }}>
                          {formatCurrency(financialMetrics.pendingPayouts)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'warning.contrastText' }}>
                          Pending Payouts
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Payout Schedule
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Weekly payouts every Friday
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Minimum payout threshold: ₹1,000
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Processing time: 2-3 business days
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Vendor Financial Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vendor Financial Performance
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendor</TableCell>
                      <TableCell align="right">Total Sales</TableCell>
                      <TableCell align="right">Commission</TableCell>
                      <TableCell align="right">Payout</TableCell>
                      <TableCell align="right">Pending</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">AOV</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendorFinancials
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((vendor) => (
                        <TableRow key={vendor.vendorId} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar>
                                <Store />
                              </Avatar>
                              <Typography variant="subtitle2">
                                {vendor.vendorName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {formatCurrency(vendor.totalSales)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(vendor.commission)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="success.main">
                              {formatCurrency(vendor.payout)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="warning.main">
                              {formatCurrency(vendor.pendingPayout)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {vendor.transactionCount}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(vendor.averageOrderValue)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={vendorFinancials.length}
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
        </Box>
      </>
    </RouteGuard>
  );
};

export default AdminFinancialReports;