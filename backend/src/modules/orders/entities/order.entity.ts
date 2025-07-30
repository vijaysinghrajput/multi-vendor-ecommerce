import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Address } from '../../address/entities/address.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  RETURNED = 'returned',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum FulfillmentStatus {
  UNFULFILLED = 'unfulfilled',
  PARTIALLY_FULFILLED = 'partially_fulfilled',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'Order ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Order number' })
  @Column({ unique: true })
  orderNumber: string;

  @ApiProperty({ description: 'Order status', enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @ApiProperty({ description: 'Fulfillment status', enum: FulfillmentStatus })
  @Column({ type: 'enum', enum: FulfillmentStatus, default: FulfillmentStatus.UNFULFILLED })
  fulfillmentStatus: FulfillmentStatus;

  @ApiProperty({ description: 'Order subtotal amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  subtotalAmount: number;

  @ApiProperty({ description: 'Tax amount' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @ApiProperty({ description: 'Shipping amount' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingAmount: number;

  @ApiProperty({ description: 'Discount amount' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @ApiProperty({ description: 'Total amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({ description: 'Order currency' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Applied coupon code', required: false })
  @Column({ nullable: true })
  couponCode?: string;

  @ApiProperty({ description: 'Order notes', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Customer notes', required: false })
  @Column('text', { nullable: true })
  customerNotes?: string;

  @ApiProperty({ description: 'Shipping method', required: false })
  @Column({ nullable: true })
  shippingMethod?: string;

  @ApiProperty({ description: 'Tracking number', required: false })
  @Column({ nullable: true })
  trackingNumber?: string;

  @ApiProperty({ description: 'Tracking URL', required: false })
  @Column({ nullable: true })
  trackingUrl?: string;

  @ApiProperty({ description: 'Estimated delivery date', required: false })
  @Column({ type: 'date', nullable: true })
  estimatedDeliveryDate?: Date;

  @ApiProperty({ description: 'Actual delivery date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @ApiProperty({ description: 'Order shipped date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  shippedAt?: Date;

  @ApiProperty({ description: 'Order confirmed date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @ApiProperty({ description: 'Order cancelled date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @ApiProperty({ description: 'Cancellation reason', required: false })
  @Column('text', { nullable: true })
  cancellationReason?: string;

  @ApiProperty({ description: 'Billing address data' })
  @Column('json')
  billingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @ApiProperty({ description: 'Shipping address data' })
  @Column('json')
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Order creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Order last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Order user', type: () => User })
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Order items', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @ApiProperty({ description: 'Order payment', type: () => Payment, required: false })
  @OneToOne(() => Payment, (payment) => payment.order, { nullable: true })
  payment?: Payment;

  // Virtual properties
  @ApiProperty({ description: 'Is order pending' })
  get isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  @ApiProperty({ description: 'Is order confirmed' })
  get isConfirmed(): boolean {
    return this.status === OrderStatus.CONFIRMED;
  }

  @ApiProperty({ description: 'Is order shipped' })
  get isShipped(): boolean {
    return this.status === OrderStatus.SHIPPED;
  }

  @ApiProperty({ description: 'Is order delivered' })
  get isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }

  @ApiProperty({ description: 'Is order cancelled' })
  get isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  @ApiProperty({ description: 'Is payment completed' })
  get isPaymentCompleted(): boolean {
    return this.paymentStatus === PaymentStatus.PAID;
  }

  @ApiProperty({ description: 'Can be cancelled' })
  get canBeCancelled(): boolean {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(this.status);
  }

  @ApiProperty({ description: 'Total items count' })
  get totalItemsCount(): number {
    return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  @ApiProperty({ description: 'Unique products count' })
  get uniqueProductsCount(): number {
    return this.items?.length || 0;
  }

  // Methods
  confirm(): void {
    this.status = OrderStatus.CONFIRMED;
    this.confirmedAt = new Date();
  }

  ship(trackingNumber?: string, trackingUrl?: string): void {
    this.status = OrderStatus.SHIPPED;
    this.shippedAt = new Date();
    if (trackingNumber) this.trackingNumber = trackingNumber;
    if (trackingUrl) this.trackingUrl = trackingUrl;
  }

  deliver(): void {
    this.status = OrderStatus.DELIVERED;
    this.deliveredAt = new Date();
    this.fulfillmentStatus = FulfillmentStatus.FULFILLED;
  }

  cancel(reason?: string): void {
    if (!this.canBeCancelled) {
      throw new Error('Order cannot be cancelled in current status');
    }
    this.status = OrderStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    this.fulfillmentStatus = FulfillmentStatus.CANCELLED;
  }

  markAsPaid(): void {
    this.paymentStatus = PaymentStatus.PAID;
  }

  markAsRefunded(): void {
    this.paymentStatus = PaymentStatus.REFUNDED;
    this.status = OrderStatus.REFUNDED;
  }

  calculateTotals(): void {
    this.subtotalAmount = this.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
    this.totalAmount = this.subtotalAmount + this.taxAmount + this.shippingAmount - this.discountAmount;
  }

  generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp.slice(-6)}-${random}`;
  }

  setEstimatedDelivery(days: number): void {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    this.estimatedDeliveryDate = deliveryDate;
  }
}