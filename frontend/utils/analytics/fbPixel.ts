// Facebook Pixel utilities

// Extend the Window interface to include fbq
declare global {
  interface Window {
    fbq: (
      command: 'init' | 'track' | 'trackCustom' | 'trackSingle' | 'trackSingleCustom',
      pixelId?: string,
      event?: string,
      parameters?: Record<string, any>
    ) => void;
    _fbq: any;
  }
}

// Initialize Facebook Pixel
export const initFBPixel = (pixelId: string) => {
  // Load Facebook Pixel script
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
  `;
  document.head.appendChild(script);

  // Initialize pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }
};

// Log page view
export const logFBPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Log custom event
export const logFBEvent = (event: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (parameters) {
      window.fbq('track', undefined, event, parameters);
    } else {
      window.fbq('track', undefined, event);
    }
  }
};

// Log custom event
export const logFBCustomEvent = (event: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    if (parameters) {
      window.fbq('trackCustom', undefined, event, parameters);
    } else {
      window.fbq('trackCustom', undefined, event);
    }
  }
};

// E-commerce events
export const logFBPurchase = (value: number, currency: string = 'USD', contentIds: string[] = []) => {
  logFBEvent('Purchase', {
    value,
    currency,
    content_ids: contentIds,
    content_type: 'product',
  });
};

export const logFBAddToCart = (value: number, currency: string = 'USD', contentId: string, contentName: string) => {
  logFBEvent('AddToCart', {
    value,
    currency,
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
  });
};

export const logFBViewContent = (value: number, currency: string = 'USD', contentId: string, contentName: string) => {
  logFBEvent('ViewContent', {
    value,
    currency,
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
  });
};

export const logFBInitiateCheckout = (value: number, currency: string = 'USD', contentIds: string[] = []) => {
  logFBEvent('InitiateCheckout', {
    value,
    currency,
    content_ids: contentIds,
    content_type: 'product',
  });
};

export const logFBSearch = (searchString: string, contentCategory?: string) => {
  logFBEvent('Search', {
    search_string: searchString,
    content_category: contentCategory,
  });
};

export const logFBCompleteRegistration = (method: string) => {
  logFBEvent('CompleteRegistration', {
    method,
  });
};

export const logFBLead = (value?: number, currency: string = 'USD') => {
  logFBEvent('Lead', {
    value,
    currency,
  });
};

export const logFBAddToWishlist = (value: number, currency: string = 'USD', contentId: string, contentName: string) => {
  logFBEvent('AddToWishlist', {
    value,
    currency,
    content_ids: [contentId],
    content_name: contentName,
    content_type: 'product',
  });
};