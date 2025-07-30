// Google Analytics utilities

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = window.gtag || function() {
    (window.gtag as any).q = (window.gtag as any).q || [];
    (window.gtag as any).q.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Log page view
export const logPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Log custom event
export const logEvent = (action: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters);
  }
};

// E-commerce events
export const logPurchase = (transactionId: string, value: number, currency: string = 'USD', items: any[] = []) => {
  logEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency,
    items,
  });
};

export const logAddToCart = (currency: string, value: number, items: any[]) => {
  logEvent('add_to_cart', {
    currency,
    value,
    items,
  });
};

export const logRemoveFromCart = (currency: string, value: number, items: any[]) => {
  logEvent('remove_from_cart', {
    currency,
    value,
    items,
  });
};

export const logViewItem = (currency: string, value: number, items: any[]) => {
  logEvent('view_item', {
    currency,
    value,
    items,
  });
};

export const logBeginCheckout = (currency: string, value: number, items: any[]) => {
  logEvent('begin_checkout', {
    currency,
    value,
    items,
  });
};

export const logSearch = (searchTerm: string) => {
  logEvent('search', {
    search_term: searchTerm,
  });
};

export const logSignUp = (method: string) => {
  logEvent('sign_up', {
    method,
  });
};

export const logLogin = (method: string) => {
  logEvent('login', {
    method,
  });
};

export const logShare = (contentType: string, itemId: string) => {
  logEvent('share', {
    content_type: contentType,
    item_id: itemId,
  });
};