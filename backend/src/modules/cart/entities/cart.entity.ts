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
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart {
  @ApiProperty({ description: 'Cart ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Cart session ID for guest users', required: false })
  @Column({ nullable: true })
  sessionId?: string;

  @ApiProperty({ description: 'Cart total amount' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @ApiProperty({ description: 'Cart total items count' })
  @Column({ default: 0 })
  totalItems: number;

  @ApiProperty({ description: 'Cart currency' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Applied coupon code', required: false })
  @Column({ nullable: true })
  couponCode?: string;

  @ApiProperty({ description: 'Discount amount', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @ApiProperty({ description: 'Tax amount', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  taxAmount?: number;

  @ApiProperty({ description: 'Shipping amount', required: false })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  shippingAmount?: number;

  @ApiProperty({ description: 'Cart notes', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Cart expiry date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @ApiProperty({ description: 'User ID', required: false })
  @Column({ nullable: true })
  userId?: string;

  @ApiProperty({ description: 'Cart creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Cart last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Cart user', type: () => User, required: false })
  @OneToOne(() => User, (user) => user.cart, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @ApiProperty({ description: 'Cart items', type: () => [CartItem] })
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  // Virtual properties
  @ApiProperty({ description: 'Is cart empty' })
  get isEmpty(): boolean {
    return this.totalItems === 0;
  }

  @ApiProperty({ description: 'Is cart expired' })
  get isExpired(): boolean {
    return this.expiresAt ? this.expiresAt < new Date() : false;
  }

  @ApiProperty({ description: 'Has discount applied' })
  get hasDiscount(): boolean {
    return !!this.discountAmount && this.discountAmount > 0;
  }

  @ApiProperty({ description: 'Subtotal amount (before discounts and taxes)' })
  get subtotalAmount(): number {
    return this.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  }

  @ApiProperty({ description: 'Final total amount (after all calculations)' })
  get finalTotalAmount(): number {
    let total = this.subtotalAmount;
    
    if (this.discountAmount) {
      total -= this.discountAmount;
    }
    
    if (this.taxAmount) {
      total += this.taxAmount;
    }
    
    if (this.shippingAmount) {
      total += this.shippingAmount;
    }
    
    return Math.max(0, total);
  }

  // Methods
  calculateTotals(): void {
    this.totalItems = this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    this.totalAmount = this.subtotalAmount;
  }

  applyCoupon(couponCode: string, discountAmount: number): void {
    this.couponCode = couponCode;
    this.discountAmount = discountAmount;
  }

  removeCoupon(): void {
    this.couponCode = null;
    this.discountAmount = null;
  }

  setExpiry(hours: number = 24): void {
    this.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  clear(): void {
    this.items = [];
    this.totalItems = 0;
    this.totalAmount = 0;
    this.discountAmount = null;
    this.couponCode = null;
    this.taxAmount = null;
    this.shippingAmount = null;
    this.notes = null;
  }
}