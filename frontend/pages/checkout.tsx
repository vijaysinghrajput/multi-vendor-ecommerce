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
  Stepper,
  Step,
  StepLabel,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Divider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Breadcrumbs
} from '@mui/material';
import {
  LocationOn,
  Payment,
  Security,
  LocalShipping,
  CheckCircle,
  Add,
  Edit,
  CreditCard,
  AccountBalance,
  Wallet,
  NavigateNext
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  vendorName: string;
}

const CheckoutPage: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const steps = ['Delivery Address', 'Payment Method', 'Review Order'];

  // Mock data
  const addresses: Address[] = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '123 Main Street, Apartment 4B',
      addressLine2: 'Near City Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    },
    {
      id: '2',
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '456 Business District',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false
    }
  ];

  const cartItems: CartItem[] = [
    {
      id: '1',
      title: 'Realme 11X 5G (Midnight Black, 128GB)',
      price: 14999,
      quantity: 1,
      image: '/images/realme1.jpg',
      vendorName: 'TechWorld Store'
    },
    {
      id: '2',
      title: 'Sony WH-1000XM4 Wireless Headphones',
      price: 24999,
      quantity: 1,
      image: '/images/headphones1.jpg',
      vendorName: 'Audio Paradise'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Simulate API call
    setTimeout(() => {
      setIsPlacingOrder(false);
      router.push('/order-success');
    }, 2000);
  };

  const AddressForm = () => (
    <Dialog open={showAddressDialog} onClose={() => setShowAddressDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Address</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name" required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone Number" required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Address Line 1" required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Address Line 2 (Optional)" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="City" required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="State" required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Pincode" required />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowAddressDialog(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => setShowAddressDialog(false)}>Save Address</Button>
      </DialogActions>
    </Dialog>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1 }} />
                  Select Delivery Address
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => setShowAddressDialog(true)}
                >
                  Add New
                </Button>
              </Box>
              
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                >
                  {addresses.map((address) => (
                    <Paper
                      key={address.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: selectedAddress === address.id ? 2 : 1,
                        borderColor: selectedAddress === address.id ? 'primary.main' : 'grey.300'
                      }}
                    >
                      <FormControlLabel
                        value={address.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: 1, width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                {address.name}
                                {address.isDefault && (
                                  <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
                                )}
                              </Typography>
                              <Button size="small" startIcon={<Edit />}>
                                Edit
                              </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {address.phone}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </Typography>
                            <Typography variant="body2">
                              {address.city}, {address.state} - {address.pincode}
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Payment sx={{ mr: 1 }} />
                Payment Method
              </Typography>
              
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                >
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <FormControlLabel
                      value="cod"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <Wallet sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle1">Cash on Delivery</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pay when you receive your order
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>
                  
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <CreditCard sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle1">Credit/Debit Card</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Visa, Mastercard, RuPay accepted
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>
                  
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <FormControlLabel
                      value="upi"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <AccountBalance sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle1">UPI Payment</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Pay using Google Pay, PhonePe, Paytm
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>
                  
                  <Paper sx={{ p: 2 }}>
                    <FormControlLabel
                      value="netbanking"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <Security sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle1">Net Banking</Typography>
                            <Typography variant="body2" color="text.secondary">
                              All major banks supported
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        );

      case 2:
        const selectedAddr = addresses.find(addr => addr.id === selectedAddress);
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {/* Delivery Address */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1 }} />
                    Delivery Address
                  </Typography>
                  {selectedAddr && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {selectedAddr.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAddr.phone}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {selectedAddr.addressLine1}
                        {selectedAddr.addressLine2 && `, ${selectedAddr.addressLine2}`}
                      </Typography>
                      <Typography variant="body2">
                        {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Items ({cartItems.length})
                  </Typography>
                  {cartItems.map((item, index) => (
                    <Box key={item.id}>
                      <Box sx={{ display: 'flex', py: 2 }}>
                        <Box sx={{ position: 'relative', width: 80, height: 80, mr: 2 }}>
                          <Image
                            src={item.image || '/images/placeholder-product.jpg'}
                            alt={item.title}
                            fill
                            style={{ objectFit: 'cover', borderRadius: 8 }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Sold by {item.vendorName}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2">
                              Qty: {item.quantity}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                              {formatPrice(item.price)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {index < cartItems.length - 1 && <Divider />}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Payment Summary */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Summary
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Subtotal</Typography>
                      <Typography variant="body2">{formatPrice(subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Shipping</Typography>
                      <Typography variant="body2" color="success.main">FREE</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Tax (GST)</Typography>
                      <Typography variant="body2">{formatPrice(tax)}</Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {formatPrice(total)}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Payment Method: {selectedPayment === 'cod' ? 'Cash on Delivery' : 
                                   selectedPayment === 'card' ? 'Credit/Debit Card' :
                                   selectedPayment === 'upi' ? 'UPI Payment' : 'Net Banking'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Checkout - ShopHub</title>
        <meta name="description" content="Complete your order securely" />
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
          <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography color="text.primary">Cart</Typography>
          </Link>
          <Typography color="text.secondary">Checkout</Typography>
        </Breadcrumbs>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Checkout
        </Typography>

        {/* Security Banner */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Security sx={{ mr: 1 }} />
            Your order is secured with SSL encryption. We never store your payment information.
          </Box>
        </Alert>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Step Content */}
        <Box sx={{ mb: 3 }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              size="large"
              sx={{ px: 4 }}
            >
              {isPlacingOrder ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              size="large"
            >
              Continue
            </Button>
          )}
        </Box>

        {/* Order Summary Sidebar for Mobile */}
        {isMobile && activeStep < 2 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Total ({cartItems.length} items)</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatPrice(total)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>

      <AddressForm />
    </>
  );
};

export default CheckoutPage;