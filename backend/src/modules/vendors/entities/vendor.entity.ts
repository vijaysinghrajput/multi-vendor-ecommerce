import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { VendorPayout } from './vendor-payout.entity';

export enum VendorStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

export enum VendorType {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
}

@Entity('vendors')
export class Vendor {
  @ApiProperty({ description: 'Vendor ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Vendor business name' })
  @Column()
  businessName: string;

  @ApiProperty({ description: 'Vendor display name' })
  @Column()
  displayName: string;

  @ApiProperty({ description: 'Vendor slug' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ description: 'Vendor description', required: false })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'Vendor logo URL', required: false })
  @Column({ nullable: true })
  logo?: string;

  @ApiProperty({ description: 'Vendor banner URL', required: false })
  @Column({ nullable: true })
  banner?: string;

  @ApiProperty({ description: 'Vendor type', enum: VendorType })
  @Column({ type: 'enum', enum: VendorType, default: VendorType.INDIVIDUAL })
  type: VendorType;

  @ApiProperty({ description: 'Vendor status', enum: VendorStatus })
  @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.PENDING })
  status: VendorStatus;

  @ApiProperty({ description: 'Business registration number', required: false })
  @Column({ nullable: true })
  businessRegistrationNumber?: string;

  @ApiProperty({ description: 'Tax identification number', required: false })
  @Column({ nullable: true })
  taxId?: string;

  @ApiProperty({ description: 'Business address' })
  @Column('json')
  businessAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @ApiProperty({ description: 'Business phone number' })
  @Column()
  businessPhone: string;

  @ApiProperty({ description: 'Business email' })
  @Column()
  businessEmail: string;

  @ApiProperty({ description: 'Business website', required: false })
  @Column({ nullable: true })
  website?: string;

  @ApiProperty({ description: 'Commission rate (percentage)' })
  @Column('decimal', { precision: 5, scale: 2, default: 10.00 })
  commissionRate: number;

  @ApiProperty({ description: 'Bank account details' })
  @Column('json')
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
  };

  @ApiProperty({ description: 'Vendor rating' })
  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @ApiProperty({ description: 'Total reviews count' })
  @Column({ default: 0 })
  reviewsCount: number;

  @ApiProperty({ description: 'Total sales count' })
  @Column({ default: 0 })
  salesCount: number;

  @ApiProperty({ description: 'Total revenue' })
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalRevenue: number;

  @ApiProperty({ description: 'Pending payout amount' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  pendingPayout: number;

  @ApiProperty({ description: 'Social media links', required: false })
  @Column('json', { nullable: true })
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };

  @ApiProperty({ description: 'Business hours', required: false })
  @Column('json', { nullable: true })
  businessHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };

  @ApiProperty({ description: 'Vendor verification documents', required: false })
  @Column('json', { nullable: true })
  verificationDocuments?: {
    businessLicense?: string;
    taxCertificate?: string;
    identityProof?: string;
    addressProof?: string;
  };

  @ApiProperty({ description: 'Verification status' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Verification date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @ApiProperty({ description: 'Rejection reason', required: false })
  @Column('text', { nullable: true })
  rejectionReason?: string;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Vendor creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Vendor last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Vendor user', type: () => User })
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Vendor products', type: () => [Product] })
  @OneToMany(() => Product, (product) => product.vendor)
  products: Product[];

  @ApiProperty({ description: 'Vendor payouts', type: () => [VendorPayout] })
  @OneToMany(() => VendorPayout, (payout) => payout.vendor)
  payouts: VendorPayout[];

  // Virtual properties
  @ApiProperty({ description: 'Is vendor active' })
  get isActive(): boolean {
    return this.status === VendorStatus.ACTIVE;
  }

  @ApiProperty({ description: 'Is vendor pending' })
  get isPending(): boolean {
    return this.status === VendorStatus.PENDING;
  }

  @ApiProperty({ description: 'Is vendor suspended' })
  get isSuspended(): boolean {
    return this.status === VendorStatus.SUSPENDED;
  }

  @ApiProperty({ description: 'Is vendor rejected' })
  get isRejected(): boolean {
    return this.status === VendorStatus.REJECTED;
  }

  @ApiProperty({ description: 'Average order value' })
  get averageOrderValue(): number {
    return this.salesCount > 0 ? this.totalRevenue / this.salesCount : 0;
  }

  @ApiProperty({ description: 'Commission earned' })
  get commissionEarned(): number {
    return (this.totalRevenue * this.commissionRate) / 100;
  }

  @ApiProperty({ description: 'Net earnings (after commission)' })
  get netEarnings(): number {
    return this.totalRevenue - this.commissionEarned;
  }

  // Methods
  approve(): void {
    this.status = VendorStatus.ACTIVE;
    this.isVerified = true;
    this.verifiedAt = new Date();
    this.rejectionReason = null;
  }

  reject(reason: string): void {
    this.status = VendorStatus.REJECTED;
    this.rejectionReason = reason;
    this.isVerified = false;
  }

  suspend(reason?: string): void {
    this.status = VendorStatus.SUSPENDED;
    if (reason) {
      this.rejectionReason = reason;
    }
  }

  reactivate(): void {
    this.status = VendorStatus.ACTIVE;
    this.rejectionReason = null;
  }

  updateRating(newRating: number): void {
    // This would typically be calculated from actual reviews
    this.rating = newRating;
  }

  incrementSales(amount: number): void {
    this.salesCount += 1;
    this.totalRevenue += amount;
    this.pendingPayout += amount - (amount * this.commissionRate) / 100;
  }

  processPayout(amount: number): void {
    this.pendingPayout = Math.max(0, this.pendingPayout - amount);
  }

  updateCommissionRate(rate: number): void {
    this.commissionRate = Math.max(0, Math.min(100, rate));
  }

  addVerificationDocument(type: string, url: string): void {
    if (!this.verificationDocuments) {
      this.verificationDocuments = {};
    }
    this.verificationDocuments[type] = url;
  }

  updateBusinessHours(day: string, hours: { open: string; close: string; closed?: boolean }): void {
    if (!this.businessHours) {
      this.businessHours = {};
    }
    this.businessHours[day] = hours;
  }
}