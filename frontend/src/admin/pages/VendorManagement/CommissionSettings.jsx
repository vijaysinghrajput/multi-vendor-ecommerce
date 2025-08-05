import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  InputAdornment,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Save,
  Cancel,
  Percent,
  TrendingUp,
  Store,
  AttachMoney,
  Info,
  Warning
} from '@mui/icons-material';

const CommissionSettings = () => {
  const [globalSettings, setGlobalSettings] = useState({
    defaultCommission: 10.0,
    minimumCommission: 5.0,
    maximumCommission: 25.0,
    autoApplyToNewVendors: true,
    tieredCommissionEnabled: false
  });

  const [editDialog, setEditDialog] = useState({ open: false, vendor: null, isNew: false });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vendor: null });
  const [tempCommission, setTempCommission] = useState('');
  const [tempCategory, setTempCategory] = useState('');
  const [tempVendor, setTempVendor] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Mock vendor commission data
  const [vendorCommissions, setVendorCommissions] = useState([
    {
      id: 1,
      vendorName: 'TechStore Pro',
      vendorEmail: 'contact@techstorepro.com',
      category: 'Electronics',
      commission: 8.5,
      customRate: true,
      revenue: 45230.50,
      orders: 1247,
      effectiveDate: '2023-06-15'
    },
    {
      id: 2,
      vendorName: 'Fashion Hub',
      vendorEmail: 'info@fashionhub.com',
      category: 'Fashion',
      commission: 12.0,
      customRate: true,
      revenue: 38950.25,
      orders: 892,
      effectiveDate: '2023-07-01'
    },
    {
      id: 3,
      vendorName: 'Home Essentials',
      vendorEmail: 'support@homeessentials.com',
      category: 'Home & Garden',
      commission: 10.0,
      customRate: false,
      revenue: 32100.75,
      orders: 567,
      effectiveDate: '2023-03-10'
    },
    {
      id: 4,
      vendorName: 'Beauty Corner',
      vendorEmail: 'hello@beautycorner.com',
      category: 'Beauty',
      commission: 15.0,
      customRate: true,
      revenue: 28750.00,
      orders: 445,
      effectiveDate: '2023-08-20'
    },
    {
      id: 5,
      vendorName: 'Sports Gear',
      vendorEmail: 'team@sportsgear.com',
      category: 'Sports',
      commission: 10.0,
      customRate: false,
      revenue: 25600.30,
      orders: 334,
      effectiveDate: '2023-05-12'
    }
  ]);

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports', 'Books'];
  const availableVendors = [
    'Digital World',
    'Book Haven',
    'Artisan Crafts',
    'Organic Foods'
  ];

  const handleGlobalSettingChange = (field, value) => {
    setGlobalSettings(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveGlobalSettings = () => {
    // API call to save global settings
    console.log('Saving global settings:', globalSettings);
    setUnsavedChanges(false);
  };

  const handleEditVendor = (vendor) => {
    setEditDialog({ open: true, vendor, isNew: false });
    setTempCommission(vendor.commission.toString());
    setTempCategory(vendor.category);
  };

  const handleAddVendor = () => {
    setEditDialog({ open: true, vendor: null, isNew: true });
    setTempCommission('');
    setTempCategory('');
    setTempVendor('');
  };

  const handleSaveVendorCommission = () => {
    const commission = parseFloat(tempCommission);
    
    if (commission < globalSettings.minimumCommission || commission > globalSettings.maximumCommission) {
      alert(`Commission must be between ${globalSettings.minimumCommission}% and ${globalSettings.maximumCommission}%`);
      return;
    }

    if (editDialog.isNew) {
      // Add new vendor commission
      const newVendorCommission = {
        id: vendorCommissions.length + 1,
        vendorName: tempVendor,
        vendorEmail: `contact@${tempVendor.toLowerCase().replace(/\s+/g, '')}.com`,
        category: tempCategory,
        commission: commission,
        customRate: true,
        revenue: 0,
        orders: 0,
        effectiveDate: new Date().toISOString().split('T')[0]
      };
      setVendorCommissions(prev => [...prev, newVendorCommission]);
    } else {
      // Update existing vendor commission
      setVendorCommissions(prev => 
        prev.map(v => 
          v.id === editDialog.vendor.id 
            ? { ...v, commission, customRate: true, category: tempCategory }
            : v
        )
      );
    }
    
    setEditDialog({ open: false, vendor: null, isNew: false });
  };

  const handleDeleteVendor = (vendor) => {
    setDeleteDialog({ open: true, vendor });
  };

  const confirmDeleteVendor = () => {
    setVendorCommissions(prev => prev.filter(v => v.id !== deleteDialog.vendor.id));
    setDeleteDialog({ open: false, vendor: null });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateCommissionEarned = (revenue, commission) => {
    return (revenue * commission) / 100;
  };

  const totalCommissionEarned = vendorCommissions.reduce(
    (sum, vendor) => sum + calculateCommissionEarned(vendor.revenue, vendor.commission), 
    0
  );

  const averageCommissionRate = vendorCommissions.length > 0 
    ? vendorCommissions.reduce((sum, vendor) => sum + vendor.commission, 0) / vendorCommissions.length
    : 0;

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Commission Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage global commission rates and vendor-specific overrides
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Percent />
                </Avatar>
                <Box>
                  <Typography variant="h6">{globalSettings.defaultCommission}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Default Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">{formatCurrency(totalCommissionEarned)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Earned
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">{averageCommissionRate.toFixed(1)}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <Store />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {vendorCommissions.filter(v => v.customRate).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Custom Rates
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Global Settings */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Global Commission Settings</Typography>
            {unsavedChanges && (
              <Alert severity="warning" sx={{ py: 0 }}>
                You have unsaved changes
              </Alert>
            )}
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Default Commission Rate"
                type="number"
                value={globalSettings.defaultCommission}
                onChange={(e) => handleGlobalSettingChange('defaultCommission', parseFloat(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                helperText="Applied to new vendors by default"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Minimum Commission"
                type="number"
                value={globalSettings.minimumCommission}
                onChange={(e) => handleGlobalSettingChange('minimumCommission', parseFloat(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Maximum Commission"
                type="number"
                value={globalSettings.maximumCommission}
                onChange={(e) => handleGlobalSettingChange('maximumCommission', parseFloat(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={globalSettings.autoApplyToNewVendors}
                    onChange={(e) => handleGlobalSettingChange('autoApplyToNewVendors', e.target.checked)}
                  />
                }
                label="Auto-apply default rate to new vendors"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={globalSettings.tieredCommissionEnabled}
                    onChange={(e) => handleGlobalSettingChange('tieredCommissionEnabled', e.target.checked)}
                  />
                }
                label="Enable tiered commission rates"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveGlobalSettings}
              disabled={!unsavedChanges}
            >
              Save Global Settings
            </Button>
            <Button
              variant="outlined"
              startIcon={<Cancel />}
              onClick={() => {
                // Reset to original values
                setUnsavedChanges(false);
              }}
              disabled={!unsavedChanges}
            >
              Cancel Changes
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Vendor-Specific Commissions */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Vendor-Specific Commission Rates</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddVendor}
            >
              Add Custom Rate
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Commission Rate</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Commission Earned</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorCommissions.map((vendor) => (
                  <TableRow key={vendor.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 32, height: 32 }}>
                          {vendor.vendorName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {vendor.vendorName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {vendor.vendorEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{vendor.category}</TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2" color="primary">
                        {vendor.commission}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(vendor.revenue)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" color="success.main">
                        {formatCurrency(calculateCommissionEarned(vendor.revenue, vendor.commission))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={vendor.customRate ? 'Custom' : 'Default'}
                        color={vendor.customRate ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Commission">
                        <IconButton
                          onClick={() => handleEditVendor(vendor)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      {vendor.customRate && (
                        <Tooltip title="Remove Custom Rate">
                          <IconButton
                            onClick={() => handleDeleteVendor(vendor)}
                            size="small"
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Edit/Add Vendor Commission Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, vendor: null, isNew: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editDialog.isNew ? 'Add Custom Commission Rate' : 'Edit Commission Rate'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {editDialog.isNew && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Vendor</InputLabel>
                <Select
                  value={tempVendor}
                  label="Select Vendor"
                  onChange={(e) => setTempVendor(e.target.value)}
                >
                  {availableVendors.map(vendor => (
                    <MenuItem key={vendor} value={vendor}>
                      {vendor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={tempCategory}
                label="Category"
                onChange={(e) => setTempCategory(e.target.value)}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Commission Rate"
              type="number"
              value={tempCommission}
              onChange={(e) => setTempCommission(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              helperText={`Must be between ${globalSettings.minimumCommission}% and ${globalSettings.maximumCommission}%`}
            />
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1 }} />
                This will override the default commission rate for this vendor.
              </Box>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, vendor: null, isNew: false })}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveVendorCommission}
            variant="contained"
            disabled={!tempCommission || (editDialog.isNew && !tempVendor) || !tempCategory}
          >
            {editDialog.isNew ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, vendor: null })}
      >
        <DialogTitle>Remove Custom Commission Rate</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove the custom commission rate for "{deleteDialog.vendor?.vendorName}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This vendor will revert to the default commission rate of {globalSettings.defaultCommission}%.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, vendor: null })}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteVendor} variant="contained" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionSettings;