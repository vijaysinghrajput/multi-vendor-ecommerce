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
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'Order item ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Item quantity' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Item unit price at time of order' })
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @ApiProperty({ description: 'Item total price (quantity * unitPrice)' })
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({ description: 'Product name at time of order' })
  @Column()
  productName: string;

  @ApiProperty({ description: 'Product SKU at time of order' })
  @Column()
  productSku: string;

  @ApiProperty({ description: 'Selected product options at time of order', required: false })
  @Column('json', { nullable: true })
  selectedOptions?: Record<string, string>;

  @ApiProperty({ description: 'Product image URL at time of order', required: false })
  @Column({ nullable: true })
  productImageUrl?: string;

  @ApiProperty({ description: 'Item weight in grams', required: false })
  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  weight?: number;

  @ApiProperty({ description: 'Item notes', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Order ID' })
  @Column()
  orderId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Product variant ID', required: false })
  @Column({ nullable: true })
  productVariantId?: string;

  @ApiProperty({ description: 'Order item creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Order item last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Order', type: () => Order })
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ApiProperty({ description: 'Product', type: () => Product })
  @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ description: 'Product variant', type: () => ProductVariant, required: false })
  @ManyToOne(() => ProductVariant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productVariantId' })
  productVariant?: ProductVariant;

  // Virtual properties
  @ApiProperty({ description: 'Item display name' })
  get displayName(): string {
    let name = this.productName;
    if (this.selectedOptions && Object.keys(this.selectedOptions).length > 0) {
      const optionValues = Object.values(this.selectedOptions).filter(Boolean);
      if (optionValues.length > 0) {
        name += ` (${optionValues.join(' / ')})`;
      }
    }
    return name;
  }

  @ApiProperty({ description: 'Total weight (quantity * unit weight)' })
  get totalWeight(): number {
    return this.weight ? this.weight * this.quantity : 0;
  }

  // Methods
  calculateTotalPrice(): void {
    this.totalPrice = this.quantity * this.unitPrice;
  }

  updateQuantity(quantity: number): void {
    this.quantity = Math.max(1, quantity);
    this.calculateTotalPrice();
  }

  updateUnitPrice(price: number): void {
    this.unitPrice = price;
    this.calculateTotalPrice();
  }

  // Static method to create from cart item
  static fromCartItem(cartItem: any, orderId: string): Partial<OrderItem> {
    return {
      orderId,
      productId: cartItem.productId,
      productVariantId: cartItem.productVariantId,
      quantity: cartItem.quantity,
      unitPrice: cartItem.unitPrice,
      totalPrice: cartItem.totalPrice,
      productName: cartItem.product?.name || 'Unknown Product',
      productSku: cartItem.productVariant?.sku || cartItem.product?.sku || 'N/A',
      selectedOptions: cartItem.selectedOptions,
      productImageUrl: cartItem.product?.primaryImageUrl,
      weight: cartItem.productVariant?.weight || cartItem.product?.weight,
      notes: cartItem.notes,
    };
  }
}