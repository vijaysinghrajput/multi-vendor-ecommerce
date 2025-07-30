import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum AnalyticsType {
  PAGE_VIEW = 'page_view',
  PRODUCT_VIEW = 'product_view',
  CATEGORY_VIEW = 'category_view',
  SEARCH = 'search',
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  ADD_TO_WISHLIST = 'add_to_wishlist',
  REMOVE_FROM_WISHLIST = 'remove_from_wishlist',
  CHECKOUT_START = 'checkout_start',
  CHECKOUT_COMPLETE = 'checkout_complete',
  PURCHASE = 'purchase',
  REFUND = 'refund',
  USER_REGISTRATION = 'user_registration',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  VENDOR_REGISTRATION = 'vendor_registration',
  PRODUCT_REVIEW = 'product_review',
  COUPON_USED = 'coupon_used',
  EMAIL_OPEN = 'email_open',
  EMAIL_CLICK = 'email_click',
  CUSTOM = 'custom',
}

export enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
  UNKNOWN = 'unknown',
}

export enum TrafficSource {
  DIRECT = 'direct',
  ORGANIC_SEARCH = 'organic_search',
  PAID_SEARCH = 'paid_search',
  SOCIAL_MEDIA = 'social_media',
  EMAIL = 'email',
  REFERRAL = 'referral',
  AFFILIATE = 'affiliate',
  DISPLAY = 'display',
  UNKNOWN = 'unknown',
}

