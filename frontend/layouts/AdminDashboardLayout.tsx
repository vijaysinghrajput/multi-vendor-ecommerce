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
import AdminHeader from '../components/headers/AdminHeader';
import AdminSidebar from '../components/sidebar/AdminSidebar';
import { getUserData } from '../utils/auth';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useSelector((state: any) => state.ui);
  const [adminData, setAdminData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const sidebarWidth = 280;

  useEffect(() => {
    // Get admin data from auth utilities
    const storedAdminData = getUserData('admin');
    if (storedAdminData) {
      setAdminData(storedAdminData);
    }

    // Get theme preference from localStorage
    const savedTheme = localStorage.getItem('adminThemeMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('adminThemeMode', newMode ? 'dark' : 'light');
  };

  // Create admin-specific theme
  const adminTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
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
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        
        {/* Admin Header */}
        <AdminHeader
          adminData={adminData}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
        />
        
        {/* Admin Sidebar */}
        <AdminSidebar
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
            backgroundColor: adminTheme.palette.background.default,
            transition: adminTheme.transitions.create(['margin', 'width'], {
              easing: adminTheme.transitions.easing.sharp,
              duration: adminTheme.transitions.duration.leavingScreen,
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

export default AdminDashboardLayout;