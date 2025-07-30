import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

const LoadingOverlay = ({ open, message = 'Loading...' }: LoadingOverlayProps) => {
  const theme = useTheme();

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.modal + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress
          color="primary"
          size={60}
          thickness={4}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;