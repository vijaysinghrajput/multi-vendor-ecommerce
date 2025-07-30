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
import { Wishlist } from './wishlist.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@Entity('wishlist_items')
export class WishlistItem {
  @ApiProperty({ description: 'Wishlist item ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Item notes', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Item priority (1-5)', required: false })
  @Column({ type: 'int', nullable: true })
  priority?: number;

  @ApiProperty({ description: 'Desired quantity' })
  @Column({ default: 1 })
  desiredQuantity: number;

  @ApiProperty({ description: 'Price when added to wishlist' })
  @Column('decimal', { precision: 10, scale: 2 })
  priceWhenAdded: number;

  @ApiProperty({ description: 'Wishlist ID' })
  @Column()
  wishlistId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Product variant ID', required: false })
  @Column({ nullable: true })
  productVariantId?: string;

  @ApiProperty({ description: 'Wishlist item creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Wishlist item last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Wishlist', type: () => Wishlist })
  @ManyToOne(() => Wishlist, (wishlist) => wishlist.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wishlistId' })
  wishlist: Wishlist;

  @ApiProperty({ description: 'Product', type: () => Product })
  @ManyToOne(() => Product, (product) => product.wishlistItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Product variant', type: () => ProductVariant, required: false })
  @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productVariantId' })
  productVariant?: ProductVariant;

  // Virtual properties
  @ApiProperty({ description: 'Current price (variant price if available, otherwise product price)' })
  get currentPrice(): number {
    return this.productVariant?.price || this.product?.price || 0;
  }

  @ApiProperty({ description: 'Price difference (current - when added)' })
  get priceDifference(): number {
    return this.currentPrice - this.priceWhenAdded;
  }

  @ApiProperty({ description: 'Is price decreased since adding to wishlist' })
  get isPriceDecreased(): boolean {
    return this.priceDifference < -0.01;
  }

  @ApiProperty({ description: 'Is price increased since adding to wishlist' })
  get isPriceIncreased(): boolean {
    return this.priceDifference > 0.01;
  }

  @ApiProperty({ description: 'Price change percentage' })
  get priceChangePercentage(): number {
    if (this.priceWhenAdded === 0) return 0;
    return Math.round((this.priceDifference / this.priceWhenAdded) * 100);
  }

  @ApiProperty({ description: 'Is item available (in stock)' })
  get isAvailable(): boolean {
    if (this.productVariant) {
      return this.productVariant.isInStock;
    }
    return this.product?.isInStock || false;
  }

  @ApiProperty({ description: 'Available stock quantity' })
  get availableStock(): number {
    if (this.productVariant) {
      return this.productVariant.stockQuantity;
    }
    return this.product?.stockQuantity || 0;
  }

  @ApiProperty({ description: 'Can fulfill desired quantity' })
  get canFulfillDesiredQuantity(): boolean {
    return this.availableStock >= this.desiredQuantity;
  }

  @ApiProperty({ description: 'Item display name' })
  get displayName(): string {
    let name = this.product?.name || 'Unknown Product';
    if (this.productVariant) {
      name += ` (${this.productVariant.displayName})`;
    }
    return name;
  }

  // Methods
  updateDesiredQuantity(quantity: number): void {
    this.desiredQuantity = Math.max(1, quantity);
  }

  updatePriority(priority: number): void {
    this.priority = Math.max(1, Math.min(5, priority));
  }

  syncCurrentPrice(): void {
    this.priceWhenAdded = this.currentPrice;
  }

  addNotes(notes: string): void {
    this.notes = notes;
  }

  clearNotes(): void {
    this.notes = null;
  }
}