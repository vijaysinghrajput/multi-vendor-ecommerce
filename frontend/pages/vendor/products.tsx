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
  CardMedia,
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
  Switch,
  FormControlLabel,
  Paper,
  useTheme,
  useMediaQuery,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  MoreVert,
  ContentCopy,
  TrendingUp,
  TrendingDown,
  Inventory,
  Star,
  ShoppingCart,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import productsData from '../../data/products.json';
import vendorsData from '../../data/vendors.json';
import categoriesData from '../../data/categories.json';

const VendorProducts: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mock vendor data (in real app, this would come from auth context)
  const currentVendor = vendorsData[0];
  const [products, setProducts] = useState(
    productsData.filter(p => p.vendorId === currentVendor.id)
  );
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !searchQuery || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' && product.inStock) ||
        (statusFilter === 'inactive' && !product.inStock);
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
        case 'newest':
        default:
          return b.id.localeCompare(a.id);
      }
    });
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };
  
  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };
  
  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  
  const handleToggleStatus = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ));
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: any) => {
    setMenuAnchor(event.currentTarget);
    setSelectedProduct(product);
  };
  
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedProduct(null);
  };
  
  const getStockStatus = (product: any) => {
    if (!product.inStock) return { label: 'Out of Stock', color: 'error' };
    // Mock stock levels
    const stock = Math.floor(Math.random() * 100) + 1;
    if (stock < 10) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };
  
  const renderProductCard = (product: any) => {
    const stockStatus = getStockStatus(product);
    
    return (
      <Card key={product.id}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={product.images[0] || '/images/placeholder.jpg'}
            alt={product.title}
            sx={{ objectFit: 'cover' }}
          />
          {product.discount && (
            <Chip
              label={`${product.discount}% OFF`}
              color="error"
              size="small"
              sx={{ position: 'absolute', top: 8, left: 8 }}
            />
          )}
          <Chip
            label={stockStatus.label}
            color={stockStatus.color as any}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          />
        </Box>
        
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Star sx={{ color: 'gold', fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">
              {product.rating} ({product.reviewCount} reviews)
            </Typography>
          </Box>
          
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
            ₹{product.price.toLocaleString()}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              sx={{ flex: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Visibility />}
              sx={{ flex: 1 }}
            >
              View
            </Button>
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, product)}
            >
              <MoreVert />
            </IconButton>
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
            <TableCell padding="checkbox">
              <Switch
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                indeterminate={selectedProducts.length > 0 && selectedProducts.length < filteredProducts.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock Status</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProducts
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((product) => {
              const stockStatus = getStockStatus(product);
              const isSelected = selectedProducts.includes(product.id);
              
              return (
                <TableRow key={product.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Switch
                      checked={isSelected}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          mr: 2,
                          backgroundImage: `url(${product.images[0] || '/images/placeholder.jpg'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {product.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      ₹{product.price.toLocaleString()}
                    </Typography>
                    {product.originalPrice && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{product.originalPrice.toLocaleString()}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={stockStatus.label}
                      color={stockStatus.color as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ color: 'gold', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {product.rating} ({product.reviewCount})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={product.inStock}
                          onChange={() => handleToggleStatus(product.id)}
                          size="small"
                        />
                      }
                      label={product.inStock ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Product">
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Product">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, product)}
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
        count={filteredProducts.length}
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
        <title>Manage Products - Vendor Dashboard</title>
        <meta name="description" content="Manage your product listings" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Products
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your product listings and inventory
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} size="large">
            Add Product
          </Button>
        </Box>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Products
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {products.length}
                    </Typography>
                  </Box>
                  <Inventory sx={{ fontSize: 40, color: 'primary.main' }} />
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
                      Active Products
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {products.filter(p => p.inStock).length}
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
                    <Typography variant="body2" color="text.secondary">
                      Low Stock
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      3
                    </Typography>
                  </Box>
                  <Warning sx={{ fontSize: 40, color: 'warning.main' }} />
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
                      Avg. Rating
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)}
                    </Typography>
                  </Box>
                  <Star sx={{ fontSize: 40, color: 'warning.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Filters and Search */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categoriesData.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="name">Name A-Z</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="stock">Stock Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                  sx={{ flex: 1 }}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grid')}
                  sx={{ flex: 1 }}
                >
                  Grid
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>
                {selectedProducts.length} product(s) selected
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined">
                  Bulk Edit
                </Button>
                <Button size="small" variant="outlined" color="error">
                  Delete Selected
                </Button>
              </Box>
            </Box>
          </Alert>
        )}
        
        {/* Products List */}
        {viewMode === 'table' ? (
          renderTableView()
        ) : (
          <Grid container spacing={2}>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  {renderProductCard(product)}
                </Grid>
              ))}
          </Grid>
        )}
        
        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Inventory sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {searchQuery || categoryFilter || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first product'
              }
            </Typography>
            <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }}>
              Add Product
            </Button>
          </Box>
        )}
      </Container>
      
      {/* Product Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Product</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate Product</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <TrendingUp fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Analytics</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleDeleteProduct(selectedProduct)}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Product</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{productToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default VendorProducts;