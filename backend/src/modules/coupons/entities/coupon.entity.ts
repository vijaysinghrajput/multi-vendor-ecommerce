import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
  BUY_X_GET_Y = 'buy_x_get_y',
}

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  USED_UP = 'used_up',
}

export enum DiscountTarget {
  ORDER_TOTAL = 'order_total',
  SHIPPING = 'shipping',
  SPECIFIC_PRODUCTS = 'specific_products',
  SPECIFIC_CATEGORIES = 'specific_categories',
}

@Entity('coupons')
@Index(['code'], { unique: true })
@Index(['status', 'validFrom', 'validTo'])
export class Coupon {
  @ApiProperty({ description: 'Coupon ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Coupon code' })
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Coupon name/title' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Coupon description', required: false })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'Coupon type', enum: CouponType })
  @Column({ type: 'enum', enum: CouponType })
  type: CouponType;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)' })
  @Column('decimal', { precision: 10, scale: 2 })
  discountValue: number;

  @ApiProperty({ description: 'Maximum discount amount (for percentage coupons)', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxDiscountAmount?: number;

  @ApiProperty({ description: 'Minimum order amount required', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minOrderAmount?: number;

  @ApiProperty({ description: 'Maximum order amount allowed', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxOrderAmount?: number;

  @ApiProperty({ description: 'Discount target', enum: DiscountTarget })
  @Column({ type: 'enum', enum: DiscountTarget, default: DiscountTarget.ORDER_TOTAL })
  target: DiscountTarget;

  @ApiProperty({ description: 'Applicable product IDs', required: false })
  @Column('simple-array', { nullable: true })
  applicableProductIds?: string[];

  @ApiProperty({ description: 'Applicable category IDs', required: false })
  @Column('simple-array', { nullable: true })
  applicableCategoryIds?: string[];

  @ApiProperty({ description: 'Excluded product IDs', required: false })
  @Column('simple-array', { nullable: true })
  excludedProductIds?: string[];

  @ApiProperty({ description: 'Excluded category IDs', required: false })
  @Column('simple-array', { nullable: true })
  excludedCategoryIds?: string[];

  @ApiProperty({ description: 'Coupon status', enum: CouponStatus })
  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
  status: CouponStatus;

  @ApiProperty({ description: 'Usage limit (total)', required: false })
  @Column({ nullable: true })
  usageLimit?: number;

  @ApiProperty({ description: 'Usage limit per customer', required: false })
  @Column({ nullable: true })
  usageLimitPerCustomer?: number;

  @ApiProperty({ description: 'Current usage count' })
  @Column({ default: 0 })
  usageCount: number;

  @ApiProperty({ description: 'Valid from date' })
  @Column({ type: 'timestamp' })
  validFrom: Date;

  @ApiProperty({ description: 'Valid to date' })
  @Column({ type: 'timestamp' })
  validTo: Date;

  @ApiProperty({ description: 'Is coupon stackable with other coupons' })
  @Column({ default: false })
  isStackable: boolean;

  @ApiProperty({ description: 'Is coupon for first-time customers only' })
  @Column({ default: false })
  isFirstTimeOnly: boolean;

  @ApiProperty({ description: 'Applicable user IDs (for targeted coupons)', required: false })
  @Column('simple-array', { nullable: true })
  applicableUserIds?: string[];

  @ApiProperty({ description: 'Applicable user roles', required: false })
  @Column('simple-array', { nullable: true })
  applicableUserRoles?: string[];

  @ApiProperty({ description: 'Buy X quantity (for buy_x_get_y type)', required: false })
  @Column({ nullable: true })
  buyXQuantity?: number;

  @ApiProperty({ description: 'Get Y quantity (for buy_x_get_y type)', required: false })
  @Column({ nullable: true })
  getYQuantity?: number;

  @ApiProperty({ description: 'Buy X product IDs (for buy_x_get_y type)', required: false })
  @Column('simple-array', { nullable: true })
  buyXProductIds?: string[];

  @ApiProperty({ description: 'Get Y product IDs (for buy_x_get_y type)', required: false })
  @Column('simple-array', { nullable: true })
  getYProductIds?: string[];

  @ApiProperty({ description: 'Additional metadata', required: false })
  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Created by user ID', required: false })
  @Column({ nullable: true })
  createdBy?: string;

  @ApiProperty({ description: 'Coupon creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Coupon last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  @ApiProperty({ description: 'Is coupon currently valid' })
  get isValid(): boolean {
    const now = new Date();
    return (
      this.status === CouponStatus.ACTIVE &&
      now >= this.validFrom &&
      now <= this.validTo &&
      (this.usageLimit === null || this.usageCount < this.usageLimit)
    );
  }

  @ApiProperty({ description: 'Is coupon expired' })
  get isExpired(): boolean {
    return new Date() > this.validTo;
  }

  @ApiProperty({ description: 'Is coupon used up' })
  get isUsedUp(): boolean {
    return this.usageLimit !== null && this.usageCount >= this.usageLimit;
  }

  @ApiProperty({ description: 'Days until expiry' })
  get daysUntilExpiry(): number {
    const now = new Date();
    const diffTime = this.validTo.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  @ApiProperty({ description: 'Usage percentage' })
  get usagePercentage(): number {
    if (!this.usageLimit) return 0;
    return Math.round((this.usageCount / this.usageLimit) * 100);
  }

  @ApiProperty({ description: 'Remaining usage count' })
  get remainingUsage(): number | null {
    if (!this.usageLimit) return null;
    return Math.max(0, this.usageLimit - this.usageCount);
  }

  @ApiProperty({ description: 'Is percentage discount' })
  get isPercentageDiscount(): boolean {
    return this.type === CouponType.PERCENTAGE;
  }

  @ApiProperty({ description: 'Is fixed amount discount' })
  get isFixedAmountDiscount(): boolean {
    return this.type === CouponType.FIXED_AMOUNT;
  }

  @ApiProperty({ description: 'Is free shipping coupon' })
  get isFreeShipping(): boolean {
    return this.type === CouponType.FREE_SHIPPING;
  }

  @ApiProperty({ description: 'Is buy X get Y coupon' })
  get isBuyXGetY(): boolean {
    return this.type === CouponType.BUY_X_GET_Y;
  }

  // Methods
  activate(): void {
    this.status = CouponStatus.ACTIVE;
  }

  deactivate(): void {
    this.status = CouponStatus.INACTIVE;
  }

  markAsExpired(): void {
    this.status = CouponStatus.EXPIRED;
  }

  markAsUsedUp(): void {
    this.status = CouponStatus.USED_UP;
  }

  incrementUsage(): void {
    this.usageCount += 1;
    if (this.usageLimit && this.usageCount >= this.usageLimit) {
      this.markAsUsedUp();
    }
  }

  decrementUsage(): void {
    this.usageCount = Math.max(0, this.usageCount - 1);
    if (this.status === CouponStatus.USED_UP && this.usageCount < (this.usageLimit || 0)) {
      this.status = CouponStatus.ACTIVE;
    }
  }

  canBeUsedBy(userId: string, userRole: string, isFirstTime: boolean = false): boolean {
    if (!this.isValid) return false;

    // Check first-time customer restriction
    if (this.isFirstTimeOnly && !isFirstTime) return false;

    // Check user-specific restrictions
    if (this.applicableUserIds && !this.applicableUserIds.includes(userId)) {
      return false;
    }

    // Check role-specific restrictions
    if (this.applicableUserRoles && !this.applicableUserRoles.includes(userRole)) {
      return false;
    }

    return true;
  }

  calculateDiscount(
    orderAmount: number,
    shippingAmount: number = 0,
    applicableItems: { productId: string; categoryId: string; amount: number }[] = []
  ): { discountAmount: number; applicableAmount: number } {
    if (!this.isValid) {
      return { discountAmount: 0, applicableAmount: 0 };
    }

    // Check minimum/maximum order amount
    if (this.minOrderAmount && orderAmount < this.minOrderAmount) {
      return { discountAmount: 0, applicableAmount: 0 };
    }

    if (this.maxOrderAmount && orderAmount > this.maxOrderAmount) {
      return { discountAmount: 0, applicableAmount: 0 };
    }

    let applicableAmount = 0;
    let discountAmount = 0;

    switch (this.target) {
      case DiscountTarget.ORDER_TOTAL:
        applicableAmount = orderAmount;
        break;

      case DiscountTarget.SHIPPING:
        applicableAmount = shippingAmount;
        break;

      case DiscountTarget.SPECIFIC_PRODUCTS:
      case DiscountTarget.SPECIFIC_CATEGORIES:
        applicableAmount = this.calculateApplicableItemsAmount(applicableItems);
        break;
    }

    switch (this.type) {
      case CouponType.PERCENTAGE:
        discountAmount = (applicableAmount * this.discountValue) / 100;
        if (this.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, this.maxDiscountAmount);
        }
        break;

      case CouponType.FIXED_AMOUNT:
        discountAmount = Math.min(this.discountValue, applicableAmount);
        break;

      case CouponType.FREE_SHIPPING:
        discountAmount = this.target === DiscountTarget.SHIPPING ? shippingAmount : 0;
        break;

      case CouponType.BUY_X_GET_Y:
        // This would require more complex logic based on cart items
        discountAmount = 0;
        break;
    }

    return {
      discountAmount: Math.max(0, discountAmount),
      applicableAmount,
    };
  }

  private calculateApplicableItemsAmount(
    items: { productId: string; categoryId: string; amount: number }[]
  ): number {
    return items
      .filter(item => {
        // Check if item is applicable
        const isProductApplicable = !this.applicableProductIds ||
          this.applicableProductIds.includes(item.productId);
        const isCategoryApplicable = !this.applicableCategoryIds ||
          this.applicableCategoryIds.includes(item.categoryId);

        // Check if item is excluded
        const isProductExcluded = this.excludedProductIds &&
          this.excludedProductIds.includes(item.productId);
        const isCategoryExcluded = this.excludedCategoryIds &&
          this.excludedCategoryIds.includes(item.categoryId);

        return (isProductApplicable || isCategoryApplicable) &&
               !isProductExcluded && !isCategoryExcluded;
      })
      .reduce((total, item) => total + item.amount, 0);
  }

  addMetadata(key: string, value: any): void {
    if (!this.metadata) {
      this.metadata = {};
    }
    this.metadata[key] = value;
  }

  getMetadata(key: string): any {
    return this.metadata?.[key];
  }

  // Static methods
  static generateCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static createPercentageCoupon(
    code: string,
    name: string,
    percentage: number,
    validFrom: Date,
    validTo: Date,
    options: Partial<Coupon> = {}
  ): Partial<Coupon> {
    return {
      code,
      name,
      type: CouponType.PERCENTAGE,
      discountValue: percentage,
      validFrom,
      validTo,
      status: CouponStatus.ACTIVE,
      target: DiscountTarget.ORDER_TOTAL,
      ...options,
    };
  }

  static createFixedAmountCoupon(
    code: string,
    name: string,
    amount: number,
    validFrom: Date,
    validTo: Date,
    options: Partial<Coupon> = {}
  ): Partial<Coupon> {
    return {
      code,
      name,
      type: CouponType.FIXED_AMOUNT,
      discountValue: amount,
      validFrom,
      validTo,
      status: CouponStatus.ACTIVE,
      target: DiscountTarget.ORDER_TOTAL,
      ...options,
    };
  }

  static createFreeShippingCoupon(
    code: string,
    name: string,
    validFrom: Date,
    validTo: Date,
    options: Partial<Coupon> = {}
  ): Partial<Coupon> {
    return {
      code,
      name,
      type: CouponType.FREE_SHIPPING,
      discountValue: 0,
      validFrom,
      validTo,
      status: CouponStatus.ACTIVE,
      target: DiscountTarget.SHIPPING,
      ...options,
    };
  }
}