import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Review } from '../../reviews/entities/review.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { WishlistItem } from '../../wishlist/entities/wishlist-item.entity';

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Entity('products')
export class Product {
  @ApiProperty({ description: 'Product ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Product name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Product slug' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ description: 'Product description' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Product short description', required: false })
  @Column('text', { nullable: true })
  shortDescription?: string;

  @ApiProperty({ description: 'Product SKU' })
  @Column({ unique: true })
  sku: string;

  @ApiProperty({ description: 'Product price' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Product compare price', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  comparePrice?: number;

  @ApiProperty({ description: 'Product cost price', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costPrice?: number;

  @ApiProperty({ description: 'Product weight in grams', required: false })
  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  weight?: number;

  @ApiProperty({ description: 'Product dimensions', required: false })
  @Column('json', { nullable: true })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @ApiProperty({ description: 'Product stock quantity' })
  @Column({ default: 0 })
  stockQuantity: number;

  @ApiProperty({ description: 'Low stock threshold' })
  @Column({ default: 10 })
  lowStockThreshold: number;

  @ApiProperty({ description: 'Track quantity' })
  @Column({ default: true })
  trackQuantity: boolean;

  @ApiProperty({ description: 'Allow backorders' })
  @Column({ default: false })
  allowBackorders: boolean;

  @ApiProperty({ description: 'Product status', enum: ProductStatus })
  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @ApiProperty({ description: 'Product visibility' })
  @Column({ default: true })
  isVisible: boolean;

  @ApiProperty({ description: 'Featured product' })
  @Column({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Digital product' })
  @Column({ default: false })
  isDigital: boolean;

  @ApiProperty({ description: 'Product tags', required: false })
  @Column('simple-array', { nullable: true })
  tags?: string[];

  @ApiProperty({ description: 'SEO meta title', required: false })
  @Column({ nullable: true })
  metaTitle?: string;

  @ApiProperty({ description: 'SEO meta description', required: false })
  @Column('text', { nullable: true })
  metaDescription?: string;

  @ApiProperty({ description: 'SEO meta keywords', required: false })
  @Column('text', { nullable: true })
  metaKeywords?: string;

  @ApiProperty({ description: 'Average rating' })
  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @ApiProperty({ description: 'Total reviews count' })
  @Column({ default: 0 })
  reviewsCount: number;

  @ApiProperty({ description: 'Total sales count' })
  @Column({ default: 0 })
  salesCount: number;

  @ApiProperty({ description: 'Category ID' })
  @Column()
  categoryId: string;

  @ApiProperty({ description: 'Vendor ID' })
  @Column()
  vendorId: string;

  @ApiProperty({ description: 'Product creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Product last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Product category', type: () => Category })
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty({ description: 'Product vendor', type: () => User })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: User;

  @ApiProperty({ description: 'Product images', type: () => [ProductImage] })
  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @ApiProperty({ description: 'Product variants', type: () => [ProductVariant] })
  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants: ProductVariant[];

  @ApiProperty({ description: 'Product reviews', type: () => [Review] })
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ApiProperty({ description: 'Cart items', type: () => [CartItem] })
  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @ApiProperty({ description: 'Order items', type: () => [OrderItem] })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ApiProperty({ description: 'Wishlist items', type: () => [WishlistItem] })
  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.product)
  wishlistItems: WishlistItem[];

  // Virtual properties
  @ApiProperty({ description: 'Is product on sale' })
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

  @ApiProperty({ description: 'Is product in stock' })
  get isInStock(): boolean {
    if (!this.trackQuantity) return true;
    return this.stockQuantity > 0 || this.allowBackorders;
  }

  @ApiProperty({ description: 'Is low stock' })
  get isLowStock(): boolean {
    if (!this.trackQuantity) return false;
    return this.stockQuantity <= this.lowStockThreshold && this.stockQuantity > 0;
  }

  @ApiProperty({ description: 'Primary image URL' })
  get primaryImageUrl(): string | null {
    const primaryImage = this.images?.find(img => img.isPrimary) || this.images?.[0];
    return primaryImage?.url || null;
  }

  // Methods
  updateAverageRating(): void {
    if (!this.reviews || this.reviews.length === 0) {
      this.averageRating = 0;
      this.reviewsCount = 0;
      return;
    }

    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.reviewsCount = this.reviews.length;
  }

  decreaseStock(quantity: number): void {
    if (this.trackQuantity) {
      this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
      if (this.stockQuantity === 0 && !this.allowBackorders) {
        this.status = ProductStatus.OUT_OF_STOCK;
      }
    }
  }

  increaseStock(quantity: number): void {
    if (this.trackQuantity) {
      this.stockQuantity += quantity;
      if (this.status === ProductStatus.OUT_OF_STOCK && this.stockQuantity > 0) {
        this.status = ProductStatus.ACTIVE;
      }
    }
  }

  incrementSalesCount(): void {
    this.salesCount += 1;
  }
}