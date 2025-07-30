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

export enum NotificationType {
  ORDER_PLACED = 'order_placed',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PRODUCT_REVIEW = 'product_review',
  PROMOTIONAL = 'promotional',
  SYSTEM = 'system',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

@Entity('notifications')
export class Notification {
  @ApiProperty({ description: 'Notification ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Notification title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @Column('text')
  message: string;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @ApiProperty({ description: 'Notification status', enum: NotificationStatus })
  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.UNREAD })
  status: NotificationStatus;

  @ApiProperty({ description: 'Notification data', required: false })
  @Column('json', { nullable: true })
  data?: any;

  @ApiProperty({ description: 'Action URL', required: false })
  @Column({ nullable: true })
  actionUrl?: string;

  @ApiProperty({ description: 'Read at timestamp', required: false })
  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Notification creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Notification last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Methods
  markAsRead(): void {
    this.status = NotificationStatus.READ;
    this.readAt = new Date();
  }

  markAsArchived(): void {
    this.status = NotificationStatus.ARCHIVED;
  }

  @ApiProperty({ description: 'Is notification read' })
  get isRead(): boolean {
    return this.status === NotificationStatus.READ;
  }

  @ApiProperty({ description: 'Is notification archived' })
  get isArchived(): boolean {
    return this.status === NotificationStatus.ARCHIVED;
  }
}