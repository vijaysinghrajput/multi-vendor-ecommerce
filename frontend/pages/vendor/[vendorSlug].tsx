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
  Avatar,
  Paper,
  Tabs,
  Tab,
  Rating,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Store,
  Star,
  LocationOn,
  Phone,
  Email,
  Language,
  Verified,
  FavoriteBorder,
  Favorite,
  ShoppingCart,
  Share,
  Info,
  Inventory,
  Reviews,
  Sort
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import productsData from '../../data/products.json';
import vendorsData from '../../data/vendors.json';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vendor-tabpanel-${index}`}
      aria-labelledby={`vendor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const VendorStorePage: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { vendorSlug } = router.query;
  
  const [vendor, setVendor] = useState<any>(null);
  const [vendorProducts, setVendorProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [isFollowing, setIsFollowing] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  useEffect(() => {
    if (vendorSlug) {
      // Find vendor by slug (using businessName as slug for demo)
      const foundVendor = vendorsData.find(v => 
        v.businessName.toLowerCase().replace(/\s+/g, '-') === vendorSlug
      );
      
      if (foundVendor) {
        setVendor(foundVendor);
        
        // Get vendor's products
        let products = productsData.filter(p => p.vendorId === foundVendor.id);
        
        // Sort products
        switch (sortBy) {
          case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
          default:
            products.sort((a, b) => b.id.localeCompare(a.id));
            break;
        }
        
        setVendorProducts(products);
      }
    }
  }, [vendorSlug, sortBy]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const handleFollowVendor = () => {
    setIsFollowing(!isFollowing);
  };
  
  const handleShareStore = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vendor?.businessName} - ShopHub`,
        text: `Check out ${vendor?.businessName} store on ShopHub`,
        url: window.location.href
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  if (!vendor) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h6" textAlign="center">
            Vendor not found
          </Typography>
        </Container>
      </Layout>
    );
  }
  
  const renderProductCard = (product: any) => {
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
            <Rating value={product.rating} readOnly size="small" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              ({product.reviewCount})
            </Typography>
          </Box>
          
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
              onClick={() => router.push(`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  const renderAboutTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            About {vendor.businessName}
          </Typography>
          <Typography variant="body1" paragraph>
            {vendor.description || `Welcome to ${vendor.businessName}! We are committed to providing high-quality products and excellent customer service. Our store offers a wide range of products carefully selected to meet your needs.`}
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Store Policies
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Return Policy:</strong> 30-day return policy on most items. Items must be in original condition.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Shipping:</strong> We offer fast and reliable shipping. Most orders are processed within 1-2 business days.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Customer Support:</strong> Our customer support team is available to help you with any questions or concerns.
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Store Information
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body1">
                {vendor.address?.city}, {vendor.address?.state}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Phone sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">
                {vendor.contactInfo?.phone}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Email sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {vendor.contactInfo?.email}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Store sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Store Since
              </Typography>
              <Typography variant="body1">
                {new Date(vendor.joinedDate).getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Store Stats
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Products
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {vendorProducts.length}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Average Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating value={vendor.rating} readOnly size="small" sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {vendor.rating}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Reviews
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {vendor.totalReviews}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Response Rate
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              98%
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
  
  const renderProductsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Products ({vendorProducts.length})
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {vendorProducts.length > 0 ? (
        <Grid container spacing={2}>
          {vendorProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              {renderProductCard(product)}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Inventory sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No products available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This vendor hasn't added any products yet.
          </Typography>
        </Box>
      )}
    </Box>
  );
  
  const renderReviewsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Customer Reviews
      </Typography>
      
      {/* Review Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {vendor.rating}
            </Typography>
            <Rating value={vendor.rating} readOnly size="large" sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Based on {vendor.totalReviews} reviews
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = Math.floor(Math.random() * 50) + 10;
              const percentage = (count / vendor.totalReviews) * 100;
              
              return (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 20 }}>
                    {rating}
                  </Typography>
                  <Star sx={{ fontSize: 16, color: 'gold', mx: 1 }} />
                  <Box sx={{ flexGrow: 1, bgcolor: 'grey.200', height: 8, borderRadius: 4, mx: 2 }}>
                    <Box
                      sx={{
                        width: `${percentage}%`,
                        height: '100%',
                        bgcolor: 'primary.main',
                        borderRadius: 4
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 40 }}>
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Sample Reviews */}
      <Box>
        {[1, 2, 3].map((review) => (
          <Paper key={review} sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2 }}>U</Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  User {review}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={5} readOnly size="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    2 days ago
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body1">
              Great products and excellent customer service! The quality exceeded my expectations and delivery was fast. Highly recommended!
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
  
  return (
    <Layout>
      <Head>
        <title>{vendor.businessName} - ShopHub</title>
        <meta name="description" content={`Shop from ${vendor.businessName} on ShopHub. ${vendor.description || 'Quality products and excellent service.'}`} />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link href="/" color="inherit" underline="hover">
            Home
          </Link>
          <Link href="/search" color="inherit" underline="hover">
            Vendors
          </Link>
          <Typography color="text.primary">
            {vendor.businessName}
          </Typography>
        </Breadcrumbs>
        
        {/* Vendor Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 100, height: 100, mx: 'auto', bgcolor: 'primary.main' }}
              >
                <Store sx={{ fontSize: 50 }} />
              </Avatar>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mr: 2 }}>
                  {vendor.businessName}
                </Typography>
                {vendor.isVerified && (
                  <Verified color="primary" sx={{ fontSize: 28 }} />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={vendor.rating} readOnly sx={{ mr: 2 }} />
                <Typography variant="body1" sx={{ mr: 2 }}>
                  {vendor.rating} ({vendor.totalReviews} reviews)
                </Typography>
                <Chip
                  label={vendor.status === 'active' ? 'Active' : 'Inactive'}
                  color={vendor.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                {vendor.description || `Welcome to ${vendor.businessName}! We offer quality products with excellent customer service.`}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<LocationOn />}
                  label={`${vendor.address?.city}, ${vendor.address?.state}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={<Inventory />}
                  label={`${vendorProducts.length} Products`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Since ${new Date(vendor.joinedDate).getFullYear()}`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant={isFollowing ? 'outlined' : 'contained'}
                  fullWidth
                  onClick={handleFollowVendor}
                  startIcon={isFollowing ? <Favorite /> : <FavoriteBorder />}
                >
                  {isFollowing ? 'Following' : 'Follow Store'}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Share />}
                  onClick={handleShareStore}
                >
                  Share Store
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Vendor Content */}
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Products" icon={<Inventory />} iconPosition="start" />
            <Tab label="About" icon={<Info />} iconPosition="start" />
            <Tab label="Reviews" icon={<Reviews />} iconPosition="start" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            <TabPanel value={activeTab} index={0}>
              {renderProductsTab()}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {renderAboutTab()}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              {renderReviewsTab()}
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default VendorStorePage;