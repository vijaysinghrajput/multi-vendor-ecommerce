import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Tabs,
  Tab,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  Person,
  Edit,
  LocationOn,
  Add,
  Delete,
  ShoppingBag,
  Star,
  Visibility,
  Security,
  Logout,
  Phone,
  Email,
  Home,
  Business
} from '@mui/icons-material';
import Layout from '../components/Layout';
import ordersData from '../data/orders.json';

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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  
  // Mock user data
  const [user, setUser] = useState({
    id: 'u1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    avatar: '',
    joinedDate: '2023-01-15'
  });
  
  // Mock addresses
  const [addresses, setAddresses] = useState([
    {
      id: 'a1',
      type: 'home',
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '123 Main Street',
      addressLine2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true
    },
    {
      id: 'a2',
      type: 'work',
      name: 'John Doe',
      phone: '+91 9876543210',
      addressLine1: '456 Business Park',
      addressLine2: 'Floor 5',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false
    }
  ]);
  
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleSaveProfile = () => {
    setEditProfileOpen(false);
    // Save profile logic here
  };

  const handleAddAddress = () => {
    const id = `a${addresses.length + 1}`;
    setAddresses([...addresses, { ...newAddress, id }]);
    setNewAddress({
      type: 'home',
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setAddAddressOpen(false);
  };

  const handleEditAddress = (address: any) => {
    setSelectedAddress(address);
    setEditAddressOpen(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const renderProfileTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Avatar
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
            >
              <Person sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Member since {new Date(user.joinedDate).toLocaleDateString()}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEditProfile}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Person sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {user.phone}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Security"
                  secondary="Change password, enable 2FA"
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <Security />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Privacy"
                  secondary="Manage your privacy settings"
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <Visibility />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Logout"
                  secondary="Sign out of your account"
                />
                <ListItemSecondaryAction>
                  <IconButton color="error">
                    <Logout />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderOrdersTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>
      <Grid container spacing={2}>
        {ordersData.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={order.status}
                    color={getOrderStatusColor(order.status) as any}
                    size="small"
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  {order.items.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <ShoppingBag sx={{ color: 'grey.500' }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {item.productTitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6">
                    Total: ₹{order.pricing?.total?.toLocaleString() || '0'}
                  </Typography>
                  <Box>
                    <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                      Track Order
                    </Button>
                    <Button variant="text" size="small">
                      View Details
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAddressesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Saved Addresses
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddAddressOpen(true)}
        >
          Add Address
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {addresses.map((address) => (
          <Grid item xs={12} md={6} key={address.id}>
            <Card sx={{ position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {address.type === 'home' ? <Home sx={{ mr: 1 }} /> : <Business sx={{ mr: 1 }} />}
                  <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                    {address.type}
                  </Typography>
                  {address.isDefault && (
                    <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
                  )}
                </Box>
                
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {address.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.addressLine1}
                </Typography>
                {address.addressLine2 && (
                  <Typography variant="body2" color="text.secondary">
                    {address.addressLine2}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {address.city}, {address.state} - {address.pincode}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.phone}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditAddress(address)}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Layout>
      <Head>
        <title>My Profile - ShopHub</title>
        <meta name="description" content="Manage your profile, orders, and addresses" />
      </Head>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Account
        </Typography>
        
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Profile" icon={<Person />} iconPosition="start" />
            <Tab label="Orders" icon={<ShoppingBag />} iconPosition="start" />
            <Tab label="Addresses" icon={<LocationOn />} iconPosition="start" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            <TabPanel value={activeTab} index={0}>
              {renderProfileTab()}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              {renderOrdersTab()}
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              {renderAddressesTab()}
            </TabPanel>
          </Box>
        </Paper>
      </Container>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onClose={() => setEditProfileOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={user.firstName}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProfileOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Address Dialog */}
      <Dialog open={addAddressOpen} onClose={() => setAddAddressOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 1"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address Line 2 (Optional)"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={newAddress.pincode}
                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddAddressOpen(false)}>Cancel</Button>
          <Button onClick={handleAddAddress} variant="contained">Add Address</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ProfilePage;