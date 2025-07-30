import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Store
import { store, persistor } from '../store';

// Theme
import { theme } from '../theme';
import createEmotionCache from '../utils/createEmotionCache';

// Components
import Layout from '../components/Layout';
import LoadingScreen from '../components/LoadingScreen';
import ErrorBoundary from '../components/ErrorBoundary';

// Analytics
import { initGA, logPageView } from '../utils/analytics/ga';
import { initFBPixel, logFBPageView } from '../utils/analytics/fbPixel';

// PWA
import { registerSW } from '../utils/pwa';

// Styles
import '../styles/globals.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps, router } = props;

  useEffect(() => {
    // Initialize analytics
    if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      initGA(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
    }
    
    if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
      initFBPixel(process.env.NEXT_PUBLIC_FB_PIXEL_ID);
    }

    // Register service worker for PWA
    if (process.env.NEXT_PUBLIC_ENABLE_PWA === 'true') {
      registerSW();
    }

    // Remove server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    // Log page views
    const handleRouteChange = (url: string) => {
      if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
        logPageView(url);
      }
      if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
        logFBPageView();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <HelmetProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ErrorBoundary>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </ErrorBoundary>
                
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary,
                      borderRadius: theme.shape.borderRadius,
                      boxShadow: theme.shadows[4],
                    },
                    success: {
                      iconTheme: {
                        primary: theme.palette.success.main,
                        secondary: theme.palette.success.contrastText,
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: theme.palette.error.main,
                        secondary: theme.palette.error.contrastText,
                      },
                    },
                  }}
                />
                
                {/* React Query DevTools */}
                {process.env.NODE_ENV === 'development' && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )}
              </ThemeProvider>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </HelmetProvider>
    </CacheProvider>
  );
}

export default MyApp;