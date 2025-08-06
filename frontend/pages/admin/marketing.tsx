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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  LinearProgress,
  styled
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  Campaign,
  LocalOffer,
  Email,
  Sms,
  NotificationsActive,
  TrendingUp,
  People,
  ShoppingCart,
  MonetizationOn,
  CalendarToday,
  Search,
  FilterList,
  Download,
  Share,
  Analytics,
  GpsFixed,
  Percent,
  Schedule
} from '@mui/icons-material';
import productsData from '../../data/products.json';
import ordersData from '../../data/orders.json';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'banner' | 'discount';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled';
  startDate: string;
  endDate: string;
  targetAudience: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  description: string;
  createdBy: string;
  createdDate: string;
}

interface Promotion {
  id: string;
  title: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
  value: number;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  minimumOrder: number;
  applicableProducts: string[];
  status: 'active' | 'inactive' | 'expired';
  createdDate: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const AdminMarketing: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<Campaign | Promotion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuItem, setActionMenuItem] = useState<Campaign | Promotion | null>(null);
  
  // Sample campaigns data
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Summer Sale 2024',
      type: 'email',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      targetAudience: 'All Customers',
      budget: 50000,
      spent: 32000,
      impressions: 125000,
      clicks: 8500,
      conversions: 450,
      revenue: 180000,
      description: 'Promote summer collection with attractive discounts',
      createdBy: 'Marketing Team',
      createdDate: '2024-05-15'
    },
    {
      id: '2',
      name: 'New Customer Welcome',
      type: 'push',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      targetAudience: 'New Customers',
      budget: 25000,
      spent: 15000,
      impressions: 75000,
      clicks: 5200,
      conversions: 320,
      revenue: 95000,
      description: 'Welcome new customers with special offers',
      createdBy: 'Admin User',
      createdDate: '2023-12-20'
    },
    {
      id: '3',
      name: 'Flash Sale Weekend',
      type: 'banner',
      status: 'completed',
      startDate: '2024-05-25',
      endDate: '2024-05-27',
      targetAudience: 'Premium Customers',
      budget: 15000,
      spent: 14500,
      impressions: 45000,
      clicks: 3200,
      conversions: 180,
      revenue: 72000,
      description: '48-hour flash sale for premium customers',
      createdBy: 'Marketing Team',
      createdDate: '2024-05-20'
    }
  ]);
  
  // Sample promotions data
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      title: 'SUMMER20',
      type: 'percentage',
      value: 20,
      code: 'SUMMER20',
      description: '20% off on all summer collection',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      usageLimit: 1000,
      usedCount: 450,
      minimumOrder: 1000,
      applicableProducts: ['electronics', 'fashion'],
      status: 'active',
      createdDate: '2024-05-15'
    },
    {
      id: '2',
      title: 'WELCOME10',
      type: 'fixed',
      value: 500,
      code: 'WELCOME10',
      description: '₹500 off for new customers',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 5000,
      usedCount: 2300,
      minimumOrder: 2000,
      applicableProducts: [],
      status: 'active',
      createdDate: '2023-12-20'
    },
    {
      id: '3',
      title: 'FREESHIP',
      type: 'free_shipping',
      value: 0,
      code: 'FREESHIP',
      description: 'Free shipping on orders above ₹999',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 10000,
      usedCount: 6500,
      minimumOrder: 999,
      applicableProducts: [],
      status: 'active',
      createdDate: '2024-01-01'
    }
  ]);
  
  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, searchTerm, statusFilter, typeFilter]);
  
  // Filter promotions
  const filteredPromotions = useMemo(() => {
    return promotions.filter(promotion => {
      const matchesSearch = promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || promotion.status === statusFilter;
      const matchesType = typeFilter === 'all' || promotion.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [promotions, searchTerm, statusFilter, typeFilter]);
  
  // Calculate marketing metrics
  const marketingMetrics = useMemo(() => {
    const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
    const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
    const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign.impressions, 0);
    const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0);
    const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
    const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
    
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const roas = totalSpent > 0 ? totalRevenue / totalSpent : 0;
    
    return {
      totalBudget,
      totalSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalRevenue,
      ctr,
      conversionRate,
      roas
    };
  }, [campaigns]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };
  
  const formatPercentage = (value: number) => {
    return value.toFixed(2) + '%';
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'default';
      case 'paused': return 'warning';
      case 'completed': return 'info';
      case 'scheduled': return 'secondary';
      case 'inactive': return 'default';
      case 'expired': return 'error';
      default: return 'default';
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Email />;
      case 'sms': return <Sms />;
      case 'push': return <NotificationsActive />;
      case 'banner': return <Campaign />;
      case 'discount': return <LocalOffer />;
      case 'percentage': return <Percent />;
      case 'fixed': return <MonetizationOn />;
      case 'bogo': return <ShoppingCart />;
      case 'free_shipping': return <LocalOffer />;
      default: return <Campaign />;
    }
  };
  
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, item: Campaign | Promotion) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuItem(item);
  };
  
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuItem(null);
  };
  
  const handleViewDetails = (item: Campaign | Promotion) => {
    setSelectedItem(item);
    setDialogOpen(true);
    handleActionMenuClose();
  };
  
  const handleStatusToggle = (id: string, currentStatus: string) => {
    if (activeTab === 0) {
      // Campaigns
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === id ? { 
          ...campaign, 
          status: currentStatus === 'active' ? 'paused' : 'active' as any
        } : campaign
      ));
    } else {
      // Promotions
      setPromotions(prev => prev.map(promotion => 
        promotion.id === id ? { 
          ...promotion, 
          status: currentStatus === 'active' ? 'inactive' : 'active' as any
        } : promotion
      ));
    }
    handleActionMenuClose();
  };
  
  return (
    <RouteGuard requiredRole="admin">
      <>
        <Head>
          <title>Marketing & Promotions - Admin Dashboard</title>
          <meta name="description" content="Manage marketing campaigns and promotions in the admin dashboard" />
        </Head>
        
        <Box sx={{ width: '100%' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Marketing & Promotions
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage campaigns, promotions, and marketing analytics
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Analytics />}
              >
                View Analytics
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
              >
                Create Campaign
              </Button>
            </Box>
          </Box>
          
          {/* Marketing Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Budget
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(marketingMetrics.totalBudget)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Spent: {formatCurrency(marketingMetrics.totalSpent)}
                      </Typography>
                    </Box>
                    <MonetizationOn sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(marketingMetrics.totalSpent / marketingMetrics.totalBudget) * 100}
                    sx={{ mt: 2, height: 6, borderRadius: 3 }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Impressions
                      </Typography>
                      <Typography variant="h4">
                        {formatNumber(marketingMetrics.totalImpressions)}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        CTR: {formatPercentage(marketingMetrics.ctr)}
                      </Typography>
                    </Box>
                    <Visibility sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Conversions
                      </Typography>
                      <Typography variant="h4">
                        {formatNumber(marketingMetrics.totalConversions)}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        Rate: {formatPercentage(marketingMetrics.conversionRate)}
                      </Typography>
                    </Box>
                    <GpsFixed sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        ROAS
                      </Typography>
                      <Typography variant="h4">
                        {marketingMetrics.roas.toFixed(1)}x
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Revenue: {formatCurrency(marketingMetrics.totalRevenue)}
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
          
          {/* Tabs */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ mb: 3 }}
              >
                <Tab
                  label={
                    <Badge badgeContent={campaigns.length} color="primary">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Campaign />
                        Campaigns
                      </Box>
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Badge badgeContent={promotions.length} color="secondary">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalOffer />
                        Promotions
                      </Box>
                    </Badge>
                  }
                />
              </Tabs>
              
              {/* Filters */}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder={`Search ${activeTab === 0 ? 'campaigns' : 'promotions'}...`}
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
                      <MenuItem value="paused">Paused</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="expired">Expired</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={typeFilter}
                      label="Type"
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      {activeTab === 0 ? (
                        <>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="sms">SMS</MenuItem>
                          <MenuItem value="push">Push</MenuItem>
                          <MenuItem value="banner">Banner</MenuItem>
                          <MenuItem value="discount">Discount</MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem value="percentage">Percentage</MenuItem>
                          <MenuItem value="fixed">Fixed Amount</MenuItem>
                          <MenuItem value="bogo">BOGO</MenuItem>
                          <MenuItem value="free_shipping">Free Shipping</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setTypeFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                    >
                      Export
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Content Table */}
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Duration</TableCell>
                      {activeTab === 0 ? (
                        <>
                          <TableCell align="right">Budget</TableCell>
                          <TableCell align="right">Performance</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell align="right">Usage</TableCell>
                          <TableCell align="right">Discount</TableCell>
                        </>
                      )}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(activeTab === 0 ? filteredCampaigns : filteredPromotions)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.light' }}>
                                {getTypeIcon(item.type)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {'name' in item ? item.name : item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {'description' in item ? item.description : item.code}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getTypeIcon(item.type)}
                              label={item.type.replace('_', ' ')}
                              size="small"
                              variant="outlined"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.status}
                              color={getStatusColor(item.status) as any}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(item.startDate)} - {formatDate(item.endDate)}
                            </Typography>
                          </TableCell>
                          {activeTab === 0 ? (
                            <>
                              <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {formatCurrency((item as Campaign).budget)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Spent: {formatCurrency((item as Campaign).spent)}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2">
                                  {formatNumber((item as Campaign).conversions)} conversions
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatCurrency((item as Campaign).revenue)} revenue
                                </Typography>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell align="right">
                                <Typography variant="body2">
                                  {(item as Promotion).usedCount} / {(item as Promotion).usageLimit}
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={((item as Promotion).usedCount / (item as Promotion).usageLimit) * 100}
                                  sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {(item as Promotion).type === 'percentage' 
                                    ? `${(item as Promotion).value}%` 
                                    : (item as Promotion).type === 'fixed'
                                    ? formatCurrency((item as Promotion).value)
                                    : 'Free Shipping'
                                  }
                                </Typography>
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <IconButton
                              onClick={(e) => handleActionMenuOpen(e, item)}
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
                count={activeTab === 0 ? filteredCampaigns.length : filteredPromotions.length}
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
        
        {/* Action Menu */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
        >
          <MenuItemComponent onClick={() => actionMenuItem && handleViewDetails(actionMenuItem)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent onClick={() => console.log('Edit')}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent 
            onClick={() => actionMenuItem && handleStatusToggle(actionMenuItem.id, actionMenuItem.status)}
          >
            <ListItemIcon>
              {actionMenuItem?.status === 'active' ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </ListItemIcon>
            <ListItemText>
              {actionMenuItem?.status === 'active' ? 'Pause' : 'Activate'}
            </ListItemText>
          </MenuItemComponent>
          <MenuItemComponent onClick={() => console.log('Delete')}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItemComponent>
        </Menu>
        
        {/* Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {activeTab === 0 ? 'Campaign' : 'Promotion'} Details
          </DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Name"
                        secondary={'name' in selectedItem ? selectedItem.name : selectedItem.title}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Type"
                        secondary={selectedItem.type.replace('_', ' ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={selectedItem.status}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Duration"
                        secondary={`${formatDate(selectedItem.startDate)} - ${formatDate(selectedItem.endDate)}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    {activeTab === 0 && 'budget' in selectedItem && (
                      <>
                        <ListItem>
                          <ListItemText
                            primary="Budget"
                            secondary={formatCurrency(selectedItem.budget)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Spent"
                            secondary={formatCurrency(selectedItem.spent)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Conversions"
                            secondary={formatNumber(selectedItem.conversions)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Revenue"
                            secondary={formatCurrency(selectedItem.revenue)}
                          />
                        </ListItem>
                      </>
                    )}
                    {activeTab === 1 && 'code' in selectedItem && (
                      <>
                        <ListItem>
                          <ListItemText
                            primary="Code"
                            secondary={selectedItem.code}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Usage"
                            secondary={`${selectedItem.usedCount} / ${selectedItem.usageLimit}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Minimum Order"
                            secondary={formatCurrency(selectedItem.minimumOrder)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Discount Value"
                            secondary={
                              selectedItem.type === 'percentage' 
                                ? `${selectedItem.value}%` 
                                : selectedItem.type === 'fixed'
                                ? formatCurrency(selectedItem.value)
                                : 'Free Shipping'
                            }
                          />
                        </ListItem>
                      </>
                    )}
                  </List>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
            <Button variant="contained">Edit</Button>
          </DialogActions>
        </Dialog>
      </>
    </RouteGuard>
  );
};

export default AdminMarketing;