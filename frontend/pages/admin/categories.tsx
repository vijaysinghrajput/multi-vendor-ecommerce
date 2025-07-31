import React, { useState, useMemo } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/lab';
import {
  Search,
  FilterList,
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Category,
  Image,
  CheckCircle,
  Warning,
  Error,
  Block,
  TrendingUp,
  TrendingDown,
  ExpandMore,
  GridView,
  ViewList,
  Sort,
  LocalOffer,
  Verified,
  Report,
  DragIndicator,
  KeyboardArrowRight,
  KeyboardArrowDown,
  Folder,
  FolderOpen,
  Label,
  Save,
  Cancel,
  Upload,
  ColorLens,
  Palette,
  Inventory
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import categoriesData from '../../data/categories.json';
import productsData from '../../data/products.json';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
  children?: Category[];
}

const AdminCategories: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Enhanced categories data with product counts and hierarchy
  const [categories, setCategories] = useState<Category[]>(() => {
    const enhancedCategories = categoriesData.map(category => {
      const productCount = productsData.filter(p => p.category === category.name).length;
      return {
        ...category,
        productCount,
        isActive: category.isActive !== false,
        sortOrder: category.sortOrder || 0,
        parentId: (category as any).parentId || undefined,
        createdAt: (category as any).createdAt || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: (category as any).updatedAt || new Date().toISOString(),
        color: (category as any).color || ['#1976d2', '#388e3c', '#f57c00', '#d32f2f', '#7b1fa2', '#0288d1'][Math.floor(Math.random() * 6)]
      };
    });
    
    // Build hierarchy
    const buildHierarchy = (cats: Category[]): Category[] => {
      const categoryMap = new Map<string, Category>(cats.map(cat => [cat.id, { ...cat, children: [] }]));
      const rootCategories: Category[] = [];
      
      cats.forEach(cat => {
        const category = categoryMap.get(cat.id)!;
        if (cat.parentId && categoryMap.has(cat.parentId)) {
          const parent = categoryMap.get(cat.parentId)!;
          parent.children!.push(category);
        } else {
          rootCategories.push(category);
        }
      });
      
      return rootCategories;
    };
    
    return buildHierarchy(enhancedCategories);
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuCategory, setActionMenuCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'tree'>('table');
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  
  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    color: '#1976d2',
    parentId: '',
    isActive: true,
    sortOrder: 0
  });
  
  // Flatten categories for table view
  const flattenCategories = (cats: Category[], level = 0): (Category & { level: number })[] => {
    let result: (Category & { level: number })[] = [];
    cats.forEach(cat => {
      result.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children, level + 1));
      }
    });
    return result;
  };
  
  const flatCategories = flattenCategories(categories);
  
  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let filtered = flatCategories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && category.isActive) ||
                          (statusFilter === 'inactive' && !category.isActive);
      
      return matchesSearch && matchesStatus;
    });
    
    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Category];
      let bValue = b[sortBy as keyof Category];
      
      // Handle undefined values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }, [flatCategories, searchTerm, statusFilter, sortBy, sortOrder]);
  
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuCategory(category);
  };
  
  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuCategory(null);
  };
  
  const handleStatusToggle = (categoryId: string) => {
    const updateCategoryStatus = (cats: Category[]): Category[] => {
      return cats.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, isActive: !cat.isActive, updatedAt: new Date().toISOString() };
        }
        if (cat.children) {
          return { ...cat, children: updateCategoryStatus(cat.children) };
        }
        return cat;
      });
    };
    
    setCategories(updateCategoryStatus(categories));
    handleActionMenuClose();
  };
  
  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category);
    setDetailsDialogOpen(true);
    handleActionMenuClose();
  };
  
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      icon: category.icon || '',
      color: category.color || '#1976d2',
      parentId: category.parentId || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder
    });
    setSelectedCategory(category);
    setEditDialogOpen(true);
    handleActionMenuClose();
  };
  
  const handleAdd = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      color: '#1976d2',
      parentId: '',
      isActive: true,
      sortOrder: 0
    });
    setSelectedCategory(null);
    setEditDialogOpen(true);
  };
  
  const handleSave = () => {
    if (selectedCategory) {
      // Edit existing category
      const updateCategory = (cats: Category[]): Category[] => {
        return cats.map(cat => {
          if (cat.id === selectedCategory.id) {
            return {
              ...cat,
              ...formData,
              updatedAt: new Date().toISOString()
            };
          }
          if (cat.children) {
            return { ...cat, children: updateCategory(cat.children) };
          }
          return cat;
        });
      };
      setCategories(updateCategory(categories));
    } else {
      // Add new category
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        ...formData,
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      };
      
      if (formData.parentId) {
        // Add as child
        const addToParent = (cats: Category[]): Category[] => {
          return cats.map(cat => {
            if (cat.id === formData.parentId) {
              return {
                ...cat,
                children: [...(cat.children || []), newCategory]
              };
            }
            if (cat.children) {
              return { ...cat, children: addToParent(cat.children) };
            }
            return cat;
          });
        };
        setCategories(addToParent(categories));
      } else {
        // Add as root category
        setCategories([...categories, newCategory]);
      }
    }
    setEditDialogOpen(false);
  };
  
  const handleDelete = (categoryId: string) => {
    const deleteCategory = (cats: Category[]): Category[] => {
      return cats.filter(cat => {
        if (cat.id === categoryId) {
          return false;
        }
        if (cat.children) {
          cat.children = deleteCategory(cat.children);
        }
        return true;
      });
    };
    
    setCategories(deleteCategory(categories));
    handleActionMenuClose();
  };
  
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };
  
  const renderTreeItem = (category: Category) => {
    return (
      <TreeItem
        key={category.id}
        nodeId={category.id}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
            <Avatar
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 2, 
                bgcolor: category.color,
                fontSize: '0.875rem'
              }}
            >
              {category.icon ? category.icon : category.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {category.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {category.productCount} products
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={category.isActive ? 'Active' : 'Inactive'}
                color={category.isActive ? 'success' : 'default'}
                size="small"
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionMenuOpen(e, category);
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        }
      >
        {category.children?.map(child => renderTreeItem(child))}
      </TreeItem>
    );
  };
  
  const renderCategoryCard = (category: Category & { level: number }) => {
    return (
      <Card key={category.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            sx={{
              height: 120,
              bgcolor: category.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: category.image ? `url(${category.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!category.image && (
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                {category.icon || category.name.charAt(0)}
              </Typography>
            )}
          </CardMedia>
          <Chip
            label={category.isActive ? 'Active' : 'Inactive'}
            color={category.isActive ? 'success' : 'default'}
            size="small"
            sx={{ position: 'absolute', top: 8, right: 8 }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }} noWrap>
            {category.name}
          </Typography>
          
          {category.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
              {category.description}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {category.productCount} Products
              </Typography>
              <Typography variant="caption" color="text.secondary">
                /{category.slug}
              </Typography>
            </Box>
            <IconButton
              onClick={(e) => handleActionMenuOpen(e, category)}
              size="small"
            >
              <MoreVert />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Layout>
      <Head>
        <title>Category Management - Admin Dashboard</title>
        <meta name="description" content="Manage product categories on the e-commerce platform" />
      </Head>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Category Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organize and manage product categories
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={viewMode === 'tree' ? <ViewList /> : viewMode === 'grid' ? <GridView /> : <Folder />}
              onClick={() => {
                const modes = ['table', 'grid', 'tree'];
                const currentIndex = modes.indexOf(viewMode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                setViewMode(nextMode as any);
              }}
            >
              {viewMode === 'tree' ? 'Table' : viewMode === 'grid' ? 'Tree' : 'Grid'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
            >
              Add Category
            </Button>
          </Box>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <Category />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {flatCategories.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Categories
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
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {flatCategories.filter(c => c.isActive).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Categories
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
                    <Inventory />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {flatCategories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Products
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
                    <FolderOpen />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {categories.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Root Categories
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="productCount">Product Count</MenuItem>
                  <MenuItem value="createdAt">Date Created</MenuItem>
                  <MenuItem value="sortOrder">Sort Order</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Categories Display */}
        {viewMode === 'tree' ? (
          <Paper sx={{ p: 3 }}>
            <TreeView
              defaultCollapseIcon={<KeyboardArrowDown />}
              defaultExpandIcon={<KeyboardArrowRight />}
              expanded={expandedNodes}
              onNodeToggle={(event: React.SyntheticEvent, nodeIds: string[]) => setExpandedNodes(nodeIds)}
            >
              {categories.map(category => renderTreeItem(category))}
            </TreeView>
          </Paper>
        ) : viewMode === 'grid' ? (
          <>
            <Grid container spacing={3}>
              {filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                  {renderCategoryCard(category)}
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <TablePagination
                rowsPerPageOptions={[8, 12, 24, 48]}
                component="div"
                count={filteredCategories.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </Box>
          </>
        ) : (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((category) => (
                      <TableRow key={category.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                              {'  '.repeat(category.level)}
                              <Avatar
                                sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  bgcolor: category.color,
                                  fontSize: '0.875rem'
                                }}
                              >
                                {category.icon || category.name.charAt(0)}
                              </Avatar>
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {category.name}
                              </Typography>
                              {category.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {category.description}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            /{category.slug}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${category.productCount} products`}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={category.isActive ? 'Active' : 'Inactive'}
                            color={category.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleActionMenuOpen(e, category)}
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
              count={filteredCategories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        )}
      </Container>
      
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAdd}
      >
        <Add />
      </Fab>
      
      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItemComponent onClick={() => actionMenuCategory && handleViewDetails(actionMenuCategory)}>
          <ListItemIcon><Visibility /></ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => actionMenuCategory && handleEdit(actionMenuCategory)}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText>Edit Category</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => actionMenuCategory && handleStatusToggle(actionMenuCategory.id)}>
          <ListItemIcon>{actionMenuCategory?.isActive ? <VisibilityOff /> : <Visibility />}</ListItemIcon>
          <ListItemText>{actionMenuCategory?.isActive ? 'Deactivate' : 'Activate'}</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => actionMenuCategory && handleDelete(actionMenuCategory.id)}>
          <ListItemIcon><Delete /></ListItemIcon>
          <ListItemText>Delete Category</ListItemText>
        </MenuItemComponent>
      </Menu>
      
      {/* Add/Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name)
                  });
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">/</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Icon (Emoji or Text)"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📱 or 📷"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ColorLens />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parentId}
                  label="Parent Category"
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                >
                  <MenuItem value="">None (Root Category)</MenuItem>
                  {flatCategories
                    .filter(cat => cat.id !== selectedCategory?.id)
                    .map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {'  '.repeat(cat.level)}{cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} startIcon={<Save />}>
            {selectedCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedCategory && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ 
                    width: 56, 
                    height: 56, 
                    mr: 2, 
                    bgcolor: selectedCategory.color,
                    fontSize: '1.5rem'
                  }}
                >
                  {selectedCategory.icon || selectedCategory.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedCategory.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    /{selectedCategory.slug}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Category Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Name:</strong> {selectedCategory.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Slug:</strong> /{selectedCategory.slug}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Status:</strong> 
                      <Chip
                        label={selectedCategory.isActive ? 'Active' : 'Inactive'}
                        color={selectedCategory.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Products:</strong> {selectedCategory.productCount}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Sort Order:</strong> {selectedCategory.sortOrder}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Visual Elements
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        <strong>Color:</strong>
                      </Typography>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: selectedCategory.color,
                          borderRadius: 1,
                          border: 1,
                          borderColor: 'divider',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedCategory.color}
                      </Typography>
                    </Box>
                    {selectedCategory.icon && (
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Icon:</strong> {selectedCategory.icon}
                      </Typography>
                    )}
                    {selectedCategory.image && (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Image:</strong>
                        </Typography>
                        <Box
                          component="img"
                          src={selectedCategory.image}
                          alt={selectedCategory.name}
                          sx={{
                            width: '100%',
                            maxWidth: 200,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'divider'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
                {selectedCategory.description && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body2">
                      {selectedCategory.description}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Timestamps
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Created:</strong> {selectedCategory.createdAt ? new Date(selectedCategory.createdAt).toLocaleString() : 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Updated:</strong> {selectedCategory.updatedAt ? new Date(selectedCategory.updatedAt).toLocaleString() : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
              <Button variant="outlined" startIcon={<Edit />} onClick={() => {
                setDetailsDialogOpen(false);
                handleEdit(selectedCategory);
              }}>
                Edit Category
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Layout>
  );
};

export default AdminCategories;