import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Collapse
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  Business,
  Email,
  Phone,
  LocationOn,
  Category,
  Description,
  AttachFile,
  CalendarToday
} from '@mui/icons-material';

const VendorApplications = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: '', application: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');

  // Mock application data
  const applications = [
    {
      id: 1,
      businessName: 'Digital World Electronics',
      ownerName: 'Michael Chen',
      email: 'michael@digitalworld.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, Silicon Valley, CA 94025',
      category: 'Electronics',
      description: 'We specialize in cutting-edge consumer electronics, smartphones, laptops, and smart home devices. Our mission is to bring the latest technology to everyday consumers.',
      documents: [
        { name: 'Business License', type: 'PDF', size: '2.3 MB' },
        { name: 'Tax Certificate', type: 'PDF', size: '1.8 MB' },
        { name: 'Bank Statement', type: 'PDF', size: '3.1 MB' }
      ],
      submittedDate: '2024-01-10',
      status: 'pending',
      expectedProducts: 150,
      businessType: 'LLC',
      website: 'https://digitalworld.com'
    },
    {
      id: 2,
      businessName: 'Artisan Crafts Co.',
      ownerName: 'Sarah Johnson',
      email: 'sarah@artisancrafts.com',
      phone: '+1 (555) 987-6543',
      address: '456 Craft Lane, Portland, OR 97201',
      category: 'Handmade & Crafts',
      description: 'Handcrafted items made with love and attention to detail. We create unique home decor, jewelry, and personalized gifts using sustainable materials.',
      documents: [
        { name: 'Business Registration', type: 'PDF', size: '1.9 MB' },
        { name: 'Insurance Certificate', type: 'PDF', size: '2.2 MB' }
      ],
      submittedDate: '2024-01-12',
      status: 'pending',
      expectedProducts: 75,
      businessType: 'Sole Proprietorship',
      website: 'https://artisancrafts.com'
    },
    {
      id: 3,
      businessName: 'Organic Foods Market',
      ownerName: 'David Rodriguez',
      email: 'david@organicfoods.com',
      phone: '+1 (555) 456-7890',
      address: '789 Green Street, Austin, TX 78701',
      category: 'Food & Beverages',
      description: 'Certified organic foods, fresh produce, and health supplements. We partner with local farmers to provide the freshest organic products.',
      documents: [
        { name: 'Organic Certification', type: 'PDF', size: '2.7 MB' },
        { name: 'Food Safety License', type: 'PDF', size: '1.5 MB' },
        { name: 'Business License', type: 'PDF', size: '2.1 MB' }
      ],
      submittedDate: '2024-01-08',
      status: 'under_review',
      expectedProducts: 200,
      businessType: 'Corporation',
      website: 'https://organicfoods.com'
    },
    {
      id: 4,
      businessName: 'Fashion Forward',
      ownerName: 'Emma Wilson',
      email: 'emma@fashionforward.com',
      phone: '+1 (555) 321-0987',
      address: '321 Style Avenue, New York, NY 10001',
      category: 'Fashion',
      description: 'Contemporary fashion for modern professionals. We offer high-quality clothing that combines style, comfort, and sustainability.',
      documents: [
        { name: 'Business License', type: 'PDF', size: '2.0 MB' },
        { name: 'Brand Trademark', type: 'PDF', size: '1.7 MB' }
      ],
      submittedDate: '2024-01-14',
      status: 'approved',
      expectedProducts: 120,
      businessType: 'LLC',
      website: 'https://fashionforward.com'
    },
    {
      id: 5,
      businessName: 'Home Comfort Solutions',
      ownerName: 'Robert Kim',
      email: 'robert@homecomfort.com',
      phone: '+1 (555) 654-3210',
      address: '654 Comfort Drive, Denver, CO 80202',
      category: 'Home & Garden',
      description: 'Premium home improvement products and furniture. We help customers create comfortable and beautiful living spaces.',
      documents: [
        { name: 'Business Registration', type: 'PDF', size: '2.4 MB' }
      ],
      submittedDate: '2024-01-06',
      status: 'rejected',
      expectedProducts: 180,
      businessType: 'Partnership',
      website: 'https://homecomfort.com',
      rejectionReason: 'Incomplete documentation - missing tax certificate and insurance proof'
    }
  ];

  const statusOptions = ['all', 'pending', 'under_review', 'approved', 'rejected'];

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

  const handleExpandClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleActionClick = (type, application) => {
    setActionDialog({ open: true, type, application });
    setRejectionReason('');
  };

  const handleActionConfirm = () => {
    const { type, application } = actionDialog;
    
    if (type === 'approve') {
      console.log('Approving application:', application.id);
      // API call to approve
    } else if (type === 'reject') {
      console.log('Rejecting application:', application.id, 'Reason:', rejectionReason);
      // API call to reject with reason
    }
    
    setActionDialog({ open: false, type: '', application: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under_review': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vendor Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage vendor applications for your platform
        </Typography>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {applications.filter(app => app.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {applications.filter(app => app.status === 'under_review').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Under Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {applications.filter(app => app.status === 'approved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {applications.filter(app => app.status === 'rejected').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Filter by Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>
                      {status === 'all' ? 'All Applications' : getStatusLabel(status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredApplications.length} of {applications.length} applications
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Grid container spacing={3}>
        {filteredApplications.map((application) => (
          <Grid item xs={12} key={application.id}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {application.businessName.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                          {application.businessName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          by {application.ownerName}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusLabel(application.status)}
                        color={getStatusColor(application.status)}
                        size="small"
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{application.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{application.phone}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Category sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{application.category}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            Submitted: {formatDate(application.submittedDate)}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {application.description}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {application.status === 'pending' && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleActionClick('approve', application)}
                            fullWidth
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleActionClick('reject', application)}
                            fullWidth
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outlined"
                        onClick={() => handleExpandClick(application.id)}
                        endIcon={expandedCard === application.id ? <ExpandLess /> : <ExpandMore />}
                        fullWidth
                      >
                        {expandedCard === application.id ? 'Show Less' : 'View Details'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

                <Collapse in={expandedCard === application.id} timeout="auto" unmountOnExit>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Business Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <Business sx={{ mr: 2, color: 'text.secondary' }} />
                          <ListItemText
                            primary="Business Type"
                            secondary={application.businessType}
                          />
                        </ListItem>
                        <ListItem>
                          <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                          <ListItemText
                            primary="Address"
                            secondary={application.address}
                          />
                        </ListItem>
                        <ListItem>
                          <Description sx={{ mr: 2, color: 'text.secondary' }} />
                          <ListItemText
                            primary="Expected Products"
                            secondary={`${application.expectedProducts} products`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Documents Submitted
                      </Typography>
                      <List dense>
                        {application.documents.map((doc, index) => (
                          <ListItem key={index}>
                            <AttachFile sx={{ mr: 2, color: 'text.secondary' }} />
                            <ListItemText
                              primary={doc.name}
                              secondary={`${doc.type} • ${doc.size}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      {application.status === 'rejected' && application.rejectionReason && (
                        <Paper sx={{ p: 2, mt: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Rejection Reason:
                          </Typography>
                          <Typography variant="body2">
                            {application.rejectionReason}
                          </Typography>
                        </Paper>
                      )}
                    </Grid>
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onClose={() => setActionDialog({ open: false, type: '', application: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionDialog.type === 'approve' ? 'Approve Application' : 'Reject Application'}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to {actionDialog.type} the application from "{actionDialog.application?.businessName}"?
          </Typography>
          
          {actionDialog.type === 'reject' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Rejection Reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              sx={{ mt: 2 }}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, type: '', application: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            color={actionDialog.type === 'approve' ? 'success' : 'error'}
            disabled={actionDialog.type === 'reject' && !rejectionReason.trim()}
          >
            {actionDialog.type === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorApplications;