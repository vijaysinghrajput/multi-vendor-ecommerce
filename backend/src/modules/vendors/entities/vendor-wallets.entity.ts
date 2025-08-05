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
import { Vendor } from './vendor.entity';
import { VendorWalletTransactions } from './vendor-wallet-transactions.entity';

@Entity('vendor_wallets')
export class VendorWallets {
  @ApiProperty({ description: 'Wallet ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Current available balance' })
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  balance: number;

  @ApiProperty({ description: 'Total amount earned' })
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalEarned: number;

  @ApiProperty({ description: 'Total amount withdrawn' })
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalWithdrawn: number;

  @ApiProperty({ description: 'Pending withdrawal amount' })
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  pendingWithdrawal: number;

  @ApiProperty({ description: 'Total commission earned' })
  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalCommissionEarned: number;

  @ApiProperty({ description: 'Last transaction date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  lastTransactionAt?: Date;

  @ApiProperty({ description: 'Wallet status' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: 'Minimum withdrawal amount' })
  @Column('decimal', { precision: 10, scale: 2, default: 100 })
  minWithdrawalAmount: number;

  @ApiProperty({ description: 'Vendor ID' })
  @Column({ unique: true })
  vendorId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Vendor', type: () => Vendor })
  @OneToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @ApiProperty({ description: 'Wallet transactions', type: () => [VendorWalletTransactions] })
  @OneToMany(() => VendorWalletTransactions, transaction => transaction.wallet)
  transactions: VendorWalletTransactions[];
}