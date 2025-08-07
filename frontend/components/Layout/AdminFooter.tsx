import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const AdminFooter = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 1,
        px: 3,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
        mt: 'auto'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: '0.8rem' }}
        >
          © {currentYear} Skyably IT Solution. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminFooter;