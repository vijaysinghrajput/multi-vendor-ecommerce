import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  useTheme,
  useMediaQuery,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import VendorHeader from '../components/headers/VendorHeader';
import VendorSidebar from '../components/sidebar/VendorSidebar';
import { getUserData } from '../utils/auth';

interface VendorDashboardLayoutProps {
  children: React.ReactNode;
}

const VendorDashboardLayout: React.FC<VendorDashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useSelector((state: any) => state.ui);
  const [vendorData, setVendorData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const sidebarWidth = 280;

  useEffect(() => {
    // Get vendor data from auth utilities
    const storedVendorData = getUserData('vendor');
    if (storedVendorData) {
      setVendorData(storedVendorData);
    }

    // Get theme preference from localStorage
    const savedTheme = localStorage.getItem('vendorThemeMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('vendorThemeMode', newMode ? 'dark' : 'light');
  };

  // Create vendor-specific theme
  const vendorTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
      },
      secondary: {
        main: '#ff9800',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            borderRight: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isDarkMode 
              ? '0 2px 8px rgba(0,0,0,0.3)' 
              : '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={vendorTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        
        {/* Vendor Header */}
        <VendorHeader
          vendorData={vendorData}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
        />
        
        {/* Vendor Sidebar */}
        <VendorSidebar
          open={sidebarOpen}
          width={sidebarWidth}
          isMobile={isMobile}
        />
        
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            backgroundColor: vendorTheme.palette.background.default,
            transition: vendorTheme.transitions.create(['margin', 'width'], {
              easing: vendorTheme.transitions.easing.sharp,
              duration: vendorTheme.transitions.duration.leavingScreen,
            }),
            marginLeft: isMobile ? 0 : (sidebarOpen ? `${sidebarWidth}px` : 0),
            width: isMobile ? '100%' : (sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%'),
            pt: 8, // Account for header height (64px)
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: 'calc(100vh - 64px)',
              overflow: 'auto',
              p: 0,
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default VendorDashboardLayout;