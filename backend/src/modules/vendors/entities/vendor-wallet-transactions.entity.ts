import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vendor } from './vendor.entity';
import { VendorWallets } from './vendor-wallets.entity';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionReason {
  ORDER_COMMISSION = 'order_commission',
  WITHDRAWAL = 'withdrawal',
  REFUND = 'refund',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
  PENALTY = 'penalty',
  BONUS = 'bonus',
  SETTLEMENT = 'settlement',
}

@Entity('vendor_wallet_transactions')
export class VendorWalletTransactions {
  @ApiProperty({ description: 'Transaction ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Transaction amount' })
  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType })
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @ApiProperty({ description: 'Transaction reason', enum: TransactionReason })
  @Column({ type: 'enum', enum: TransactionReason })
  reason: TransactionReason;

  @ApiProperty({ description: 'Transaction description' })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Reference ID (order, withdrawal, etc.)', required: false })
  @Column({ nullable: true })
  referenceId?: string;

  @ApiProperty({ description: 'Balance before transaction' })
  @Column('decimal', { precision: 15, scale: 2 })
  balanceBefore: number;

  @ApiProperty({ description: 'Balance after transaction' })
  @Column('decimal', { precision: 15, scale: 2 })
  balanceAfter: number;

  @ApiProperty({ description: 'Admin who processed (if applicable)', required: false })
  @Column({ nullable: true })
  processedByAdminId?: string;

  @ApiProperty({ description: 'Transaction status' })
  @Column({ default: 'completed' })
  status: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @Column('json', { nullable: true })
  metadata?: any;

  @ApiProperty({ description: 'Vendor ID' })
  @Column()
  vendorId: string;

  @ApiProperty({ description: 'Wallet ID' })
  @Column()
  walletId: string;

  @ApiProperty({ description: 'Transaction timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ApiProperty({ description: 'Vendor', type: () => Vendor })
  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @ApiProperty({ description: 'Wallet', type: () => VendorWallets })
  @ManyToOne(() => VendorWallets, wallet => wallet.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: VendorWallets;
}