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

export enum ReturnStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ReturnReason {
  DEFECTIVE = 'defective',
  WRONG_ITEM = 'wrong_item',
  NOT_AS_DESCRIBED = 'not_as_described',
  DAMAGED_IN_SHIPPING = 'damaged_in_shipping',
  CHANGED_MIND = 'changed_mind',
  SIZE_ISSUE = 'size_issue',
  OTHER = 'other',
}

@Entity('returns')
export class Return {
  @ApiProperty({ description: 'Return ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Return reason', enum: ReturnReason })
  @Column({ type: 'enum', enum: ReturnReason })
  reason: ReturnReason;

  @ApiProperty({ description: 'Return status', enum: ReturnStatus })
  @Column({ type: 'enum', enum: ReturnStatus, default: ReturnStatus.PENDING })
  status: ReturnStatus;

  @ApiProperty({ description: 'Return description' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Quantity to return' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Refund amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  refundAmount: number;

  @ApiProperty({ description: 'Return images', required: false })
  @Column('json', { nullable: true })
  images?: string[];

  @ApiProperty({ description: 'Admin notes', required: false })
  @Column('text', { nullable: true })
  adminNotes?: string;

  @ApiProperty({ description: 'Refund processed date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  refundProcessedAt?: Date;

  @ApiProperty({ description: 'Return approved date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @ApiProperty({ description: 'Return rejected date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @ApiProperty({ description: 'Order item ID' })
  @Column()
  orderItemId: string;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Return creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Return last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  // OrderItem relation will be added when OrderItem entity is available

  @ApiProperty({ description: 'User who requested return', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}