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
import { Product } from './product.entity';

export enum VariantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity('product_variants')
export class ProductVariant {
  @ApiProperty({ description: 'Product variant ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Variant name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Variant SKU' })
  @Column({ unique: true })
  sku: string;

  @ApiProperty({ description: 'Variant price' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Variant compare price', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  comparePrice?: number;

  @ApiProperty({ description: 'Variant cost price', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costPrice?: number;

  @ApiProperty({ description: 'Variant weight in grams', required: false })
  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  weight?: number;

  @ApiProperty({ description: 'Variant stock quantity' })
  @Column({ default: 0 })
  stockQuantity: number;

  @ApiProperty({ description: 'Variant status', enum: VariantStatus })
  @Column({ type: 'enum', enum: VariantStatus, default: VariantStatus.ACTIVE })
  status: VariantStatus;

  @ApiProperty({ description: 'Variant options (e.g., color, size)' })
  @Column('json')
  options: Record<string, string>; // e.g., { "color": "red", "size": "M" }

  @ApiProperty({ description: 'Variant image URL', required: false })
  @Column({ nullable: true })
  imageUrl?: string;

  @ApiProperty({ description: 'Variant barcode', required: false })
  @Column({ nullable: true })
  barcode?: string;

  @ApiProperty({ description: 'Display order' })
  @Column({ default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Product ID' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Variant creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Variant last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // Virtual properties
  @ApiProperty({ description: 'Is variant on sale' })
  get isOnSale(): boolean {
    return this.comparePrice && this.comparePrice > this.price;
  }

  @ApiProperty({ description: 'Discount percentage' })
  get discountPercentage(): number {
    if (!this.comparePrice || this.comparePrice <= this.price) {
      return 0;
    }
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }

  @ApiProperty({ description: 'Is variant in stock' })
  get isInStock(): boolean {
    return this.stockQuantity > 0;
  }

  @ApiProperty({ description: 'Variant display name' })
  get displayName(): string {
    const optionValues = Object.values(this.options).filter(Boolean);
    return optionValues.length > 0 ? optionValues.join(' / ') : this.name;
  }

  // Methods
  decreaseStock(quantity: number): void {
    this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
    if (this.stockQuantity === 0) {
      this.status = VariantStatus.OUT_OF_STOCK;
    }
  }

  increaseStock(quantity: number): void {
    this.stockQuantity += quantity;
    if (this.status === VariantStatus.OUT_OF_STOCK && this.stockQuantity > 0) {
      this.status = VariantStatus.ACTIVE;
    }
  }
}