import React from 'react';
import {
  Box,
  Typography,
  Container,
  Link,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AdminFooter = ({ darkMode }) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: darkMode ? '#1e1e1e' : '#f8f9fa',
        color: darkMode ? '#fff' : '#000',
        py: 2,
        mt: 'auto',
        borderTop: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} Multi-Vendor E-Commerce Admin Panel. All rights reserved.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8 }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8 }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="inherit"
              underline="hover"
              variant="body2"
              sx={{ opacity: 0.8 }}
            >
              Support
            </Link>
            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6 }}>
              v2.1.0
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1, opacity: 0.3 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
            Powered by DSA Software Provider | Admin Dashboard
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminFooter;