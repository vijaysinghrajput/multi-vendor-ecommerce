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
import { Product } from '../../products/entities/product.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('reviews')
export class Review {
  @ApiProperty({ description: 'Review ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Review title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Review comment' })
  @Column('text')
  comment: string;

  @ApiProperty({ description: 'Review rating (1-5)' })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty({ description: 'Review status', enum: ReviewStatus })
  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @ApiProperty({ description: 'Review images', required: false })
  @Column('simple-array', { nullable: true })
  images?: string[];

  @ApiProperty({ description: 'Is verified purchase' })
  @Column({ default: false })
  isVerifiedPurchase: boolean;

  @ApiProperty({ description: 'Helpful votes count' })
  @Column({ default: 0 })
  helpfulVotes: number;

  @ApiProperty({ description: 'Not helpful votes count' })
  @Column({ default: 0 })
  notHelpfulVotes: number;

  @ApiProperty({ description: 'Vendor response', required: false })
  @Column('text', { nullable: true })
  vendorResponse?: string;

  @ApiProperty({ description: 'Vendor response date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  vendorResponseAt?: Date;

  @ApiProperty({ description: 'User ID' })
  @Column()
  userId: string;

  @ApiProperty({ description: 'Product ID' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Review creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Review last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Review user', type: () => User })
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Review product', type: () => Product })
  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // Virtual properties
  @ApiProperty({ description: 'Is review approved' })
  get isApproved(): boolean {
    return this.status === ReviewStatus.APPROVED;
  }

  @ApiProperty({ description: 'Is review pending' })
  get isPending(): boolean {
    return this.status === ReviewStatus.PENDING;
  }

  @ApiProperty({ description: 'Is review rejected' })
  get isRejected(): boolean {
    return this.status === ReviewStatus.REJECTED;
  }

  @ApiProperty({ description: 'Total votes count' })
  get totalVotes(): number {
    return this.helpfulVotes + this.notHelpfulVotes;
  }

  @ApiProperty({ description: 'Helpful percentage' })
  get helpfulPercentage(): number {
    if (this.totalVotes === 0) return 0;
    return Math.round((this.helpfulVotes / this.totalVotes) * 100);
  }

  @ApiProperty({ description: 'Has vendor response' })
  get hasVendorResponse(): boolean {
    return !!this.vendorResponse;
  }

  // Methods
  approve(): void {
    this.status = ReviewStatus.APPROVED;
  }

  reject(): void {
    this.status = ReviewStatus.REJECTED;
  }

  addVendorResponse(response: string): void {
    this.vendorResponse = response;
    this.vendorResponseAt = new Date();
  }

  incrementHelpfulVotes(): void {
    this.helpfulVotes += 1;
  }

  incrementNotHelpfulVotes(): void {
    this.notHelpfulVotes += 1;
  }
}