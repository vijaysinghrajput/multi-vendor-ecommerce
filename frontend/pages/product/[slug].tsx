import React, { useState } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
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
  Rating,
  Divider,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Breadcrumbs,
  useTheme,
  useMediaQuery,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  Add,
  Remove,
  Star,
  Verified,
  Store,
  LocalShipping,
  Security,
  ThumbUp,
  ThumbDown,
  NavigateNext
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Mock data imports
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
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetailPage: NextPage = ({ product, vendor, relatedProducts }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [tabValue, setTabValue] = useState(0);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const mockReviews = [
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      comment: 'Excellent product! Highly recommended.',
      date: '2024-01-15',
      helpful: 12
    },
    {
      id: 2,
      user: 'Jane Smith',
      rating: 4,
      comment: 'Good quality, fast delivery.',
      date: '2024-01-10',
      helpful: 8
    },
    {
      id: 3,
      user: 'Mike Johnson',
      rating: 5,
      comment: 'Amazing value for money!',
      date: '2024-01-08',
      helpful: 15
    }
  ];

  return (
    <>
      <Head>
        <title>{product.title} - ShopHub</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`${product.category}, ${product.title}, online shopping`} />
      </Head>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography color="text.primary">Home</Typography>
          </Link>
          <Link href={`/category/${product.category.toLowerCase()}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography color="text.primary">{product.category}</Typography>
          </Link>
          <Typography color="text.secondary">{product.title}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Main Image */}
              <Card sx={{ mb: 2 }}>
                <Box sx={{ position: 'relative', height: 400 }}>
                  <Image
                    src={product.images[selectedImage] || '/images/placeholder-product.jpg'}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {product.discount > 0 && (
                    <Chip
                      label={`${product.discount}% OFF`}
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>
              </Card>
              
              {/* Thumbnail Images */}
              <Grid container spacing={1}>
                {product.images.map((image: string, index: number) => (
                  <Grid item xs={3} key={index}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedImage === index ? 2 : 0,
                        borderColor: 'primary.main'
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Box sx={{ position: 'relative', height: 80 }}>
                        <Image
                          src={image || '/images/placeholder-product.jpg'}
                          alt={`${product.title} ${index + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {product.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1, mr: 2 }}>
                  ({product.reviewCount} reviews)
                </Typography>
                <Chip label={product.category} size="small" variant="outlined" />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatPrice(product.price)}
                  </Typography>
                  {product.originalPrice > product.price && (
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                        ml: 2
                      }}
                    >
                      {formatPrice(product.originalPrice)}
                    </Typography>
                  )}
                </Box>
                {product.discount > 0 && (
                  <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                    You save {formatPrice(product.originalPrice - product.price)} ({product.discount}% off)
                  </Typography>
                )}
              </Box>

              <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
                {product.description}
              </Typography>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Variant</InputLabel>
                    <Select
                      value={selectedVariant}
                      label="Select Variant"
                      onChange={(e) => setSelectedVariant(e.target.value)}
                    >
                      {product.variants.map((variant: any) => (
                        <MenuItem key={variant.id} value={variant.id}>
                          {variant.name} - {formatPrice(variant.price)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Remove />
                  </IconButton>
                  <TextField
                    value={quantity}
                    size="small"
                    sx={{ width: 80, mx: 1 }}
                    inputProps={{ style: { textAlign: 'center' } }}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <IconButton onClick={() => handleQuantityChange(1)}>
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Add to Cart
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      sx={{ py: 1.5 }}
                    >
                      Buy Now
                    </Button>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
                  <IconButton>
                    <Favorite />
                  </IconButton>
                  <IconButton>
                    <Share />
                  </IconButton>
                </Box>
              </Box>

              {/* Delivery Info */}
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle2">Free delivery by tomorrow</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Security sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle2">Secure transaction</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Verified sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle2">1 year warranty</Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Vendor Information */}
        <Card sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Store sx={{ mr: 1 }} />
            Sold by
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, width: 56, height: 56 }}>
                {vendor?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">{vendor?.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={vendor?.rating || 4.5} size="small" readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({vendor?.reviewCount || 0} reviews)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {vendor?.description}
                </Typography>
              </Box>
            </Box>
            <Button variant="outlined" component={Link} href={`/vendor/${vendor?.slug}`}>
              Visit Store
            </Button>
          </Box>
        </Card>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </Typography>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {key}:
                    </Typography>
                    <Typography variant="body2">
                      {value as string}
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="h6" sx={{ ml: 1, mr: 2 }}>
                  {product.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on {product.reviewCount} reviews
                </Typography>
              </Box>
            </Box>
            
            <List>
              {mockReviews.map((review) => (
                <ListItem key={review.id} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar>{review.user.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ mr: 2 }}>
                          {review.user}
                        </Typography>
                        <Rating value={review.rating} size="small" readOnly />
                        <Typography variant="caption" sx={{ ml: 'auto' }}>
                          {review.date}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" paragraph>
                          {review.comment}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton size="small">
                            <ThumbUp fontSize="small" />
                          </IconButton>
                          <Typography variant="caption" sx={{ mr: 1 }}>
                            {review.helpful}
                          </Typography>
                          <IconButton size="small">
                            <ThumbDown fontSize="small" />
                          </IconButton>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </Box>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.slice(0, 4).map((relatedProduct: any) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ position: 'relative', height: 150, mb: 2 }}>
                        <Image
                          src={relatedProduct.images[0] || '/images/placeholder-product.jpg'}
                          alt={relatedProduct.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                        {relatedProduct.title}
                      </Typography>
                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(relatedProduct.price)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = productsData.map((product) => ({
    params: { slug: product.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const product = productsData.find((p) => p.slug === params?.slug);
  
  if (!product) {
    return {
      notFound: true,
    };
  }

  const vendor = vendorsData.find((v) => v.id === product.vendorId);
  const relatedProducts = productsData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return {
    props: {
      product,
      vendor: vendor || null,
      relatedProducts,
    },
  };
};

export default ProductDetailPage;