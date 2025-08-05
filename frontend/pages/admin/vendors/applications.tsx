import React, { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import RouteGuard from '../../../components/RouteGuard';
import AdminDashboardLayout from '../../../layouts/AdminDashboardLayout';
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
  Avatar,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuList,
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  TextareaAutosize,
  styled
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  CheckCircle,
  Cancel,
  Visibility,
  Store,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Business,
  Language,
  Description,
  AttachFile,
  Download,
  Verified,
  Warning,
  Error,
  Schedule
} from '@mui/icons-material';
import vendorsData from '../../../data/vendors.json';

interface VendorApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  category: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website?: string;
  description: string;
  documents: {
    businessLicense?: string;
    taxCertificate?: string;
    bankDetails?: string;
    identityProof?: string;
  };
  appliedDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  minRows: 3,
  padding: '12px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  fontFamily: theme.typography.fontFamily,
  fontSize: '14px',
  resize: 'vertical',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
  },
}));

const AdminVendorApplications: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Generate vendor applications from existing vendor data
  const [applications, setApplications] = useState<VendorApplication[]>(() => {
    return vendorsData.map((vendor, index) => ({
      id: vendor.id,
      businessName: vendor.businessName || vendor.displayName,
      ownerName: `Owner ${index + 1}`,
      email: vendor.contact?.email || `vendor${index}@example.com`,
      phone: vendor.contact?.phone || '+91 9876543210',
      businessType: ['Sole Proprietorship', 'Partnership', 'Private Limited', 'LLP'][Math.floor(Math.random() * 4)],
      category: vendor.categories?.[0] || 'General',
      address: '123 Business Street',
      city: vendor.location?.city || 'Mumbai',
      state: vendor.location?.state || 'Maharashtra',
      pincode: '400001',
      website: vendor.socialLinks?.website,
      description: vendor.description || 'A growing business looking to expand online presence.',
      documents: {
        businessLicense: 'business_license.pdf',
        taxCertificate: 'tax_certificate.pdf',
        bankDetails: 'bank_details.pdf',
        identityProof: 'identity_proof.pdf'
      },
      appliedDate: vendor.joinedDate || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: vendor.isVerified ? 'approved' : ['pending', 'under_review', 'rejected'][Math.floor(Math.random() * 3)] as any,
      reviewNotes: vendor.isVerified ? 'All documents verified successfully.' : undefined,
      reviewedBy: vendor.isVerified ? 'Admin User' : undefined,
      reviewedDate: vendor.isVerified ? new Date().toISOString() : undefined
    }));
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuApplication, setActionMenuApplication] = useState<VendorApplication | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [reviewNotes, setReviewNotes] = useState('');
  
  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = applications.filter(application => {
      const matchesSearch = application.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           application.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           application.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || application.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof VendorApplication];
      let bValue = b[sortBy as keyof VendorApplication];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [applications, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);
  
  // Get unique categories
  const categories = Array.from(new Set(applications.map(a => a.category)));
  
  // Status counts for tabs
  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };
  
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, application: VendorApplication) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuApplication(application);
  };
  
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuApplication(null);
  };
  
  const handleViewDetails = (application: VendorApplication) => {
    setSelectedApplication(application);
    setDetailsDialogOpen(true);
    handleActionMenuClose();
  };
  
  const handleStartReview = (application: VendorApplication) => {
    setSelectedApplication(application);
    setReviewNotes(application.reviewNotes || '');
    setReviewDialogOpen(true);
    handleActionMenuClose();
  };
  
  const handleStatusChange = (applicationId: string, newStatus: 'pending' | 'under_review' | 'approved' | 'rejected', notes?: string) => {
    setApplications(prev => prev.map(application => 
      application.id === applicationId ? { 
        ...application, 
        status: newStatus,
        reviewNotes: notes,
        reviewedBy: 'Admin User',
        reviewedDate: new Date().toISOString()
      } : application
    ));
    setReviewDialogOpen(false);
    setReviewNotes('');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under_review': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Schedule />;
      case 'under_review': return <Visibility />;
      case 'approved': return <CheckCircle />;
      case 'rejected': return <Cancel />;
      default: return <Schedule />;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <RouteGuard requiredRole="admin">
      <AdminDashboardLayout>
        <Head>
          <title>Vendor Applications - Admin Dashboard</title>
          <meta name="description" content="Manage vendor applications in the admin dashboard" />
        </Head>
        
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Vendor Applications
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and manage vendor registration applications
              </Typography>
            </Box>
          </Box>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Pending Review
                      </Typography>
                      <Typography variant="h4">
                        {statusCounts.pending}
                      </Typography>
                    </Box>
                    <Schedule sx={{ fontSize: 40, color: 'warning.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Under Review
                      </Typography>
                      <Typography variant="h4">
                        {statusCounts.under_review}
                      </Typography>
                    </Box>
                    <Visibility sx={{ fontSize: 40, color: 'info.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Approved
                      </Typography>
                      <Typography variant="h4">
                        {statusCounts.approved}
                      </Typography>
                    </Box>
                    <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Rejected
                      </Typography>
                      <Typography variant="h4">
                        {statusCounts.rejected}
                      </Typography>
                    </Box>
                    <Cancel sx={{ fontSize: 40, color: 'error.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Filters and Search */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="under_review">Under Review</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      label="Category"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      label="Sort By"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="appliedDate">Applied Date</MenuItem>
                      <MenuItem value="businessName">Business Name</MenuItem>
                      <MenuItem value="status">Status</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    fullWidth
                  >
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* Applications Table */}
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Business</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Applied Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplications
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((application) => (
                        <TableRow key={application.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar>
                                <Store />
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {application.businessName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {application.businessType}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {application.ownerName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email sx={{ fontSize: 16 }} />
                                {application.email}
                              </Typography>
                              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Phone sx={{ fontSize: 16 }} />
                                {application.phone}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={application.category}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(application.appliedDate)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(application.status)}
                              label={application.status.replace('_', ' ')}
                              color={getStatusColor(application.status) as any}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={(e) => handleActionMenuOpen(e, application)}
                              size="small"
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredApplications.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </CardContent>
          </Card>
        </Container>
        
        {/* Action Menu */}
        <Menu
          anchorEl={actionMenuAnchor}
          open={Boolean(actionMenuAnchor)}
          onClose={handleActionMenuClose}
        >
          <MenuItemComponent onClick={() => actionMenuApplication && handleViewDetails(actionMenuApplication)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItemComponent>
          <MenuItemComponent onClick={() => actionMenuApplication && handleStartReview(actionMenuApplication)}>
            <ListItemIcon>
              <Description fontSize="small" />
            </ListItemIcon>
            <ListItemText>Review Application</ListItemText>
          </MenuItemComponent>
          {actionMenuApplication?.status === 'pending' && (
            <MenuItemComponent onClick={() => actionMenuApplication && handleStatusChange(actionMenuApplication.id, 'under_review')}>
              <ListItemIcon>
                <Visibility fontSize="small" />
              </ListItemIcon>
              <ListItemText>Start Review</ListItemText>
            </MenuItemComponent>
          )}
        </Menu>
        
        {/* Application Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Vendor Application Details
          </DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Business Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Business Name"
                        secondary={selectedApplication.businessName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Owner Name"
                        secondary={selectedApplication.ownerName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Business Type"
                        secondary={selectedApplication.businessType}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Category"
                        secondary={selectedApplication.category}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Description"
                        secondary={selectedApplication.description}
                      />
                    </ListItem>
                    {selectedApplication.website && (
                      <ListItem>
                        <ListItemText
                          primary="Website"
                          secondary={selectedApplication.website}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Contact & Address
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={selectedApplication.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedApplication.phone}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Address"
                        secondary={`${selectedApplication.address}, ${selectedApplication.city}, ${selectedApplication.state} - ${selectedApplication.pincode}`}
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Documents
                  </Typography>
                  <List>
                    {Object.entries(selectedApplication.documents).map(([key, value]) => (
                      value && (
                        <ListItem key={key}>
                          <ListItemIcon>
                            <AttachFile />
                          </ListItemIcon>
                          <ListItemText
                            primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            secondary={value}
                          />
                          <IconButton size="small">
                            <Download />
                          </IconButton>
                        </ListItem>
                      )
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Application Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      icon={getStatusIcon(selectedApplication.status)}
                      label={selectedApplication.status.replace('_', ' ')}
                      color={getStatusColor(selectedApplication.status) as any}
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Applied on {formatDate(selectedApplication.appliedDate)}
                    </Typography>
                  </Box>
                  {selectedApplication.reviewNotes && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Review Notes:</Typography>
                      <Typography variant="body2">{selectedApplication.reviewNotes}</Typography>
                      {selectedApplication.reviewedBy && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Reviewed by {selectedApplication.reviewedBy} on {selectedApplication.reviewedDate && formatDate(selectedApplication.reviewedDate)}
                        </Typography>
                      )}
                    </Alert>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
            {selectedApplication && selectedApplication.status !== 'approved' && selectedApplication.status !== 'rejected' && (
              <Button
                variant="contained"
                onClick={() => handleStartReview(selectedApplication)}
              >
                Review Application
              </Button>
            )}
          </DialogActions>
        </Dialog>
        
        {/* Review Dialog */}
        <Dialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Review Application
          </DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Box>
                <Typography variant="body1" gutterBottom>
                  Reviewing application for: <strong>{selectedApplication.businessName}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Owner: {selectedApplication.ownerName}
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Review Notes
                  </Typography>
                  <StyledTextarea
                    placeholder="Add your review notes here..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    minRows={4}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => selectedApplication && handleStatusChange(selectedApplication.id, 'rejected', reviewNotes)}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => selectedApplication && handleStatusChange(selectedApplication.id, 'approved', reviewNotes)}
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </AdminDashboardLayout>
    </RouteGuard>
  );
};

export default AdminVendorApplications;