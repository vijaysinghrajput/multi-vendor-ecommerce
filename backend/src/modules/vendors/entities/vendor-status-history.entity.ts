import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Vendor, VendorStatus } from './vendor.entity';
import { User } from '../../users/entities/user.entity';

@Entity('vendor_status_history')
export class VendorStatusHistory {
  @ApiProperty({ description: 'Status history ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Previous status', enum: VendorStatus, required: false })
  @Column({ type: 'enum', enum: VendorStatus, nullable: true })
  previousStatus?: VendorStatus;

  @ApiProperty({ description: 'New status', enum: VendorStatus })
  @Column({ type: 'enum', enum: VendorStatus })
  newStatus: VendorStatus;

  @ApiProperty({ description: 'Reason for status change' })
  @Column('text')
  reason: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @Column('text', { nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Admin who made the change' })
  @Column()
  changedByAdminId: string;

  @ApiProperty({ description: 'Vendor ID' })
  @Column()
  vendorId: string;

  @ApiProperty({ description: 'Change timestamp' })
  @CreateDateColumn()
  changedAt: Date;

  // Relations
  @ApiProperty({ description: 'Vendor', type: () => Vendor })
  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @ApiProperty({ description: 'Admin who made the change', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'changedByAdminId' })
  changedByAdmin: User;
}