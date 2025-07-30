// PWA utilities for service worker registration

// Register service worker
export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  showUpdateNotification();
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Unregister service worker
export const unregisterSW = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
};

// Show update notification
const showUpdateNotification = () => {
  if (confirm('New version available! Click OK to update.')) {
    window.location.reload();
  }
};

// Check if app is running in standalone mode (PWA)
export const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes('android-app://')
  );
};

// Check if device is iOS
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Check if device is Android
export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

// Check if PWA install prompt is available
export const canInstallPWA = () => {
  return 'beforeinstallprompt' in window;
};

// Install PWA prompt
let deferredPrompt: any;

export const setupPWAInstall = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button or banner
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    hideInstallBanner();
    deferredPrompt = null;
  });
};

export const installPWA = async () => {
  if (deferredPrompt) {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // Clear the deferredPrompt variable
    deferredPrompt = null;
    hideInstallBanner();
  }
};

// Show install banner (implement based on your UI)
const showInstallBanner = () => {
  // Implement your install banner UI here
  console.log('PWA install available');
};

// Hide install banner (implement based on your UI)
const hideInstallBanner = () => {
  // Implement hiding install banner UI here
  console.log('PWA install banner hidden');
};

// Get PWA display mode
export const getPWADisplayMode = () => {
  if (isStandalone()) {
    return 'standalone';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }
  return 'browser';
};

// Share API
export const shareContent = async (data: {
  title?: string;
  text?: string;
  url?: string;
}) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      console.log('Content shared successfully');
    } catch (error) {
      console.log('Error sharing:', error);
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    fallbackShare(data);
  }
};

// Fallback share function
const fallbackShare = (data: { title?: string; text?: string; url?: string }) => {
  const url = data.url || window.location.href;
  const text = data.text || data.title || document.title;
  
  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text} ${url}`);
    alert('Link copied to clipboard!');
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = `${text} ${url}`;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Link copied to clipboard!');
  }
};