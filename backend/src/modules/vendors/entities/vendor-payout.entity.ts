import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vendor } from './vendor.entity';

export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PayoutMethod {
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  CHECK = 'check',
  WIRE_TRANSFER = 'wire_transfer',
}

@Entity('vendor_payouts')
export class VendorPayout {
  @ApiProperty({ description: 'Payout ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Payout reference number' })
  @Column({ unique: true })
  referenceNumber: string;

  @ApiProperty({ description: 'Payout amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Payout currency' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Payout status', enum: PayoutStatus })
  @Column({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.PENDING })
  status: PayoutStatus;

  @ApiProperty({ description: 'Payout method', enum: PayoutMethod })
  @Column({ type: 'enum', enum: PayoutMethod })
  method: PayoutMethod;

  @ApiProperty({ description: 'Period start date' })
  @Column({ type: 'date' })
  periodStart: Date;

  @ApiProperty({ description: 'Period end date' })
  @Column({ type: 'date' })
  periodEnd: Date;

  @ApiProperty({ description: 'Total sales amount for the period' })
  @Column('decimal', { precision: 10, scale: 2 })
  totalSales: number;

  @ApiProperty({ description: 'Commission amount deducted' })
  @Column('decimal', { precision: 10, scale: 2 })
  commissionAmount: number;

  @ApiProperty({ description: 'Commission rate applied' })
  @Column('decimal', { precision: 5, scale: 2 })
  commissionRate: number;

  @ApiProperty({ description: 'Processing fee', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  processingFee?: number;

  @ApiProperty({ description: 'Net payout amount (after all deductions)' })
  @Column('decimal', { precision: 10, scale: 2 })
  netAmount: number;

  @ApiProperty({ description: 'Bank account details used for payout' })
  @Column('json')
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
  };

  @ApiProperty({ description: 'Transaction ID from payment processor', required: false })
  @Column({ nullable: true })
  transactionId?: string;

  @ApiProperty({ description: 'Payout notes', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Failure reason if payout failed', required: false })
  @Column('text', { nullable: true })
  failureReason?: string;

  @ApiProperty({ description: 'Payout processed at', required: false })
  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @ApiProperty({ description: 'Payout completed at', required: false })
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({ description: 'Payout failed at', required: false })
  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @Column('json', { nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Vendor ID' })
  @Column()
  vendorId: string;

  @ApiProperty({ description: 'Payout creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Payout last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Vendor', type: () => Vendor })
  @ManyToOne(() => Vendor, (vendor) => vendor.payouts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  // Virtual properties
  @ApiProperty({ description: 'Is payout pending' })
  get isPending(): boolean {
    return this.status === PayoutStatus.PENDING;
  }

  @ApiProperty({ description: 'Is payout processing' })
  get isProcessing(): boolean {
    return this.status === PayoutStatus.PROCESSING;
  }

  @ApiProperty({ description: 'Is payout completed' })
  get isCompleted(): boolean {
    return this.status === PayoutStatus.COMPLETED;
  }

  @ApiProperty({ description: 'Is payout failed' })
  get isFailed(): boolean {
    return this.status === PayoutStatus.FAILED;
  }

  @ApiProperty({ description: 'Is payout cancelled' })
  get isCancelled(): boolean {
    return this.status === PayoutStatus.CANCELLED;
  }

  @ApiProperty({ description: 'Payout period duration in days' })
  get periodDuration(): number {
    const diffTime = Math.abs(this.periodEnd.getTime() - this.periodStart.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  @ApiProperty({ description: 'Effective commission rate percentage' })
  get effectiveCommissionRate(): number {
    return this.totalSales > 0 ? (this.commissionAmount / this.totalSales) * 100 : 0;
  }

  // Methods
  markAsProcessing(): void {
    this.status = PayoutStatus.PROCESSING;
    this.processedAt = new Date();
  }

  markAsCompleted(transactionId?: string): void {
    this.status = PayoutStatus.COMPLETED;
    this.completedAt = new Date();
    if (transactionId) {
      this.transactionId = transactionId;
    }
  }

  markAsFailed(reason: string): void {
    this.status = PayoutStatus.FAILED;
    this.failedAt = new Date();
    this.failureReason = reason;
  }

  markAsCancelled(reason?: string): void {
    this.status = PayoutStatus.CANCELLED;
    if (reason) {
      this.failureReason = reason;
    }
  }

  calculateNetAmount(): void {
    let net = this.amount - this.commissionAmount;
    if (this.processingFee) {
      net -= this.processingFee;
    }
    this.netAmount = Math.max(0, net);
  }

  generateReferenceNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PAYOUT-${timestamp.slice(-6)}-${random}`;
  }

  setProcessingFee(fee: number): void {
    this.processingFee = fee;
    this.calculateNetAmount();
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

  // Static method to create payout from vendor data
  static createFromVendor(
    vendor: Vendor,
    periodStart: Date,
    periodEnd: Date,
    totalSales: number,
    method: PayoutMethod = PayoutMethod.BANK_TRANSFER
  ): Partial<VendorPayout> {
    const commissionAmount = (totalSales * vendor.commissionRate) / 100;
    const amount = totalSales - commissionAmount;

    return {
      vendorId: vendor.id,
      amount,
      totalSales,
      commissionAmount,
      commissionRate: vendor.commissionRate,
      periodStart,
      periodEnd,
      method,
      bankDetails: vendor.bankDetails,
      netAmount: amount,
    };
  }
}