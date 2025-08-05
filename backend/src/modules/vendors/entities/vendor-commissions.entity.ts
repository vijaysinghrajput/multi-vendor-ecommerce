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

export interface CategoryCommission {
  categoryId: string;
  categoryName: string;
  commissionPercent: number;
}

@Entity('vendor_commissions')
export class VendorCommissions {
  @ApiProperty({ description: 'Commission ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Default commission percentage' })
  @Column('decimal', { precision: 5, scale: 2 })
  commissionPercent: number;

  @ApiProperty({ description: 'Category-based commission rates', required: false })
  @Column('json', { nullable: true })
  categoryBased?: CategoryCommission[];

  @ApiProperty({ description: 'Is active commission rule' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Effective from date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  effectiveFrom: Date;

  @ApiProperty({ description: 'Effective until date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  effectiveUntil?: Date;

  @ApiProperty({ description: 'Notes about commission', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Created by admin ID' })
  @Column()
  createdByAdminId: string;

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