import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { removeNotification } from '../../store/slices/uiSlice';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

interface NotificationSnackbarProps {
  notification: Notification;
}

const NotificationSnackbar = ({ notification }: NotificationSnackbarProps) => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway' && notification.persistent) {
      return;
    }
    setOpen(false);
    // Remove from store after animation completes
    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 150);
  };

  const autoHideDuration = notification.persistent 
    ? null 
    : (notification.duration || 6000);

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          padding: 0,
        },
      }}
    >
      <Alert
        severity={notification.type}
        onClose={notification.persistent ? undefined : handleClose}
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: 500,
        }}
        action={
          notification.persistent ? (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <Close fontSize="small" />
            </IconButton>
          ) : undefined
        }
      >
        {notification.title && (
          <AlertTitle>{notification.title}</AlertTitle>
        )}
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;