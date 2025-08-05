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
import { Vendor } from './vendor.entity';

@Entity('vendor_bank_details')
export class VendorBankDetails {
  @ApiProperty({ description: 'Bank details ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Bank name' })
  @Column()
  bankName: string;

  @ApiProperty({ description: 'Account number' })
  @Column()
  accountNumber: string;

  @ApiProperty({ description: 'IFSC code' })
  @Column()
  ifscCode: string;

  @ApiProperty({ description: 'Branch name' })
  @Column()
  branchName: string;

  @ApiProperty({ description: 'Account holder name' })
  @Column()
  accountHolderName: string;

  @ApiProperty({ description: 'Account type', required: false })
  @Column({ nullable: true })
  accountType?: string;

  @ApiProperty({ description: 'Is primary account' })
  @Column({ default: true })
  isPrimary: boolean;

  @ApiProperty({ description: 'Is verified' })
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Vendor ID' })
  @Column()
  vendorId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Vendor', type: () => Vendor })
  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;
}