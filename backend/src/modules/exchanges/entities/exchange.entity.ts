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
import { User } from '../../users/entities/user.entity';

export enum ExchangeStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ExchangeReason {
  SIZE_ISSUE = 'size_issue',
  COLOR_ISSUE = 'color_issue',
  DEFECTIVE = 'defective',
  WRONG_ITEM = 'wrong_item',
  DAMAGED_IN_SHIPPING = 'damaged_in_shipping',
  PREFERENCE_CHANGE = 'preference_change',
  OTHER = 'other',
}

@Entity('exchanges')
export class Exchange {
  @ApiProperty({ description: 'Exchange ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Exchange reason', enum: ExchangeReason })
  @Column({ type: 'enum', enum: ExchangeReason })
  reason: ExchangeReason;

  @ApiProperty({ description: 'Exchange status', enum: ExchangeStatus })
  @Column({ type: 'enum', enum: ExchangeStatus, default: ExchangeStatus.PENDING })
  status: ExchangeStatus;

  @ApiProperty({ description: 'Exchange description' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Quantity to exchange' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Price difference (positive if customer pays more, negative if refund)' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  priceDifference: number;

  @ApiProperty({ description: 'Exchange images', required: false })
  @Column('json', { nullable: true })
  images?: string[];

  @ApiProperty({ description: 'Admin notes', required: false })
  @Column('text', { nullable: true })
  adminNotes?: string;

  @ApiProperty({ description: 'Tracking number for new item', required: false })
  @Column({ nullable: true })
  trackingNumber?: string;

  @ApiProperty({ description: 'Exchange approved date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @ApiProperty({ description: 'Exchange rejected date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @ApiProperty({ description: 'Exchange shipped date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  shippedAt?: Date;

  @ApiProperty({ description: 'Exchange completed date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({ description: 'Original order item ID' })
  @Column()
  orderItemId: string;

  @ApiProperty({ description: 'New product variant ID' })
  @Column()
  newVariantId: string;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Exchange creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Exchange last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  // OrderItem and ProductVariant relations will be added when entities are available

  @ApiProperty({ description: 'User who requested exchange', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}