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
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @ApiProperty({ description: 'Product image ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Image URL' })
  @Column()
  url: string;

  @ApiProperty({ description: 'Image alt text', required: false })
  @Column({ nullable: true })
  altText?: string;

  @ApiProperty({ description: 'Is primary image' })
  @Column({ default: false })
  isPrimary: boolean;

  @ApiProperty({ description: 'Display order' })
  @Column({ default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Image width in pixels', required: false })
  @Column({ nullable: true })
  width?: number;

  @ApiProperty({ description: 'Image height in pixels', required: false })
  @Column({ nullable: true })
  height?: number;

  @ApiProperty({ description: 'Image file size in bytes', required: false })
  @Column({ nullable: true })
  fileSize?: number;

  @ApiProperty({ description: 'Image MIME type', required: false })
  @Column({ nullable: true })
  mimeType?: string;

  @ApiProperty({ description: 'Product ID' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Image creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Image last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // Virtual properties
  @ApiProperty({ description: 'Image aspect ratio' })
  get aspectRatio(): number | null {
    if (!this.width || !this.height) return null;
    return this.width / this.height;
  }

  @ApiProperty({ description: 'Is landscape orientation' })
  get isLandscape(): boolean {
    const ratio = this.aspectRatio;
    return ratio ? ratio > 1 : false;
  }

  @ApiProperty({ description: 'Is portrait orientation' })
  get isPortrait(): boolean {
    const ratio = this.aspectRatio;
    return ratio ? ratio < 1 : false;
  }

  @ApiProperty({ description: 'Is square orientation' })
  get isSquare(): boolean {
    const ratio = this.aspectRatio;
    return ratio ? Math.abs(ratio - 1) < 0.01 : false;
  }
}