@Entity('analytics')
@Index(['type', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['sessionId', 'createdAt'])
@Index(['productId', 'type', 'createdAt'])
@Index(['categoryId', 'type', 'createdAt'])
@Index(['vendorId', 'type', 'createdAt'])
export class Analytics {
  @ApiProperty({ description: 'Analytics event ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Event type', enum: AnalyticsType })
  @Column({ type: 'enum', enum: AnalyticsType })
  type: AnalyticsType;

  @ApiProperty({ description: 'Event name/title' })
  @Column()
  event: string;

  @ApiProperty({ description: 'Event description', required: false })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'User ID (if authenticated)', required: false })
  @Column({ nullable: true })
  userId?: string;

  @ApiProperty({ description: 'Session ID' })
  @Column()
  sessionId: string;

  @ApiProperty({ description: 'Product ID (if applicable)', required: false })
  @Column({ nullable: true })
  productId?: string;

  @ApiProperty({ description: 'Category ID (if applicable)', required: false })
  @Column({ nullable: true })
  categoryId?: string;

  @ApiProperty({ description: 'Vendor ID (if applicable)', required: false })
  @Column({ nullable: true })
  vendorId?: string;

  @ApiProperty({ description: 'Order ID (if applicable)', required: false })
  @Column({ nullable: true })
  orderId?: string;

  @ApiProperty({ description: 'Page URL' })
  @Column()
  pageUrl: string;

  @ApiProperty({ description: 'Page title', required: false })
  @Column({ nullable: true })
  pageTitle?: string;

  @ApiProperty({ description: 'Referrer URL', required: false })
  @Column({ nullable: true })
  referrerUrl?: string;

  @ApiProperty({ description: 'Traffic source', enum: TrafficSource })
  @Column({ type: 'enum', enum: TrafficSource, default: TrafficSource.DIRECT })
  trafficSource: TrafficSource;

  @ApiProperty({ description: 'UTM campaign', required: false })
  @Column({ nullable: true })
  utmCampaign?: string;

  @ApiProperty({ description: 'UTM source', required: false })
  @Column({ nullable: true })
  utmSource?: string;

  @ApiProperty({ description: 'UTM medium', required: false })
  @Column({ nullable: true })
  utmMedium?: string;

  @ApiProperty({ description: 'UTM term', required: false })
  @Column({ nullable: true })
  utmTerm?: string;

  @ApiProperty({ description: 'UTM content', required: false })
  @Column({ nullable: true })
  utmContent?: string;

  @ApiProperty({ description: 'User IP address' })
  @Column()
  ipAddress: string;

  @ApiProperty({ description: 'User agent string' })
  @Column('text')
  userAgent: string;

  @ApiProperty({ description: 'Device type', enum: DeviceType })
  @Column({ type: 'enum', enum: DeviceType, default: DeviceType.UNKNOWN })
  deviceType: DeviceType;

  @ApiProperty({ description: 'Browser name', required: false })
  @Column({ nullable: true })
  browser?: string;

  @ApiProperty({ description: 'Browser version', required: false })
  @Column({ nullable: true })
  browserVersion?: string;

  @ApiProperty({ description: 'Operating system', required: false })
  @Column({ nullable: true })
  operatingSystem?: string;

  @ApiProperty({ description: 'Screen resolution', required: false })
  @Column({ nullable: true })
  screenResolution?: string;

  @ApiProperty({ description: 'Viewport size', required: false })
  @Column({ nullable: true })
  viewportSize?: string;

  @ApiProperty({ description: 'Country code', required: false })
  @Column({ nullable: true })
  country?: string;

  @ApiProperty({ description: 'Region/state', required: false })
  @Column({ nullable: true })
  region?: string;

  @ApiProperty({ description: 'City', required: false })
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ description: 'Timezone', required: false })
  @Column({ nullable: true })
  timezone?: string;

  @ApiProperty({ description: 'Language preference', required: false })
  @Column({ nullable: true })
  language?: string;

  @ApiProperty({ description: 'Currency preference', required: false })
  @Column({ nullable: true })
  currency?: string;

  @ApiProperty({ description: 'Event value (monetary or numeric)', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  value?: number;

  @ApiProperty({ description: 'Event quantity', required: false })
  @Column({ nullable: true })
  quantity?: number;

  @ApiProperty({ description: 'Search query (for search events)', required: false })
  @Column({ nullable: true })
  searchQuery?: string;

  @ApiProperty({ description: 'Search results count (for search events)', required: false })
  @Column({ nullable: true })
  searchResultsCount?: number;

  @ApiProperty({ description: 'Time spent on page (in seconds)', required: false })
  @Column({ nullable: true })
  timeOnPage?: number;

  @ApiProperty({ description: 'Scroll depth percentage', required: false })
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  scrollDepth?: number;

  @ApiProperty({ description: 'Additional event properties', required: false })
  @Column('json', { nullable: true })
  properties?: Record<string, any>;

  @ApiProperty({ description: 'Custom dimensions', required: false })
  @Column('json', { nullable: true })
  customDimensions?: Record<string, string>;

  @ApiProperty({ description: 'Custom metrics', required: false })
  @Column('json', { nullable: true })
  customMetrics?: Record<string, number>;

  @ApiProperty({ description: 'Event timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  @ApiProperty({ description: 'Is mobile device' })
  get isMobile(): boolean {
    return this.deviceType === DeviceType.MOBILE;
  }

  @ApiProperty({ description: 'Is tablet device' })
  get isTablet(): boolean {
    return this.deviceType === DeviceType.TABLET;
  }

  @ApiProperty({ description: 'Is desktop device' })
  get isDesktop(): boolean {
    return this.deviceType === DeviceType.DESKTOP;
  }

  @ApiProperty({ description: 'Is authenticated user' })
  get isAuthenticated(): boolean {
    return this.userId !== null && this.userId !== undefined;
  }

  @ApiProperty({ description: 'Is conversion event' })
  get isConversion(): boolean {
    return [
      AnalyticsType.PURCHASE,
      AnalyticsType.CHECKOUT_COMPLETE,
      AnalyticsType.USER_REGISTRATION,
      AnalyticsType.VENDOR_REGISTRATION,
    ].includes(this.type);
  }

  @ApiProperty({ description: 'Is ecommerce event' })
  get isEcommerce(): boolean {
    return [
      AnalyticsType.PRODUCT_VIEW,
      AnalyticsType.ADD_TO_CART,
      AnalyticsType.REMOVE_FROM_CART,
      AnalyticsType.CHECKOUT_START,
      AnalyticsType.CHECKOUT_COMPLETE,
      AnalyticsType.PURCHASE,
      AnalyticsType.REFUND,
    ].includes(this.type);
  }

  @ApiProperty({ description: 'Is engagement event' })
  get isEngagement(): boolean {
    return [
      AnalyticsType.PAGE_VIEW,
      AnalyticsType.SEARCH,
      AnalyticsType.ADD_TO_WISHLIST,
      AnalyticsType.PRODUCT_REVIEW,
    ].includes(this.type);
  }

  @ApiProperty({ description: 'Has UTM parameters' })
  get hasUtmParameters(): boolean {
    return !!(this.utmSource || this.utmMedium || this.utmCampaign);
  }

  @ApiProperty({ description: 'Full UTM string' })
  get utmString(): string {
    const params = [];
    if (this.utmSource) params.push(`utm_source=${this.utmSource}`);
    if (this.utmMedium) params.push(`utm_medium=${this.utmMedium}`);
    if (this.utmCampaign) params.push(`utm_campaign=${this.utmCampaign}`);
    if (this.utmTerm) params.push(`utm_term=${this.utmTerm}`);
    if (this.utmContent) params.push(`utm_content=${this.utmContent}`);
    return params.join('&');
  }

  // Methods
  addProperty(key: string, value: any): void {
    if (!this.properties) {
      this.properties = {};
    }
    this.properties[key] = value;
  }

  getProperty(key: string): any {
    return this.properties?.[key];
  }

  addCustomDimension(key: string, value: string): void {
    if (!this.customDimensions) {
      this.customDimensions = {};
    }
    this.customDimensions[key] = value;
  }

  getCustomDimension(key: string): string | undefined {
    return this.customDimensions?.[key];
  }

  addCustomMetric(key: string, value: number): void {
    if (!this.customMetrics) {
      this.customMetrics = {};
    }
    this.customMetrics[key] = value;
  }

  getCustomMetric(key: string): number | undefined {
    return this.customMetrics?.[key];
  }

  setLocation(country: string, region?: string, city?: string): void {
    this.country = country;
    if (region) this.region = region;
    if (city) this.city = city;
  }

  setUtmParameters(
    source?: string,
    medium?: string,
    campaign?: string,
    term?: string,
    content?: string
  ): void {
    if (source) this.utmSource = source;
    if (medium) this.utmMedium = medium;
    if (campaign) this.utmCampaign = campaign;
    if (term) this.utmTerm = term;
    if (content) this.utmContent = content;
  }

  setDeviceInfo(
    deviceType: DeviceType,
    browser?: string,
    browserVersion?: string,
    os?: string,
    screenResolution?: string,
    viewportSize?: string
  ): void {
    this.deviceType = deviceType;
    if (browser) this.browser = browser;
    if (browserVersion) this.browserVersion = browserVersion;
    if (os) this.operatingSystem = os;
    if (screenResolution) this.screenResolution = screenResolution;
    if (viewportSize) this.viewportSize = viewportSize;
  }

  // Static methods
  static createPageView(
    sessionId: string,
    pageUrl: string,
    pageTitle: string,
    userId?: string
  ): Partial<Analytics> {
    return {
      type: AnalyticsType.PAGE_VIEW,
      event: 'Page View',
      sessionId,
      pageUrl,
      pageTitle,
      userId,
    };
  }

  static createProductView(
    sessionId: string,
    productId: string,
    pageUrl: string,
    userId?: string
  ): Partial<Analytics> {
    return {
      type: AnalyticsType.PRODUCT_VIEW,
      event: 'Product View',
      sessionId,
      productId,
      pageUrl,
      userId,
    };
  }

  static createPurchase(
    sessionId: string,
    orderId: string,
    value: number,
    userId?: string
  ): Partial<Analytics> {
    return {
      type: AnalyticsType.PURCHASE,
      event: 'Purchase',
      sessionId,
      orderId,
      value,
      userId,
      pageUrl: '/checkout/success',
    };
  }

  static createSearch(
    sessionId: string,
    searchQuery: string,
    searchResultsCount: number,
    pageUrl: string,
    userId?: string
  ): Partial<Analytics> {
    return {
      type: AnalyticsType.SEARCH,
      event: 'Search',
      sessionId,
      searchQuery,
      searchResultsCount,
      pageUrl,
      userId,
    };
  }

  static createAddToCart(
    sessionId: string,
    productId: string,
    quantity: number,
    value: number,
    userId?: string
  ): Partial<Analytics> {
    return {
      type: AnalyticsType.ADD_TO_CART,
      event: 'Add to Cart',
      sessionId,
      productId,
      quantity,
      value,
      userId,
      pageUrl: '/cart',
    };
  }

  static createUserRegistration(
    sessionId: string,
    userId: string,
    pageUrl: string
  ): Partial<Analytics> {
    return {
      type: AnalyticsType.USER_REGISTRATION,
      event: 'User Registration',
      sessionId,
      userId,
      pageUrl,
    };
  }

  static parseUserAgent(userAgent: string): {
    browser?: string;
    browserVersion?: string;
    operatingSystem?: string;
    deviceType: DeviceType;
  } {
    // Simple user agent parsing (in production, use a library like ua-parser-js)
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isTablet = /iPad|Tablet/.test(userAgent);
    
    let deviceType = DeviceType.DESKTOP;
    if (isTablet) deviceType = DeviceType.TABLET;
    else if (isMobile) deviceType = DeviceType.MOBILE;

    // Extract browser info (simplified)
    let browser: string | undefined;
    let browserVersion: string | undefined;
    let operatingSystem: string | undefined;

    if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
      const match = userAgent.match(/Version\/(\d+\.\d+)/);
      if (match) browserVersion = match[1];
    }

    // Extract OS info (simplified)
    if (userAgent.includes('Windows')) operatingSystem = 'Windows';
    else if (userAgent.includes('Mac OS')) operatingSystem = 'macOS';
    else if (userAgent.includes('Linux')) operatingSystem = 'Linux';
    else if (userAgent.includes('Android')) operatingSystem = 'Android';
    else if (userAgent.includes('iOS')) operatingSystem = 'iOS';

    return {
      browser,
      browserVersion,
      operatingSystem,
      deviceType,
    };
  }

  static determineTrafficSource(referrerUrl?: string, utmSource?: string): TrafficSource {
    if (utmSource) {
      if (utmSource.includes('google') || utmSource.includes('bing')) {
        return TrafficSource.PAID_SEARCH;
      }
      if (utmSource.includes('facebook') || utmSource.includes('twitter') || utmSource.includes('instagram')) {
        return TrafficSource.SOCIAL_MEDIA;
      }
      if (utmSource.includes('email') || utmSource.includes('newsletter')) {
        return TrafficSource.EMAIL;
      }
      return TrafficSource.REFERRAL;
    }

    if (!referrerUrl) {
      return TrafficSource.DIRECT;
    }

    if (referrerUrl.includes('google.com') || referrerUrl.includes('bing.com')) {
      return TrafficSource.ORGANIC_SEARCH;
    }

    if (referrerUrl.includes('facebook.com') || referrerUrl.includes('twitter.com') || referrerUrl.includes('instagram.com')) {
      return TrafficSource.SOCIAL_MEDIA;
    }

    return TrafficSource.REFERRAL;
  }
}