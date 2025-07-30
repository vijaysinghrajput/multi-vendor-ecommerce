import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Breadcrumbs,
  Link,
  useTheme,
  useMediaQuery,
  Drawer,
  Fab
} from '@mui/material';
import {
  Search,
  FilterList,
  ExpandMore,
  Star,
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  Clear,
  Sort,
  ViewModule,
  ViewList,
  Close
} from '@mui/icons-material';
import Layout from '../components/Layout';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import vendorsData from '../data/vendors.json';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  vendorId: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  discount?: number;
  tags?: string[];
}

const SearchPage: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { q, category } = router.query;
  
  const [searchQuery, setSearchQuery] = useState(q as string || '');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Filter states
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    category ? [category as string] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  
  const productsPerPage = 12;
  const maxPrice = Math.max(...productsData.map(p => p.price));
  
  // Get unique brands from vendors
  const brands = Array.from(new Set(vendorsData.map(v => v.businessName)));
  
  useEffect(() => {
    filterAndSortProducts();
  }, [
    searchQuery,
    selectedCategories,
    selectedBrands,
    priceRange,
    selectedRating,
    inStockOnly,
    discountOnly,
    sortBy
  ]);
  
  useEffect(() => {
    if (q) {
      setSearchQuery(q as string);
    }
  }, [q]);
  
  const filterAndSortProducts = () => {
    let filtered = productsData.filter((product: any) => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category);
      
      // Brand filter
      const vendor = vendorsData.find(v => v.id === product.vendorId);
      const matchesBrand = selectedBrands.length === 0 || 
        (vendor && selectedBrands.includes(vendor.businessName));
      
      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Rating filter
      const matchesRating = selectedRating === 0 || product.rating >= selectedRating;
      
      // Stock filter
      const matchesStock = !inStockOnly || product.inStock;
      
      // Discount filter
      const matchesDiscount = !discountOnly || (product.discount && product.discount > 0);
      
      return matchesSearch && matchesCategory && matchesBrand && 
             matchesPrice && matchesRating && matchesStock && matchesDiscount;
    });
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Simulate newest by id
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        // Relevance - keep original order
        break;
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  const handleCategoryChange = (categoryName: string) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    setSelectedCategories(newCategories);
  };
  
  const handleBrandChange = (brandName: string) => {
    const newBrands = selectedBrands.includes(brandName)
      ? selectedBrands.filter(b => b !== brandName)
      : [...selectedBrands, brandName];
    setSelectedBrands(newBrands);
  };
  
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setSelectedRating(0);
    setInStockOnly(false);
    setDiscountOnly(false);
  };
  
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedBrands.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) count++;
    if (selectedRating > 0) count++;
    if (inStockOnly) count++;
    if (discountOnly) count++;
    return count;
  };
  
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const renderFilters = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        {getActiveFiltersCount() > 0 && (
          <Button
            size="small"
            onClick={clearAllFilters}
            startIcon={<Clear />}
          >
            Clear All
          </Button>
        )}
      </Box>
      
      {/* Categories */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categoriesData.map((cat) => (
              <FormControlLabel
                key={cat.id}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryChange(cat.name)}
                  />
                }
                label={`${cat.name} (${productsData.filter(p => p.category === cat.name).length})`}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      {/* Price Range */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              step={1000}
              valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption">₹{priceRange[0].toLocaleString()}</Typography>
              <Typography variant="caption">₹{priceRange[1].toLocaleString()}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      {/* Brands */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Brands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {brands.slice(0, 10).map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                  />
                }
                label={brand}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      {/* Rating */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Customer Rating</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {[4, 3, 2, 1].map((rating) => (
              <FormControlLabel
                key={rating}
                control={
                  <Checkbox
                    checked={selectedRating === rating}
                    onChange={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {Array.from({ length: rating }, (_, i) => (
                      <Star key={i} sx={{ color: 'gold', fontSize: 16 }} />
                    ))}
                    <Typography variant="body2" sx={{ ml: 1 }}>& Up</Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      {/* Other Filters */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1">Other Filters</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
              }
              label="In Stock Only"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                />
              }
              label="On Sale"
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
  
  const renderProductCard = (product: any) => {
    const vendor = vendorsData.find(v => v.id === product.vendorId);
    const isWishlisted = wishlist.includes(product.id);
    
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
          {product.discount && (
            <Chip
              label={`${product.discount}% OFF`}
              color="error"
              size="small"
              sx={{ position: 'absolute', top: 8, left: 8 }}
            />
          )}
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
            onClick={() => toggleWishlist(product.id)}
          >
            {isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Star sx={{ color: 'gold', fontSize: 16, mr: 0.5 }} />
              <Typography variant="body2">{product.rating}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              ({product.reviewCount} reviews)
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            by {vendor?.businessName}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ₹{product.price.toLocaleString()}
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through', ml: 1 }}
              >
                ₹{product.originalPrice.toLocaleString()}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ mt: 'auto' }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCart />}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Layout>
      <Head>
        <title>{searchQuery ? `Search: ${searchQuery}` : 'Search Products'} - ShopHub</title>
        <meta name="description" content="Search and discover products from multiple vendors" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" color="inherit" underline="hover">
            Home
          </Link>
          <Typography color="text.primary">
            {searchQuery ? `Search: ${searchQuery}` : 'Search'}
          </Typography>
        </Breadcrumbs>
        
        {/* Search Bar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Search for products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </form>
        </Paper>
        
        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Paper sx={{ position: 'sticky', top: 20 }}>
                {renderFilters()}
              </Paper>
            </Grid>
          )}
          
          {/* Products */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {/* Results Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6">
                  {filteredProducts.length} Results
                  {searchQuery && ` for "${searchQuery}"`}
                </Typography>
                {getActiveFiltersCount() > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {selectedCategories.map(cat => (
                      <Chip
                        key={cat}
                        label={cat}
                        size="small"
                        onDelete={() => handleCategoryChange(cat)}
                      />
                    ))}
                    {selectedBrands.map(brand => (
                      <Chip
                        key={brand}
                        label={brand}
                        size="small"
                        onDelete={() => handleBrandChange(brand)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* View Mode Toggle */}
                <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <ViewModule />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                  >
                    <ViewList />
                  </IconButton>
                </Box>
                
                {/* Sort */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Customer Rating</MenuItem>
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="discount">Discount</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <Grid container spacing={2}>
                  {paginatedProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={product.id}>
                      {renderProductCard(product)}
                    </Grid>
                  ))}
                </Grid>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(_, page) => setCurrentPage(page)}
                      color="primary"
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Try adjusting your search or filters
                </Typography>
                <Button variant="outlined" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      
      {/* Mobile Filter Button */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setFiltersOpen(true)}
        >
          <FilterList />
          {getActiveFiltersCount() > 0 && (
            <Chip
              label={getActiveFiltersCount()}
              size="small"
              color="error"
              sx={{ position: 'absolute', top: -8, right: -8 }}
            />
          )}
        </Fab>
      )}
      
      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        PaperProps={{ sx: { width: '100%', maxWidth: 400 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setFiltersOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        {renderFilters()}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setFiltersOpen(false)}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    </Layout>
  );
};

export default SearchPage;