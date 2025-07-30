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
  Chip,
  IconButton,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  FormControlLabel,
  Switch,
  InputAdornment,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Add,
  Remove,
  Save,
  Preview,
  ArrowBack,
  PhotoCamera,
  Inventory,
  LocalOffer,
  Description,
  Category,
  AttachMoney,
  Star,
  Visibility,
  Edit,
  Check
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import categoriesData from '../../data/categories.json';

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

const AddProduct: NextPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    subcategory: '',
    brand: '',
    price: '',
    originalPrice: '',
    discount: '',
    sku: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    tags: [] as string[],
    features: [] as string[],
    specifications: [] as { key: string; value: string }[],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    isActive: true,
    isFeatured: false,
    allowReviews: true,
    trackInventory: true,
    stock: '',
    lowStockThreshold: '5'
  });
  
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');
  const [currentSpec, setCurrentSpec] = useState({ key: '', value: '' });
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const steps = [
    {
      label: 'Basic Information',
      description: 'Product title, description, and category',
      icon: <Description />
    },
    {
      label: 'Pricing & Inventory',
      description: 'Set pricing and manage stock',
      icon: <AttachMoney />
    },
    {
      label: 'Images & Media',
      description: 'Upload product images',
      icon: <PhotoCamera />
    },
    {
      label: 'Details & Specifications',
      description: 'Add features and specifications',
      icon: <Inventory />
    },
    {
      label: 'SEO & Settings',
      description: 'SEO optimization and final settings',
      icon: <Star />
    }
  ];
  
  const subcategories: Record<string, string[]> = {
    'Electronics': ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Audio', 'Gaming'],
    'Fashion': ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry'],
    'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Garden Tools'],
    'Sports': ['Fitness Equipment', 'Outdoor Gear', 'Team Sports', 'Water Sports'],
    'Books': ['Fiction', 'Non-Fiction', 'Educational', 'Children\'s Books'],
    'Beauty': ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Tools']
  };
  
  const handleInputChange = (field: string, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleDimensionChange = (dimension: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [dimension]: value }
    }));
  };
  
  const handleAddTag = () => {
    if (currentTag.trim() && !productData.tags.includes(currentTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleAddFeature = () => {
    if (currentFeature.trim() && !productData.features.includes(currentFeature.trim())) {
      setProductData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };
  
  const handleRemoveFeature = (featureToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };
  
  const handleAddSpecification = () => {
    if (currentSpec.key.trim() && currentSpec.value.trim()) {
      setProductData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { ...currentSpec }]
      }));
      setCurrentSpec({ key: '', value: '' });
    }
  };
  
  const handleRemoveSpecification = (index: number) => {
    setProductData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: ProductImage = {
            id: `img_${Date.now()}_${index}`,
            url: e.target?.result as string,
            alt: productData.title || 'Product image',
            isPrimary: images.length === 0 && index === 0
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleSetPrimaryImage = (imageId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    })));
  };
  
  const handleRemoveImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // If we removed the primary image, set the first remaining as primary
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };
  
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 0:
        if (!productData.title.trim()) newErrors.title = 'Product title is required';
        if (!productData.description.trim()) newErrors.description = 'Product description is required';
        if (!productData.category) newErrors.category = 'Category is required';
        break;
      case 1:
        if (!productData.price || parseFloat(productData.price) <= 0) {
          newErrors.price = 'Valid price is required';
        }
        if (productData.trackInventory && (!productData.stock || parseInt(productData.stock) < 0)) {
          newErrors.stock = 'Stock quantity is required';
        }
        break;
      case 2:
        if (images.length === 0) {
          newErrors.images = 'At least one product image is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  const handleSaveProduct = () => {
    if (validateStep(activeStep)) {
      // Here you would typically save to backend
      console.log('Saving product:', { ...productData, images, variants });
      alert('Product saved successfully!');
    }
  };
  
  const renderBasicInformation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Product Title"
          value={productData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          placeholder="Enter a descriptive product title"
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select
            value={productData.category}
            label="Category"
            onChange={(e) => {
              handleInputChange('category', e.target.value);
              handleInputChange('subcategory', ''); // Reset subcategory
            }}
          >
            {categoriesData.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
              {errors.category}
            </Typography>
          )}
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth disabled={!productData.category}>
          <InputLabel>Subcategory</InputLabel>
          <Select
            value={productData.subcategory}
            label="Subcategory"
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
          >
            {productData.category && subcategories[productData.category]?.map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Brand"
          value={productData.brand}
          onChange={(e) => handleInputChange('brand', e.target.value)}
          placeholder="Enter brand name"
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="SKU (Stock Keeping Unit)"
          value={productData.sku}
          onChange={(e) => handleInputChange('sku', e.target.value)}
          placeholder="Enter unique SKU"
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Short Description"
          value={productData.shortDescription}
          onChange={(e) => handleInputChange('shortDescription', e.target.value)}
          placeholder="Brief product summary (max 160 characters)"
          inputProps={{ maxLength: 160 }}
          helperText={`${productData.shortDescription.length}/160 characters`}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Product Description"
          value={productData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={!!errors.description}
          helperText={errors.description || 'Provide detailed product information'}
          placeholder="Describe your product in detail..."
        />
      </Grid>
    </Grid>
  );
  
  const renderPricingInventory = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Selling Price"
          value={productData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          error={!!errors.price}
          helperText={errors.price}
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Original Price (Optional)"
          value={productData.originalPrice}
          onChange={(e) => handleInputChange('originalPrice', e.target.value)}
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">₹</InputAdornment>
          }}
          helperText="For showing discounts"
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Discount %"
          value={productData.discount}
          onChange={(e) => handleInputChange('discount', e.target.value)}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>
          }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={productData.trackInventory}
              onChange={(e) => handleInputChange('trackInventory', e.target.checked)}
            />
          }
          label="Track Inventory"
        />
      </Grid>
      
      {productData.trackInventory && (
        <>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Stock Quantity"
              value={productData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              error={!!errors.stock}
              helperText={errors.stock}
              type="number"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Low Stock Threshold"
              value={productData.lowStockThreshold}
              onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
              type="number"
              helperText="Alert when stock falls below this number"
            />
          </Grid>
        </>
      )}
      
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Product Dimensions & Weight
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Length"
          value={productData.dimensions.length}
          onChange={(e) => handleDimensionChange('length', e.target.value)}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Width"
          value={productData.dimensions.width}
          onChange={(e) => handleDimensionChange('width', e.target.value)}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Height"
          value={productData.dimensions.height}
          onChange={(e) => handleDimensionChange('height', e.target.value)}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Weight"
          value={productData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>
          }}
        />
      </Grid>
    </Grid>
  );
  
  const renderImagesMedia = () => (
    <Box>
      <Box sx={{ mb: 3 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="image-upload"
          multiple
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            size="large"
            fullWidth={isMobile}
          >
            Upload Images
          </Button>
        </label>
        {errors.images && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {errors.images}
          </Typography>
        )}
      </Box>
      
      {images.length > 0 && (
        <Grid container spacing={2}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
              <Card sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '100%', // 1:1 Aspect Ratio
                    backgroundImage: `url(${image.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {image.isPrimary && (
                    <Chip
                      label="Primary"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: 8, left: 8 }}
                    />
                  )}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.8)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                    }}
                    onClick={() => handleRemoveImage(image.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
                <CardContent sx={{ p: 1 }}>
                  <Button
                    fullWidth
                    size="small"
                    variant={image.isPrimary ? 'contained' : 'outlined'}
                    onClick={() => handleSetPrimaryImage(image.id)}
                    disabled={image.isPrimary}
                  >
                    {image.isPrimary ? 'Primary Image' : 'Set as Primary'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
  
  const renderDetailsSpecifications = () => (
    <Grid container spacing={3}>
      {/* Tags */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Product Tags
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {productData.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="Add Tag"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Enter tag and press Enter"
          />
          <Button variant="outlined" onClick={handleAddTag}>
            Add
          </Button>
        </Box>
      </Grid>
      
      {/* Features */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Key Features
        </Typography>
        <List>
          {productData.features.map((feature, index) => (
            <ListItem key={index}>
              <ListItemText primary={feature} />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleRemoveFeature(feature)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="Add Feature"
            value={currentFeature}
            onChange={(e) => setCurrentFeature(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
            placeholder="Enter feature and press Enter"
          />
          <Button variant="outlined" onClick={handleAddFeature}>
            Add
          </Button>
        </Box>
      </Grid>
      
      {/* Specifications */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Specifications
        </Typography>
        <List>
          {productData.specifications.map((spec, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={spec.key}
                secondary={spec.value}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleRemoveSpecification(index)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Specification Name"
              value={currentSpec.key}
              onChange={(e) => setCurrentSpec(prev => ({ ...prev, key: e.target.value }))}
              placeholder="e.g., Color, Material, Size"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Specification Value"
              value={currentSpec.value}
              onChange={(e) => setCurrentSpec(prev => ({ ...prev, value: e.target.value }))}
              placeholder="e.g., Red, Cotton, Large"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleAddSpecification}
              sx={{ height: '56px' }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
  
  const renderSEOSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          SEO Optimization
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="SEO Title"
          value={productData.seoTitle}
          onChange={(e) => handleInputChange('seoTitle', e.target.value)}
          placeholder="Optimized title for search engines"
          inputProps={{ maxLength: 60 }}
          helperText={`${productData.seoTitle.length}/60 characters`}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="SEO Description"
          value={productData.seoDescription}
          onChange={(e) => handleInputChange('seoDescription', e.target.value)}
          placeholder="Meta description for search results"
          inputProps={{ maxLength: 160 }}
          helperText={`${productData.seoDescription.length}/160 characters`}
        />
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="SEO Keywords"
          value={productData.seoKeywords}
          onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
          placeholder="Comma-separated keywords"
          helperText="Enter relevant keywords separated by commas"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Product Settings
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={productData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
          }
          label="Product is Active"
        />
        <Typography variant="body2" color="text.secondary">
          Active products are visible to customers
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={productData.isFeatured}
              onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
            />
          }
          label="Featured Product"
        />
        <Typography variant="body2" color="text.secondary">
          Featured products appear in special sections
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControlLabel
          control={
            <Switch
              checked={productData.allowReviews}
              onChange={(e) => handleInputChange('allowReviews', e.target.checked)}
            />
          }
          label="Allow Customer Reviews"
        />
        <Typography variant="body2" color="text.secondary">
          Customers can leave reviews and ratings
        </Typography>
      </Grid>
    </Grid>
  );
  
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderPricingInventory();
      case 2:
        return renderImagesMedia();
      case 3:
        return renderDetailsSpecifications();
      case 4:
        return renderSEOSettings();
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <Head>
        <title>Add New Product - Vendor Dashboard</title>
        <meta name="description" content="Add a new product to your store" />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            sx={{ mr: 2 }}
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Add New Product
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create a new product listing for your store
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={() => setPreviewDialogOpen(true)}
            sx={{ mr: 2 }}
          >
            Preview
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {/* Stepper */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      icon={step.icon}
                      onClick={() => setActiveStep(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {step.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>
          
          {/* Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                {steps[activeStep].label}
              </Typography>
              
              {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  Please fix the errors below before proceeding.
                </Alert>
              )}
              
              {renderStepContent(activeStep)}
              
              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep === steps.length - 1 ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={handleSaveProduct}
                        startIcon={<Save />}
                      >
                        Save as Draft
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSaveProduct}
                        startIcon={<Check />}
                      >
                        Publish Product
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Product Preview
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              {productData.title || 'Product Title'}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ₹{productData.price || '0'}
            </Typography>
            <Typography variant="body1" paragraph>
              {productData.description || 'Product description will appear here...'}
            </Typography>
            {images.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {images.slice(0, 3).map((image) => (
                  <Box
                    key={image.id}
                    sx={{
                      width: 100,
                      height: 100,
                      backgroundImage: `url(${image.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AddProduct;