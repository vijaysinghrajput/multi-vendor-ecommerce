# Admin Layout System Documentation

## 🏗️ Overview

This is a professional, responsive admin layout system built with Material-UI v5 for the Multi-Vendor E-Commerce platform. The layout provides a consistent, scalable foundation for all admin pages.

## 📁 Components Structure

```
components/
├── layout/
│   ├── AdminHeader.jsx      # Top navigation with user menu & notifications
│   ├── AdminFooter.jsx      # Footer with company info & version
│   ├── AdminLayout.jsx      # Main layout wrapper component
│   └── README.md           # This documentation
├── sidebar/
│   └── AdminSidebar.jsx    # Navigation sidebar with menu items
└── common/
    └── LoadingSpinner.jsx   # Reusable loading component
```

## 🎨 Features

### AdminLayout Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support with persistence
- ✅ Collapsible sidebar on mobile
- ✅ Breadcrumb navigation
- ✅ Loading states with progress bar
- ✅ React Router v6 integration
- ✅ Consistent header and footer

### AdminHeader Features
- ✅ Dark mode toggle
- ✅ Notifications with badge count
- ✅ Profile dropdown with logout
- ✅ Mobile hamburger menu
- ✅ Company branding

### AdminSidebar Features
- ✅ Hierarchical menu structure
- ✅ Active route highlighting
- ✅ Badge notifications on menu items
- ✅ Collapsible submenus
- ✅ Icons for all menu items

### AdminFooter Features
- ✅ Company information
- ✅ Version display
- ✅ Copyright notice
- ✅ Quick links

## 🚀 Usage

### Basic Usage

```jsx
import AdminLayout from '../components/layout/AdminLayout';

const MyAdminPage = () => {
  return (
    <AdminLayout title="My Page Title">
      <Container maxWidth="xl">
        {/* Your page content here */}
        <Typography variant="h4">Welcome to My Page</Typography>
      </Container>
    </AdminLayout>
  );
};

export default MyAdminPage;
```

### With Loading State

```jsx
import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';

const MyAdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch your data
        const response = await api.getData();
        setData(response);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout title="My Page" loading={loading}>
      <Container maxWidth="xl">
        {data ? (
          <div>Your content with data</div>
        ) : (
          <LoadingSpinner message="Loading data..." />
        )}
      </Container>
    </AdminLayout>
  );
};
```

### With Custom Breadcrumbs

The breadcrumbs are automatically generated based on the route. To add custom breadcrumbs, update the `breadcrumbConfig` in `AdminLayout.jsx`:

```jsx
const breadcrumbConfig = {
  '/admin/my-custom-page': [
    { label: 'Dashboard', icon: DashboardIcon, href: '/admin/dashboard' },
    { label: 'My Section', icon: MyIcon, href: '/admin/my-section' },
    { label: 'Custom Page', icon: PageIcon, href: '/admin/my-custom-page' }
  ]
};
```

## 🎯 Responsive Design

### Breakpoints
- **xs**: 0px - 599px (Mobile)
- **sm**: 600px - 959px (Tablet)
- **md**: 960px - 1279px (Desktop)
- **lg**: 1280px - 1919px (Large Desktop)
- **xl**: 1920px+ (Extra Large)

### Mobile Behavior
- Sidebar collapses to overlay drawer
- Header shows hamburger menu
- Footer adapts to single column
- Touch-friendly interactions

### Desktop Behavior
- Persistent sidebar navigation
- Full header with all features
- Multi-column footer layout
- Hover interactions

## 🎨 Theming & Customization

### Dark Mode
Dark mode is automatically handled by the layout. The preference is saved to localStorage and persists across sessions.

```jsx
// Dark mode state is managed internally
// Custom event is dispatched for external listeners
window.addEventListener('themeChange', (event) => {
  console.log('Dark mode:', event.detail.darkMode);
});
```

### Color Customization
Colors can be customized through the Material-UI theme:

```jsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Your primary color
    },
    secondary: {
      main: '#dc004e', // Your secondary color
    },
  },
});
```

### Sidebar Menu Customization
Update the `menuItems` array in `AdminSidebar.jsx`:

```jsx
const menuItems = [
  {
    id: 'my-section',
    label: 'My Section',
    icon: MyIcon,
    path: '/admin/my-section',
    badge: { count: 5, color: 'warning' }
  },
  {
    id: 'nested-section',
    label: 'Nested Section',
    icon: NestedIcon,
    hasChildren: true,
    children: [
      {
        id: 'sub-item',
        label: 'Sub Item',
        icon: SubIcon,
        path: '/admin/nested/sub-item',
        badge: null
      }
    ]
  }
];
```

## 📱 Mobile Optimization

### Touch Interactions
- Minimum 48px touch targets
- Appropriate spacing for thumb navigation
- Swipe gestures for drawer

### Performance
- Lazy loading for route components
- Optimized re-renders
- Efficient event handling

## 🔧 Advanced Configuration

### Header Customization
Pass custom props to AdminHeader:

```jsx
<AdminLayout 
  title="Dashboard"
  headerProps={{
    adminUser: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Super Admin'
    }
  }}
>
  {/* content */}
</AdminLayout>
```

### Footer Customization
Override footer content:

```jsx
<AdminLayout 
  title="Dashboard"
  footerProps={{
    companyName: 'Your Company',
    version: '2.0.0'
  }}
>
  {/* content */}
</AdminLayout>
```

## 🛠️ Development Tips

### Adding New Pages
1. Create your page component
2. Wrap with `AdminLayout`
3. Add route to sidebar if needed
4. Update breadcrumb config if needed

### Performance Optimization
- Use React.memo for expensive components
- Implement virtual scrolling for large lists
- Lazy load route components
- Optimize image loading

### Accessibility
- All components follow WCAG 2.1 guidelines
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## 🐛 Troubleshooting

### Common Issues

**Sidebar not showing on mobile:**
- Check that `handleDrawerToggle` is passed correctly
- Verify Material-UI breakpoints

**Dark mode not persisting:**
- Check localStorage availability
- Verify theme provider setup

**Breadcrumbs not updating:**
- Check route path in `breadcrumbConfig`
- Verify router pathname matching

**Layout shifts on route change:**
- Implement proper loading states
- Use consistent container maxWidth

## 📚 Dependencies

- Material-UI v5.x
- React 18.x
- Next.js 13.x+
- React Router v6.x

## 🚀 Future Enhancements

- [ ] Multi-theme support
- [ ] Customizable sidebar width
- [ ] Floating action button support
- [ ] Advanced notification system
- [ ] Keyboard shortcuts
- [ ] PWA optimization

---

**Created by:** Senior Frontend Engineer  
**Last Updated:** January 2025  
**Version:** 1.0.0