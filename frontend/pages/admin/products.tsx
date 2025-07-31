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
  CardMedia,
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
  Badge,
  Rating,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Store,
  Star,
  AttachMoney,
  Inventory,
  Category,
  Image,
  CheckCircle,
  Warning,
  Error,
  Block,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  GridView,
  ViewList,
  Sort,
  LocalOffer,
  Verified,
  Report
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import productsData from '../../data/products.json';
import vendorsData from '../../data/vendors.json';
import categoriesData from '../../data/categories.json';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  vendorId: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  discount?: number;
  tags?: string[];
  specifications?: Record<string, string>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductWithVendor extends Product {
  vendorName: string;
  vendorRating: number;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
}

const AdminProducts: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Enhanced product data with vendor information
  const [products, setProducts] = useState<ProductWithVendor[]>(() => {
    return productsData.map(product => {
      const vendor = vendorsData.find(v => v.id === product.vendorId);
      return {
        ...product,
        specifications: product.specifications ? Object.fromEntries(
          Object.entries(product.specifications).filter(([_, value]) => value !== undefined)
        ) : {},
        vendorName: vendor?.businessName || vendor?.displayName || 'Unknown Vendor',
        vendorRating: vendor?.rating || 0,
        status: product.isActive !== false ? 'active' : ['pending', 'rejected'][Math.floor(Math.random() * 2)] as any,
        rating: product.rating || 4 + Math.random(),
        reviewCount: product.reviewCount || Math.floor(Math.random() * 500) + 10,
        inStock: (product.stock || 0) > 0,
        stockQuantity: product.stock || Math.floor(Math.random() * 100) + 1,
        discount: product.discount || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0),
        createdAt: product.createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithVendor | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuProduct, setActionMenuProduct] = useState<ProductWithVendor | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // Get unique values for filters
  const categories = Array.from(new Set(products.map(p => p.category)));
  const vendors = Array.from(new Set(products.map(p => p.vendorName)));
  const maxPrice = Math.max(...products.map(p => p.price));
  
  // Status counts for tabs
  const statusCounts = {
    all: products.length,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    pending: products.filter(p => p.status === 'pending').length,
    rejected: products.filter(p => p.status === 'rejected').length,
    outOfStock: products.filter(p => !p.inStock || p.stockQuantity === 0).length
  };
  
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.vendorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesVendor = vendorFilter === 'all' || product.vendorName === vendorFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      const matchesStock = stockFilter === 'all' || 
                          (stockFilter === 'inStock' && product.inStock && (product.stockQuantity || 0) > 0) ||
                          (stockFilter === 'outOfStock' && (!product.inStock || (product.stockQuantity || 0) === 0)) ||
                          (stockFilter === 'lowStock' && product.inStock && (product.stockQuantity || 0) <= 10);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = (product.rating || 0) >= ratingFilter;
      
      return matchesSearch && matchesCategory && matchesVendor && matchesStatus && matchesStock && matchesPrice && matchesRating;
    });
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof ProductWithVendor];
      let bValue = b[sortBy as keyof ProductWithVendor];
      
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
  }, [products, searchTerm, categoryFilter, vendorFilter, statusFilter, stockFilter, priceRange, ratingFilter, sortBy, sortOrder]);
  
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, product: ProductWithVendor) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuProduct(product);
  };
  
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuProduct(null);
  };
  
  const handleStatusChange = (productId: string, newStatus: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: newStatus as any, isActive: newStatus === 'active' }
        : product
    ));
    handleActionMenuClose();
  };
  
  const handleViewDetails = (product: ProductWithVendor) => {
    setSelectedProduct(product);
    setDetailsDialogOpen(true);
    handleActionMenuClose();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  const getStockStatus = (product: ProductWithVendor) => {
    if (!product.inStock || (product.stockQuantity || 0) === 0) return { label: 'Out of Stock', color: 'error' };
    if ((product.stockQuantity || 0) <= 10) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
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
    const statuses = ['all', 'active', 'inactive', 'pending', 'rejected', 'outOfStock'];
    if (newValue === 5) {
      setStockFilter('outOfStock');
      setStatusFilter('all');
    } else {
      setStatusFilter(statuses[newValue]);
      setStockFilter('all');
    }
    setPage(0);
  };
  
  const renderProductCard = (product: ProductWithVendor) => {
    const stockStatus = getStockStatus(product);
    
    return (
      <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={product.images[0] || '/images/placeholder.jpg'}
            alt={product.title}
            sx={{ objectFit: 'cover' }}
          />
          {(product.discount || 0) > 0 && (
            <Chip
              label={`${product.discount}% OFF`}
              color="error"
              size="small"
              sx={{ position: 'absolute', top: 8, left: 8 }}
            />
          )}
          <Chip
            label={product.status}
            color={getStatusColor(product.status) as any}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8, textTransform: 'capitalize' }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1rem' }} noWrap>
            {product.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" sx={{ ml: 1 }}>
              ({product.reviewCount})
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
              {formatCurrency(product.price)}
            </Typography>
            {product.originalPrice && product.originalPrice > product.price && (
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                {formatCurrency(product.originalPrice)}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Store sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {product.vendorName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Category sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {product.category}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Chip
              label={stockStatus.label}
              color={stockStatus.color as any}
              size="small"
            />
            <IconButton
              onClick={(e) => handleActionMenuOpen(e, product)}
              size="small"
            >
              <MoreVert />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Layout>
      <Head>
        <title>Product Management - Admin Dashboard</title>
        <meta name="description" content="Manage all products on the e-commerce platform" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Product Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor all products across vendors
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={viewMode === 'grid' ? <ViewList /> : <GridView />}
              onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
            >
              {viewMode === 'grid' ? 'Table' : 'Grid'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Add Product
            </Button>
          </Box>
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
                  All Products
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.active} color="success">
                  Active
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.inactive} color="default">
                  Inactive
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
                <Badge badgeContent={statusCounts.rejected} color="error">
                  Rejected
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={statusCounts.outOfStock} color="error">
                  Out of Stock
                </Badge>
              } 
            />
          </Tabs>
        </Paper>
        
        {/* Search and Basic Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products, vendors..."
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="title">Name</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="stockQuantity">Stock</MenuItem>
                  <MenuItem value="createdAt">Date Added</MenuItem>
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
                    <InputLabel>Stock Status</InputLabel>
                    <Select
                      value={stockFilter}
                      label="Stock Status"
                      onChange={(e) => setStockFilter(e.target.value)}
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="inStock">In Stock</MenuItem>
                      <MenuItem value="lowStock">Low Stock</MenuItem>
                      <MenuItem value="outOfStock">Out of Stock</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography gutterBottom>Price Range</Typography>
                  <Slider
                    value={priceRange}
                    onChange={(event, newValue) => setPriceRange(newValue as number[])}
                    valueLabelDisplay="auto"
                    min={0}
                    max={maxPrice}
                    valueLabelFormat={(value) => formatCurrency(value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography gutterBottom>Minimum Rating</Typography>
                  <Rating
                    value={ratingFilter}
                    onChange={(event, newValue) => setRatingFilter(newValue || 0)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sort Order</InputLabel>
                    <Select
                      value={sortOrder}
                      label="Sort Order"
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    >
                      <MenuItem value="asc">Ascending</MenuItem>
                      <MenuItem value="desc">Descending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Paper>
        
        {/* Products List */}
        {viewMode === 'table' ? (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Added</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => {
                      const stockStatus = getStockStatus(product);
                      return (
                        <TableRow key={product.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                src={product.images[0]}
                                variant="rounded"
                                sx={{ width: 48, height: 48, mr: 2 }}
                              >
                                <Image />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {product.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {product.id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={product.category} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.vendorName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {formatCurrency(product.price)}
                              </Typography>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                  {formatCurrency(product.originalPrice)}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Chip
                                label={stockStatus.label}
                                color={stockStatus.color as any}
                                size="small"
                              />
                              <Typography variant="caption" display="block">
                                Qty: {product.stockQuantity}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating value={product.rating} precision={0.1} size="small" readOnly />
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                ({product.reviewCount})
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.status}
                              color={getStatusColor(product.status) as any}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              onClick={(e) => handleActionMenuOpen(e, product)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredProducts.length}
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
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  {renderProductCard(product)}
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <TablePagination
                rowsPerPageOptions={[8, 12, 24, 48]}
                component="div"
                count={filteredProducts.length}
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
        <MenuItemComponent onClick={() => actionMenuProduct && handleViewDetails(actionMenuProduct)}>
          <ListItemIcon><Visibility /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleActionMenuClose()}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText>Edit Product</ListItemText>
        </MenuItemComponent>
        {actionMenuProduct?.status === 'pending' && (
          <MenuItemComponent onClick={() => actionMenuProduct && handleStatusChange(actionMenuProduct.id, 'active')}>
            <ListItemIcon><CheckCircle /></ListItemIcon>
            <ListItemText>Approve</ListItemText>
          </MenuItemComponent>
        )}
        {actionMenuProduct?.status === 'active' && (
          <MenuItemComponent onClick={() => actionMenuProduct && handleStatusChange(actionMenuProduct.id, 'inactive')}>
            <ListItemIcon><VisibilityOff /></ListItemIcon>
            <ListItemText>Deactivate</ListItemText>
          </MenuItemComponent>
        )}
        {actionMenuProduct?.status === 'inactive' && (
          <MenuItemComponent onClick={() => actionMenuProduct && handleStatusChange(actionMenuProduct.id, 'active')}>
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText>Activate</ListItemText>
          </MenuItemComponent>
        )}
        <MenuItemComponent onClick={() => actionMenuProduct && handleStatusChange(actionMenuProduct.id, 'rejected')}>
          <ListItemIcon><Block /></ListItemIcon>
          <ListItemText>Reject</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => handleActionMenuClose()}>
          <ListItemIcon><Delete /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItemComponent>
      </Menu>
      
      {/* Product Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={selectedProduct.images[0]}
                  variant="rounded"
                  sx={{ width: 64, height: 64, mr: 2 }}
                >
                  <Image />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedProduct.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={selectedProduct.status}
                      color={getStatusColor(selectedProduct.status) as any}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Chip
                      label={getStockStatus(selectedProduct).label}
                      color={getStockStatus(selectedProduct).color as any}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Product Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Category:</strong> {selectedProduct.category}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Vendor:</strong> {selectedProduct.vendorName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Price:</strong> {formatCurrency(selectedProduct.price)}
                      {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                        <span style={{ marginLeft: 8, textDecoration: 'line-through', color: theme.palette.text.secondary }}>
                          {formatCurrency(selectedProduct.originalPrice)}
                        </span>
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Stock Quantity:</strong> {selectedProduct.stockQuantity}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <strong style={{ marginRight: 8 }}>Rating:</strong>
                      <Rating value={selectedProduct.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({selectedProduct.reviewCount} reviews)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Product Images
                  </Typography>
                  <Grid container spacing={1}>
                    {selectedProduct.images.slice(0, 4).map((image, index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          component="img"
                          src={image}
                          alt={`${selectedProduct.title} ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'divider'
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2">
                    {selectedProduct.description}
                  </Typography>
                </Grid>
                {selectedProduct.specifications && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Specifications
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <Grid item xs={12} sm={6} key={key}>
                          <Typography variant="body2">
                            <strong>{key}:</strong> {value}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
              <Button variant="outlined" startIcon={<Edit />}>
                Edit Product
              </Button>
              <Button variant="contained" startIcon={<Visibility />}>
                View on Store
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default AdminProducts;