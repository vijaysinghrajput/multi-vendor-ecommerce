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
import { WishlistItem } from './wishlist-item.entity';

@Entity('wishlists')
export class Wishlist {
  @ApiProperty({ description: 'Wishlist ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Wishlist name' })
  @Column({ default: 'My Wishlist' })
  name: string;

  @ApiProperty({ description: 'Wishlist description', required: false })
  @Column('text', { nullable: true })
  description?: string;

  @ApiProperty({ description: 'Is wishlist public' })
  @Column({ default: false })
  isPublic: boolean;

  @ApiProperty({ description: 'Total items count' })
  @Column({ default: 0 })
  totalItems: number;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Wishlist creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Wishlist last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Wishlist user', type: () => User })
  @OneToOne(() => User, (user) => user.wishlist)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Wishlist items', type: () => [WishlistItem] })
  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.wishlist, { cascade: true })
  items: WishlistItem[];

  // Virtual properties
  @ApiProperty({ description: 'Is wishlist empty' })
  get isEmpty(): boolean {
    return this.totalItems === 0;
  }

  @ApiProperty({ description: 'Total value of wishlist items' })
  get totalValue(): number {
    return this.items?.reduce((sum, item) => {
      const price = item.productVariant?.price || item.product?.price || 0;
      return sum + price;
    }, 0) || 0;
  }

  @ApiProperty({ description: 'Available items count (in stock)' })
  get availableItemsCount(): number {
    return this.items?.filter(item => {
      if (item.productVariant) {
        return item.productVariant.isInStock;
      }
      return item.product?.isInStock;
    }).length || 0;
  }

  @ApiProperty({ description: 'Out of stock items count' })
  get outOfStockItemsCount(): number {
    return this.totalItems - this.availableItemsCount;
  }

  // Methods
  updateTotalItems(): void {
    this.totalItems = this.items?.length || 0;
  }

  hasProduct(productId: string, variantId?: string): boolean {
    return this.items?.some(item => {
      if (variantId) {
        return item.productId === productId && item.productVariantId === variantId;
      }
      return item.productId === productId;
    }) || false;
  }

  findItem(productId: string, variantId?: string): WishlistItem | undefined {
    return this.items?.find(item => {
      if (variantId) {
        return item.productId === productId && item.productVariantId === variantId;
      }
      return item.productId === productId;
    });
  }

  removeItem(productId: string, variantId?: string): boolean {
    const initialLength = this.items?.length || 0;
    this.items = this.items?.filter(item => {
      if (variantId) {
        return !(item.productId === productId && item.productVariantId === variantId);
      }
      return item.productId !== productId;
    }) || [];
    
    const removed = this.items.length < initialLength;
    if (removed) {
      this.updateTotalItems();
    }
    return removed;
  }

  clear(): void {
    this.items = [];
    this.totalItems = 0;
  }

  makePublic(): void {
    this.isPublic = true;
  }

  makePrivate(): void {
    this.isPublic = false;
  }
}