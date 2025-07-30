import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  RAZORPAY = 'razorpay',
  CASHFREE = 'cashfree',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  COD = 'cod', // Cash on Delivery
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentGateway {
  STRIPE = 'stripe',
  RAZORPAY = 'razorpay',
  CASHFREE = 'cashfree',
  PAYPAL = 'paypal',
  MANUAL = 'manual',
}

@Entity('payments')
export class Payment {
  @ApiProperty({ description: 'Payment ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Payment reference number' })
  @Column({ unique: true })
  referenceNumber: string;

  @ApiProperty({ description: 'Payment amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Payment currency' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Payment method', enum: PaymentMethod })
  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty({ description: 'Payment gateway', enum: PaymentGateway })
  @Column({ type: 'enum', enum: PaymentGateway })
  gateway: PaymentGateway;

  @ApiProperty({ description: 'Gateway transaction ID', required: false })
  @Column({ nullable: true })
  gatewayTransactionId?: string;

  @ApiProperty({ description: 'Gateway payment ID', required: false })
  @Column({ nullable: true })
  gatewayPaymentId?: string;

  @ApiProperty({ description: 'Gateway response data', required: false })
  @Column('json', { nullable: true })
  gatewayResponse?: any;

  @ApiProperty({ description: 'Payment description', required: false })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'Payment notes', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Processing fee amount', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  processingFee?: number;

  @ApiProperty({ description: 'Net amount (amount - processing fee)', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  netAmount?: number;

  @ApiProperty({ description: 'Refunded amount', required: false })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  refundedAmount: number;

  @ApiProperty({ description: 'Payment processed at', required: false })
  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @ApiProperty({ description: 'Payment failed at', required: false })
  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  @ApiProperty({ description: 'Payment refunded at', required: false })
  @Column({ type: 'timestamp', nullable: true })
  refundedAt?: Date;

  @ApiProperty({ description: 'Failure reason', required: false })
  @Column('text', { nullable: true })
  failureReason?: string;

  @ApiProperty({ description: 'Payment metadata', required: false })
  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Order ID' })
  @Column()
  orderId: string;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Payment creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Payment last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Payment order', type: () => Order })
  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({ description: 'Payment user', type: () => User })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Virtual properties
  @ApiProperty({ description: 'Is payment pending' })
  get isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  @ApiProperty({ description: 'Is payment processing' })
  get isProcessing(): boolean {
    return this.status === PaymentStatus.PROCESSING;
  }

  @ApiProperty({ description: 'Is payment completed' })
  get isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  @ApiProperty({ description: 'Is payment failed' })
  get isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  @ApiProperty({ description: 'Is payment refunded' })
  get isRefunded(): boolean {
    return this.status === PaymentStatus.REFUNDED;
  }

  @ApiProperty({ description: 'Is payment partially refunded' })
  get isPartiallyRefunded(): boolean {
    return this.status === PaymentStatus.PARTIALLY_REFUNDED;
  }

  @ApiProperty({ description: 'Can be refunded' })
  get canBeRefunded(): boolean {
    return this.isCompleted && this.refundedAmount < this.amount;
  }

  @ApiProperty({ description: 'Remaining refundable amount' })
  get refundableAmount(): number {
    return Math.max(0, this.amount - this.refundedAmount);
  }

  // Methods
  markAsProcessing(): void {
    this.status = PaymentStatus.PROCESSING;
  }

  markAsCompleted(gatewayTransactionId?: string, gatewayResponse?: any): void {
    this.status = PaymentStatus.COMPLETED;
    this.processedAt = new Date();
    if (gatewayTransactionId) this.gatewayTransactionId = gatewayTransactionId;
    if (gatewayResponse) this.gatewayResponse = gatewayResponse;
    
    // Calculate net amount if processing fee is available
    if (this.processingFee) {
      this.netAmount = this.amount - this.processingFee;
    }
  }

  markAsFailed(reason?: string, gatewayResponse?: any): void {
    this.status = PaymentStatus.FAILED;
    this.failedAt = new Date();
    this.failureReason = reason;
    if (gatewayResponse) this.gatewayResponse = gatewayResponse;
  }

  markAsCancelled(): void {
    this.status = PaymentStatus.CANCELLED;
  }

  processRefund(amount: number): void {
    if (!this.canBeRefunded) {
      throw new Error('Payment cannot be refunded');
    }
    
    if (amount > this.refundableAmount) {
      throw new Error('Refund amount exceeds refundable amount');
    }
    
    this.refundedAmount += amount;
    this.refundedAt = new Date();
    
    if (this.refundedAmount >= this.amount) {
      this.status = PaymentStatus.REFUNDED;
    } else {
      this.status = PaymentStatus.PARTIALLY_REFUNDED;
    }
  }

  generateReferenceNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp.slice(-6)}-${random}`;
  }

  setProcessingFee(fee: number): void {
    this.processingFee = fee;
    this.netAmount = this.amount - fee;
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
}