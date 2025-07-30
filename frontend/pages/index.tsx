import React from 'react';
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
  Rating,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  InputBase,
  Badge,
  alpha
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  LocalOffer,
  TrendingUp,
  Star,
  ArrowForward,
  Search as SearchIcon,
  AccountCircle
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';

// Static dummy data
const categories = [
  { id: 1, name: 'Microscopes', icon: '🔬', slug: 'microscopes' },
  { id: 2, name: 'Lab Equipment', icon: '⚗️', slug: 'lab-equipment' },
  { id: 3, name: 'Medical Devices', icon: '🩺', slug: 'medical-devices' },
  { id: 4, name: 'Chemicals', icon: '🧪', slug: 'chemicals' },
  { id: 5, name: 'Biotechnology', icon: '🧬', slug: 'biotechnology' },
  { id: 6, name: 'Research Tools', icon: '📊', slug: 'research-tools' }
];

const trendingProducts = [
  {
    id: 1,
    title: 'Digital Microscope 1000X',
    price: 45999,
    originalPrice: 65999,
    image: 'https://picsum.photos/seed/microscope/300/200',
    vendor: 'SciTech Labs',
    rating: 4.8,
    discount: 30
  },
  {
    id: 2,
    title: 'PCR Thermal Cycler',
    price: 125999,
    originalPrice: 149999,
    image: 'https://picsum.photos/seed/pcr/300/200',
    vendor: 'BioEquip Pro',
    rating: 4.7,
    discount: 16
  },
  {
    id: 3,
    title: 'Laboratory Centrifuge',
    price: 35999,
    originalPrice: 49999,
    image: 'https://picsum.photos/seed/centrifuge/300/200',
    vendor: 'LabTech Solutions',
    rating: 4.6,
    discount: 28
  },
  {
    id: 4,
    title: 'Digital pH Meter',
    price: 8999,
    originalPrice: 12999,
    image: 'https://picsum.photos/seed/phmeter/300/200',
    vendor: 'Precision Instruments',
    rating: 4.5,
    discount: 31
  },
  {
    id: 5,
    title: 'Spectrophotometer UV-Vis',
    price: 185999,
    originalPrice: 225999,
    image: 'https://picsum.photos/seed/spectro/300/200',
    vendor: 'Advanced Analytics',
    rating: 4.9,
    discount: 18
  },
  {
    id: 6,
    title: 'Analytical Balance 0.1mg',
    price: 25999,
    originalPrice: 35999,
    image: 'https://picsum.photos/seed/balance/300/200',
    vendor: 'Precision Weighing',
    rating: 4.4,
    discount: 28
  }
];

const Home: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Custom Header Component
  const CustomHeader = () => (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#232f3e',
        boxShadow: 'none',
        mb: 0
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src="/logo.svg"
            alt="Life Science Logo"
            sx={{
              height: 32,
              width: 'auto',
              filter: 'brightness(0) invert(1)', // Make logo white
            }}
          />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Life Science
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 1,
            width: { xs: '50%', md: '40%' },
            maxWidth: 600
          }}
        >
          <InputBase
            placeholder="Search products..."
            sx={{
              ml: 2,
              flex: 1,
              py: 1
            }}
          />
          <IconButton 
            type="submit" 
            sx={{ 
              p: 1,
              backgroundColor: '#febd69',
              borderRadius: '0 4px 4px 0',
              '&:hover': { backgroundColor: '#f3a847' }
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Cart */}
          <IconButton sx={{ color: 'white' }}>
            <Badge badgeContent={3} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          
          {/* Login Button */}
          <Button 
            variant="outlined" 
            sx={{ 
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );

  return (
    <>
      <Head>
        <title>Life Science - Advanced Scientific Equipment & Research Solutions</title>
        <meta name="description" content="Discover cutting-edge scientific equipment, laboratory instruments, research tools and life science solutions from trusted vendors worldwide." />
        <meta name="keywords" content="life science, laboratory equipment, scientific instruments, research tools, biotechnology, medical devices" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Custom Header */}
      <CustomHeader />

      {/* Hero Banner */}
      <Box
        sx={{
          width: '100%',
          height: 300,
          backgroundImage: 'url(https://picsum.photos/1200/300)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            color: 'white',
            p: 4,
            borderRadius: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to Life Science
          </Typography>
          <Typography variant="h6">
            Advanced Scientific Equipment & Research Solutions
          </Typography>
        </Box>
      </Box>

      {/* Horizontal Category List */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 2,
            py: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: 4,
            },
          }}
        >
          {categories.map((category) => (
            <Paper
              key={category.id}
              elevation={2}
              sx={{
                minWidth: 120,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4]
                }
              }}
            >
              <Typography variant="h4" sx={{ mb: 1 }}>
                {category.icon}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                {category.name}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Trending Products Grid */}
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🔥 Trending Products
          </Typography>
          
          <Grid container spacing={3}>
            {trendingProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.image}
                      alt={product.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    {product.discount > 0 && (
                      <Chip
                        label={`${product.discount}% OFF`}
                        color="error"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        '&:hover': { bgcolor: 'white' }
                      }}
                    >
                      <Favorite />
                    </IconButton>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="subtitle1"
                      component="h3"
                      sx={{
                        fontWeight: 'medium',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: 48
                      }}
                    >
                      {product.title}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                      by {product.vendor}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        ({product.rating})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {formatPrice(product.price)}
                      </Typography>
                      {product.originalPrice > product.price && (
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                            ml: 1
                          }}
                        >
                          {formatPrice(product.originalPrice)}
                        </Typography>
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      sx={{ mt: 'auto' }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Home;