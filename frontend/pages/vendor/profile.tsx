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
  Divider,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Store,
  LocationOn,
  Phone,
  Email,
  Language,
  Schedule,
  AttachMoney,
  Security,
  Notifications,
  Help,
  Visibility,
  VisibilityOff,
  Add,
  Delete,
  Star,
  Verified,
  Business,
  Payment,
  Settings,
  Info
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import vendorsData from '../../data/vendors.json';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const VendorProfile: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mock vendor data (in real app, this would come from auth context)
  const [vendorData, setVendorData] = useState({
    ...vendorsData[0],
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    },
    paymentMethods: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
    shippingZones: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
    notifications: {
      orderUpdates: true,
      promotionalEmails: false,
      smsAlerts: true,
      weeklyReports: true
    },
    bankDetails: {
      accountNumber: '****1234',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      accountHolderName: 'TechMart Store'
    }
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(vendorData);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newShippingZone, setNewShippingZone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleInputChange = (field: string, value: any) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      [parent]: { ...(prev as any)[parent], [field]: value }
    }));
  };
  
  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setEditedData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: { ...prev.businessHours[day as keyof typeof prev.businessHours], [field]: value }
      }
    }));
  };
  
  const handleSave = () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    if (!editedData.businessName.trim()) newErrors.businessName = 'Store name is required';
    if (!editedData.contact.email.trim()) newErrors.email = 'Email is required';
    if (!editedData.contact.phone.trim()) newErrors.phone = 'Phone is required';
    if (!editedData.location?.city?.trim()) newErrors.address = 'Location is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setVendorData(editedData);
    setIsEditing(false);
    setErrors({});
  };
  
  const handleCancel = () => {
    setEditedData(vendorData);
    setIsEditing(false);
    setErrors({});
  };
  
  const handlePasswordChange = () => {
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    // Here you would typically call an API to change password
    alert('Password changed successfully!');
    setPasswordDialogOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };
  
  const handleAddShippingZone = () => {
    if (newShippingZone.trim() && !editedData.shippingZones.includes(newShippingZone.trim())) {
      setEditedData(prev => ({
        ...prev,
        shippingZones: [...prev.shippingZones, newShippingZone.trim()]
      }));
      setNewShippingZone('');
    }
  };
  
  const handleRemoveShippingZone = (zone: string) => {
    setEditedData(prev => ({
      ...prev,
      shippingZones: prev.shippingZones.filter(z => z !== zone)
    }));
  };
  
  const renderStoreInfo = () => (
    <Grid container spacing={3}>
      {/* Store Avatar */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 100, height: 100, mr: 3, fontSize: 36 }}
            src={editedData.logo}
          >
            {editedData.businessName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {editedData.businessName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                icon={<Verified />}
                label="Verified Seller"
                color="success"
                size="small"
              />
              <Chip
                icon={<Star />}
                label={`${editedData.rating} Rating`}
                color="warning"
                size="small"
              />
            </Box>
            {isEditing && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<PhotoCamera />}
              >
                Change Logo
              </Button>
            )}
          </Box>
        </Box>
      </Grid>
      
      {/* Basic Information */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Store Name"
          value={editedData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          disabled={!isEditing}
          error={!!errors.businessName}
          helperText={errors.businessName}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Store Category"
          value={editedData.categories?.[0] || ''}
          onChange={(e) => handleInputChange('categories', [e.target.value])}
          disabled={!isEditing}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Store Description"
          value={editedData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          disabled={!isEditing}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={editedData.contact?.email || ''}
          onChange={(e) => handleNestedInputChange('contact', 'email', e.target.value)}
          disabled={!isEditing}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Phone"
          value={editedData.contact?.phone || ''}
          onChange={(e) => handleNestedInputChange('contact', 'phone', e.target.value)}
          disabled={!isEditing}
          error={!!errors.phone}
          helperText={errors.phone}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="City"
          value={editedData.location?.city || ''}
          onChange={(e) => handleNestedInputChange('location', 'city', e.target.value)}
          disabled={!isEditing}
          error={!!errors.address}
          helperText={errors.address}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn />
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="State"
          value={editedData.location?.state || ''}
          onChange={(e) => handleNestedInputChange('location', 'state', e.target.value)}
          disabled={!isEditing}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Country"
          value={editedData.location?.country || ''}
          onChange={(e) => handleNestedInputChange('location', 'country', e.target.value)}
          disabled={!isEditing}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Website"
          value={editedData.socialLinks?.website || ''}
          onChange={(e) => handleNestedInputChange('socialLinks', 'website', e.target.value)}
          disabled={!isEditing}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Language />
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth disabled={!isEditing}>
          <InputLabel>Store Status</InputLabel>
          <Select
            value={editedData.isVerified ? 'verified' : 'pending'}
            label="Store Status"
            onChange={(e) => handleInputChange('isVerified', e.target.value === 'verified')}
          >
            <MenuItem value="verified">Verified</MenuItem>
            <MenuItem value="pending">Pending Verification</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
  
  const renderBusinessHours = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Business Hours
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(editedData.businessHours).map(([day, hours]) => (
          <Grid item xs={12} key={day}>
            <Card variant="outlined">
              <CardContent sx={{ py: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={2}>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}>
                      {day}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!hours.closed}
                          onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                          disabled={!isEditing}
                        />
                      }
                      label={hours.closed ? 'Closed' : 'Open'}
                    />
                  </Grid>
                  {!hours.closed && (
                    <>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Opening Time"
                          type="time"
                          value={hours.open}
                          onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                          disabled={!isEditing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Closing Time"
                          type="time"
                          value={hours.close}
                          onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                          disabled={!isEditing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
  
  const renderPaymentShipping = () => (
    <Grid container spacing={4}>
      {/* Payment Methods */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Accepted Payment Methods
        </Typography>
        <List>
          {editedData.paymentMethods.map((method, index) => (
            <ListItem key={index}>
              <ListItemText primary={method} />
              {isEditing && (
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      setEditedData(prev => ({
                        ...prev,
                        paymentMethods: prev.paymentMethods.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Grid>
      
      {/* Shipping Zones */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Shipping Zones
        </Typography>
        <Box sx={{ mb: 2 }}>
          {editedData.shippingZones.map((zone, index) => (
            <Chip
              key={index}
              label={zone}
              onDelete={isEditing ? () => handleRemoveShippingZone(zone) : undefined}
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        {isEditing && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Add Shipping Zone"
              value={newShippingZone}
              onChange={(e) => setNewShippingZone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddShippingZone()}
            />
            <Button variant="outlined" onClick={handleAddShippingZone}>
              Add
            </Button>
          </Box>
        )}
      </Grid>
      
      {/* Bank Details */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Bank Account Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Account Holder Name"
              value={editedData.bankDetails.accountHolderName}
              onChange={(e) => handleNestedInputChange('bankDetails', 'accountHolderName', e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Bank Name"
              value={editedData.bankDetails.bankName}
              onChange={(e) => handleNestedInputChange('bankDetails', 'bankName', e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Account Number"
              value={editedData.bankDetails.accountNumber}
              onChange={(e) => handleNestedInputChange('bankDetails', 'accountNumber', e.target.value)}
              disabled={!isEditing}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="IFSC Code"
              value={editedData.bankDetails.ifscCode}
              onChange={(e) => handleNestedInputChange('bankDetails', 'ifscCode', e.target.value)}
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
  
  const renderNotifications = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Order Updates"
            secondary="Get notified when you receive new orders"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={editedData.notifications.orderUpdates}
              onChange={(e) => handleNestedInputChange('notifications', 'orderUpdates', e.target.checked)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="SMS Alerts"
            secondary="Receive SMS notifications for important updates"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={editedData.notifications.smsAlerts}
              onChange={(e) => handleNestedInputChange('notifications', 'smsAlerts', e.target.checked)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Promotional Emails"
            secondary="Receive emails about new features and promotions"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={editedData.notifications.promotionalEmails}
              onChange={(e) => handleNestedInputChange('notifications', 'promotionalEmails', e.target.checked)}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Weekly Reports"
            secondary="Get weekly sales and performance reports"
          />
          <ListItemSecondaryAction>
            <Switch
              checked={editedData.notifications.weeklyReports}
              onChange={(e) => handleNestedInputChange('notifications', 'weeklyReports', e.target.checked)}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Security Settings
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Security />}
          onClick={() => setPasswordDialogOpen(true)}
        >
          Change Password
        </Button>
        <Button variant="outlined" startIcon={<Security />}>
          Enable Two-Factor Authentication
        </Button>
        <Button variant="outlined" startIcon={<Security />}>
          Download Account Data
        </Button>
      </Box>
    </Box>
  );
  
  return (
    <Layout>
      <Head>
        <title>Store Profile - Vendor Dashboard</title>
        <meta name="description" content="Manage your store profile and settings" />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Store Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your store information and settings
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
        
        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
          >
            <Tab icon={<Store />} label="Store Info" />
            <Tab icon={<Schedule />} label="Business Hours" />
            <Tab icon={<Payment />} label="Payment & Shipping" />
            <Tab icon={<Settings />} label="Settings" />
          </Tabs>
        </Paper>
        
        {/* Tab Content */}
        <Paper sx={{ p: 3 }}>
          <CustomTabPanel value={activeTab} index={0}>
            {renderStoreInfo()}
          </CustomTabPanel>
          
          <CustomTabPanel value={activeTab} index={1}>
            {renderBusinessHours()}
          </CustomTabPanel>
          
          <CustomTabPanel value={activeTab} index={2}>
            {renderPaymentShipping()}
          </CustomTabPanel>
          
          <CustomTabPanel value={activeTab} index={3}>
            {renderNotifications()}
          </CustomTabPanel>
        </Paper>
      </Container>
      
      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default VendorProfile;