import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';

export enum CommissionType {
  FLAT = 'flat',
  PERCENTAGE = 'percentage',
}

export enum CommissionScope {
  GLOBAL = 'global',
  CATEGORY = 'category',
  VENDOR = 'vendor',
  PRODUCT = 'product',
}

@Entity('commissions')
@Index(['type', 'scope'])
@Index(['categoryId', 'vendorId'])
export class Commission {
  @ApiProperty({ description: 'Commission ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Commission name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Commission description', required: false })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'Commission type', enum: CommissionType })
  @Column({ type: 'enum', enum: CommissionType })
  type: CommissionType;

  @ApiProperty({ description: 'Commission value (percentage or flat amount)' })
  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @ApiProperty({ description: 'Commission scope', enum: CommissionScope })
  @Column({ type: 'enum', enum: CommissionScope, default: CommissionScope.GLOBAL })
  scope: CommissionScope;

  @ApiProperty({ description: 'Category ID (for category-specific commissions)', required: false })
  @Column({ nullable: true })
  categoryId?: string;

  @ApiProperty({ description: 'Vendor ID (for vendor-specific commissions)', required: false })
  @Column({ nullable: true })
  vendorId?: string;

  @ApiProperty({ description: 'Product ID (for product-specific commissions)', required: false })
  @Column({ nullable: true })
  productId?: string;

  @ApiProperty({ description: 'Is default commission' })
  @Column({ default: false })
  isDefault: boolean;

  @ApiProperty({ description: 'Is commission active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Minimum order value for commission to apply', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minOrderValue?: number;

  @ApiProperty({ description: 'Maximum order value for commission to apply', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxOrderValue?: number;

  @ApiProperty({ description: 'Commission start date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @ApiProperty({ description: 'Commission end date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @ApiProperty({ description: 'Commission priority (higher number = higher priority)' })
  @Column({ default: 0 })
  priority: number;

  @ApiProperty({ description: 'Commission creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Commission last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Commission category', type: () => Category, required: false })
  @ManyToOne(() => Category, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @ApiProperty({ description: 'Commission vendor', type: () => Vendor, required: false })
  @ManyToOne(() => Vendor, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor?: Vendor;

  // Virtual properties
  @ApiProperty({ description: 'Is commission currently active' })
  get isCurrentlyActive(): boolean {
    const now = new Date();
    const isWithinDateRange = (!this.startDate || now >= this.startDate) && 
                             (!this.endDate || now <= this.endDate);
    return this.isActive && isWithinDateRange;
  }

  @ApiProperty({ description: 'Commission display name' })
  get displayName(): string {
    if (this.scope === CommissionScope.GLOBAL) {
      return `Global ${this.name}`;
    }
    if (this.scope === CommissionScope.CATEGORY && this.category) {
      return `${this.category.name} - ${this.name}`;
    }
    if (this.scope === CommissionScope.VENDOR && this.vendor) {
      return `${this.vendor.businessName} - ${this.name}`;
    }
    return this.name;
  }
}