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

export enum DocumentType {
  GST = 'gst',
  PAN = 'pan',
  CHEQUE = 'cheque',
  CERTIFICATE = 'certificate',
  BUSINESS_LICENSE = 'business_license',
  IDENTITY_PROOF = 'identity_proof',
  ADDRESS_PROOF = 'address_proof',
  TAX_CERTIFICATE = 'tax_certificate',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('vendor_documents')
export class VendorDocuments {
  @ApiProperty({ description: 'Document ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Document type', enum: DocumentType })
  @Column({ type: 'enum', enum: DocumentType })
  documentType: DocumentType;

  @ApiProperty({ description: 'File URL' })
  @Column()
  fileUrl: string;

  @ApiProperty({ description: 'Original filename' })
  @Column()
  originalFilename: string;

  @ApiProperty({ description: 'File size in bytes' })
  @Column()
  fileSize: number;

  @ApiProperty({ description: 'MIME type' })
  @Column()
  mimeType: string;

  @ApiProperty({ description: 'Document status', enum: DocumentStatus })
  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @ApiProperty({ description: 'Verification notes', required: false })
  @Column('text', { nullable: true })
  verificationNotes?: string;

  @ApiProperty({ description: 'Verified by admin ID', required: false })
  @Column({ nullable: true })
  verifiedByAdminId?: string;

  @ApiProperty({ description: 'Verification date', required: false })
  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @ApiProperty({ description: 'Vendor ID' })
  @Column()
  vendorId: string;

  @ApiProperty({ description: 'Upload timestamp' })
  @CreateDateColumn()
  uploadedAt: Date;

  // Relations
  @ApiProperty({ description: 'Vendor', type: () => Vendor })
  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;
}