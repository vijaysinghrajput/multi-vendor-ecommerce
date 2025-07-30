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
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@Entity('cart_items')
export class CartItem {
  @ApiProperty({ description: 'Cart item ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Item quantity' })
  @Column({ default: 1 })
  quantity: number;

  @ApiProperty({ description: 'Item unit price at time of adding to cart' })
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @ApiProperty({ description: 'Item total price (quantity * unitPrice)' })
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({ description: 'Selected product options', required: false })
  @Column('json', { nullable: true })
  selectedOptions?: Record<string, string>;

  @ApiProperty({ description: 'Item notes', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Cart ID' })
  @Column()
  cartId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Product variant ID', required: false })
  @Column({ nullable: true })
  productVariantId?: string;

  @ApiProperty({ description: 'Cart item creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Cart item last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Cart', type: () => Cart })
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ApiProperty({ description: 'Product', type: () => Product })
  @ManyToOne(() => Product, (product) => product.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Product variant', type: () => ProductVariant, required: false })
  @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productVariantId' })
  productVariant?: ProductVariant;

  // Virtual properties
  @ApiProperty({ description: 'Effective unit price (variant price if available, otherwise product price)' })
  get effectiveUnitPrice(): number {
    return this.productVariant?.price || this.product?.price || this.unitPrice;
  }

  @ApiProperty({ description: 'Is price changed since adding to cart' })
  get isPriceChanged(): boolean {
    const currentPrice = this.effectiveUnitPrice;
    return Math.abs(currentPrice - this.unitPrice) > 0.01;
  }

  @ApiProperty({ description: 'Price difference (current - cart price)' })
  get priceDifference(): number {
    return this.effectiveUnitPrice - this.unitPrice;
  }

  @ApiProperty({ description: 'Is item available (in stock)' })
  get isAvailable(): boolean {
    if (this.productVariant) {
      return this.productVariant.isInStock && this.productVariant.stockQuantity >= this.quantity;
    }
    return this.product?.isInStock && this.product?.stockQuantity >= this.quantity;
  }

  @ApiProperty({ description: 'Available stock quantity' })
  get availableStock(): number {
    if (this.productVariant) {
      return this.productVariant.stockQuantity;
    }
    return this.product?.stockQuantity || 0;
  }

  // Methods
  updateQuantity(quantity: number): void {
    this.quantity = Math.max(1, quantity);
    this.calculateTotalPrice();
  }

  updateUnitPrice(price: number): void {
    this.unitPrice = price;
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.quantity * this.unitPrice;
  }

  syncWithCurrentPrice(): void {
    const currentPrice = this.effectiveUnitPrice;
    if (currentPrice !== this.unitPrice) {
      this.updateUnitPrice(currentPrice);
    }
  }

  canIncreaseQuantity(amount: number = 1): boolean {
    const newQuantity = this.quantity + amount;
    return this.availableStock >= newQuantity;
  }

  increaseQuantity(amount: number = 1): boolean {
    if (this.canIncreaseQuantity(amount)) {
      this.updateQuantity(this.quantity + amount);
      return true;
    }
    return false;
  }

  decreaseQuantity(amount: number = 1): boolean {
    const newQuantity = this.quantity - amount;
    if (newQuantity >= 1) {
      this.updateQuantity(newQuantity);
      return true;
    }
    return false;
  }
}