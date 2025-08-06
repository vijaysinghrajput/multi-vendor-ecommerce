import React, { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tab,
  Tabs
} from '@mui/material';
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import RouteGuard from '../../components/RouteGuard';

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    siteName: 'Multi-Vendor E-Commerce',
    siteDescription: 'Professional e-commerce platform',
    adminEmail: 'admin@example.com',
    timezone: 'UTC',
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    vendorNotifications: true,
    maintenanceMode: false,
    registrationEnabled: true,
    guestCheckout: true,
    autoApproveVendors: false
  });

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // API call would go here
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <RouteGuard requiredRole="admin">
      <AdminLayout>
        <Head>
          <title>Settings - Admin Portal</title>
          <meta name="description" content="Manage system settings in the admin portal" />
        </Head>
        
        <Box sx={{ height: '100%' }}>
          {/* Header Section */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              System Settings
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>

      {/* Settings Tabs */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab icon={<SettingsIcon />} label="General" />
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<SecurityIcon />} label="Security" />
            <Tab icon={<PaymentIcon />} label="Payments" />
          </Tabs>
        </Box>

        {/* General Settings */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Site Configuration
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      label="Site Name"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange('siteName', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Site Description"
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <TextField
                      label="Admin Email"
                      value={settings.adminEmail}
                      onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Timezone"
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      fullWidth
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Preferences
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Maintenance Mode" 
                        secondary="Enable to take the site offline for maintenance"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.maintenanceMode}
                          onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="User Registration" 
                        secondary="Allow new users to register accounts"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.registrationEnabled}
                          onChange={(e) => handleSettingChange('registrationEnabled', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Guest Checkout" 
                        secondary="Allow customers to checkout without creating an account"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.guestCheckout}
                          onChange={(e) => handleSettingChange('guestCheckout', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Auto-approve Vendors" 
                        secondary="Automatically approve new vendor applications"
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={settings.autoApproveVendors}
                          onChange={(e) => handleSettingChange('autoApproveVendors', e.target.checked)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive notifications via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="SMS Notifications" 
                    secondary="Receive notifications via SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Order Notifications" 
                    secondary="Get notified when new orders are placed"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.orderNotifications}
                      onChange={(e) => handleSettingChange('orderNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Vendor Notifications" 
                    secondary="Get notified about vendor activities"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.vendorNotifications}
                      onChange={(e) => handleSettingChange('vendorNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Password Settings
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                    />
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                    />
                    <Button variant="outlined" color="primary">
                      Update Password
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Options
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Two-Factor Authentication" 
                        secondary="Add an extra layer of security to your account"
                      />
                      <ListItemSecondaryAction>
                        <Button variant="outlined" size="small">
                          Enable
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Login Alerts" 
                        secondary="Get notified of new login attempts"
                      />
                      <ListItemSecondaryAction>
                        <Switch defaultChecked />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Session Timeout" 
                        secondary="Automatically log out after 30 minutes of inactivity"
                      />
                      <ListItemSecondaryAction>
                        <Switch defaultChecked />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Payment Settings */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Configuration
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure payment gateways and commission settings for your marketplace.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Default Commission Rate (%)"
                    type="number"
                    defaultValue="5"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Payment Processing Fee (%)"
                    type="number"
                    defaultValue="2.9"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Payment Gateways
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText primary="Stripe" secondary="Credit card processing" />
                        <ListItemSecondaryAction>
                          <Button variant="outlined" size="small">
                            Configure
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText primary="PayPal" secondary="PayPal payment processing" />
                        <ListItemSecondaryAction>
                          <Button variant="outlined" size="small">
                            Configure
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
    </Box>
      </AdminLayout>
    </RouteGuard>
  );
};

export default Settings;