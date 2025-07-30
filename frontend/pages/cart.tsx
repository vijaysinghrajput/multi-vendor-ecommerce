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
  IconButton,
  Divider,
  Paper,
  Chip,
  TextField,
  Alert,
  useTheme,
  useMediaQuery,
  Breadcrumbs
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  LocalOffer,
  Security,
  LocalShipping,
  NavigateNext,
  ArrowBack
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

// Mock data imports
import productsData from '../data/products.json';
import vendorsData from '../data/vendors.json';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  vendorId: string;
  vendorName: string;
  inStock: boolean;
  maxQuantity: number;
}

const CartPage: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  // Mock cart items - in real app, this would come from state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: 'p1',
      title: 'Realme 11X 5G (Midnight Black, 128GB)',
      price: 14999,
      originalPrice: 17999,
      image: '/images/realme1.jpg',
      quantity: 1,
      vendorId: 'v1',
      vendorName: 'TechWorld Store',
      inStock: true,
      maxQuantity: 5
    },
    {
      id: '2',
      productId: 'p2',
      title: 'Sony WH-1000XM4 Wireless Headphones',
      price: 24999,
      originalPrice: 29999,
      image: '/images/headphones1.jpg',
      quantity: 2,
      vendorId: 'v2',
      vendorName: 'Audio Paradise',
      inStock: true,
      maxQuantity: 3
    },
    {
      id: '3',
      productId: 'p3',
      title: 'Nike Air Max 270 Running Shoes',
      price: 8999,
      originalPrice: 12999,
      image: '/images/shoes1.jpg',
      quantity: 1,
      vendorId: 'v3',
      vendorName: 'Sports Central',
      inStock: false,
      maxQuantity: 0
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, Math.min(newQuantity, item.maxQuantity)) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
      setPromoDiscount(10); // 10% discount
    } else {
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const promoDiscountAmount = promoApplied ? (subtotal * promoDiscount) / 100 : 0;
  const shipping = subtotal > 500 ? 0 : 99; // Free shipping above ₹500
  const total = subtotal - promoDiscountAmount + shipping;

  const inStockItems = cartItems.filter(item => item.inStock);
  const outOfStockItems = cartItems.filter(item => !item.inStock);

  if (cartItems.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart - ShopHub</title>
          <meta name="description" content="Your shopping cart" />
        </Head>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added anything to your cart yet.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/"
              startIcon={<ArrowBack />}
            >
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Shopping Cart ({cartItems.length} items) - ShopHub</title>
        <meta name="description" content="Review and manage items in your shopping cart" />
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
          <Typography color="text.secondary">Shopping Cart</Typography>
        </Breadcrumbs>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Shopping Cart ({cartItems.length} items)
        </Typography>

        <Grid container spacing={3}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            {/* In Stock Items */}
            {inStockItems.length > 0 && (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ mr: 1, color: 'success.main' }} />
                    Available Items ({inStockItems.length})
                  </Typography>
                  
                  {inStockItems.map((item, index) => (
                    <Box key={item.id}>
                      <Box sx={{ display: 'flex', py: 2 }}>
                        {/* Product Image */}
                        <Box sx={{ position: 'relative', width: 120, height: 120, mr: 2 }}>
                          <Image
                            src={item.image || '/images/placeholder-product.jpg'}
                            alt={item.title}
                            fill
                            style={{ objectFit: 'cover', borderRadius: 8 }}
                          />
                        </Box>

                        {/* Product Details */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Sold by {item.vendorName}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {formatPrice(item.price)}
                            </Typography>
                            {item.originalPrice > item.price && (
                              <Typography
                                variant="body2"
                                sx={{
                                  textDecoration: 'line-through',
                                  color: 'text.secondary',
                                  ml: 1
                                }}
                              >
                                {formatPrice(item.originalPrice)}
                              </Typography>
                            )}
                            {item.originalPrice > item.price && (
                              <Chip
                                label={`${Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF`}
                                color="success"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>

                          {/* Quantity Controls */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconButton
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                size="small"
                              >
                                <Remove />
                              </IconButton>
                              <TextField
                                value={item.quantity}
                                size="small"
                                sx={{ width: 60, mx: 1 }}
                                inputProps={{ style: { textAlign: 'center' } }}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              />
                              <IconButton
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.maxQuantity}
                                size="small"
                              >
                                <Add />
                              </IconButton>
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                (Max: {item.maxQuantity})
                              </Typography>
                            </Box>
                            
                            <IconButton
                              onClick={() => removeItem(item.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                      {index < inStockItems.length - 1 && <Divider />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Out of Stock Items */}
            {outOfStockItems.length > 0 && (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <Alert severity="error" sx={{ mr: 1, p: 0, '& .MuiAlert-icon': { m: 0 } }} />
                    Out of Stock ({outOfStockItems.length})
                  </Typography>
                  
                  {outOfStockItems.map((item, index) => (
                    <Box key={item.id}>
                      <Box sx={{ display: 'flex', py: 2, opacity: 0.6 }}>
                        <Box sx={{ position: 'relative', width: 120, height: 120, mr: 2 }}>
                          <Image
                            src={item.image || '/images/placeholder-product.jpg'}
                            alt={item.title}
                            fill
                            style={{ objectFit: 'cover', borderRadius: 8 }}
                          />
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Sold by {item.vendorName}
                          </Typography>
                          <Chip label="Out of Stock" color="error" size="small" sx={{ mb: 2 }} />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button variant="outlined" size="small">
                              Move to Wishlist
                            </Button>
                            <IconButton
                              onClick={() => removeItem(item.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                      {index < outOfStockItems.length - 1 && <Divider />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Continue Shopping */}
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              component={Link}
              href="/"
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Order Summary
                </Typography>
                
                {/* Promo Code */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Promo Code
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      fullWidth
                    />
                    <Button
                      variant="outlined"
                      onClick={applyPromoCode}
                      disabled={!promoCode}
                    >
                      Apply
                    </Button>
                  </Box>
                  {promoApplied && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      Promo code applied! {promoDiscount}% discount
                    </Alert>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Price Breakdown */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal ({inStockItems.length} items)</Typography>
                    <Typography variant="body2">{formatPrice(subtotal)}</Typography>
                  </Box>
                  
                  {savings > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">Discount</Typography>
                      <Typography variant="body2" color="success.main">-{formatPrice(savings)}</Typography>
                    </Box>
                  )}
                  
                  {promoApplied && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">Promo Discount</Typography>
                      <Typography variant="body2" color="success.main">-{formatPrice(promoDiscountAmount)}</Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping</Typography>
                    <Typography variant="body2" color={shipping === 0 ? 'success.main' : 'inherit'}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </Typography>
                  </Box>
                  
                  {shipping > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      Add {formatPrice(500 - subtotal)} more for free shipping
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatPrice(total)}
                  </Typography>
                </Box>

                {/* Checkout Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={inStockItems.length === 0}
                  component={Link}
                  href="/checkout"
                  sx={{ mb: 2 }}
                >
                  Proceed to Checkout
                </Button>

                {/* Security Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                  <Security sx={{ mr: 1, color: 'success.main', fontSize: 16 }} />
                  <Typography variant="caption" color="text.secondary">
                    Secure checkout with SSL encryption
                  </Typography>
                </Box>

                {/* Shipping Info */}
                <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalShipping sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle2">Delivery Information</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    • Free delivery on orders above ₹500
                    <br />
                    • Standard delivery: 2-5 business days
                    <br />
                    • Express delivery available at checkout
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CartPage;