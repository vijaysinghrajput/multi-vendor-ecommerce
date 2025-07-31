import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum CommissionType {
  FLAT = 'flat',
  PERCENTAGE = 'percentage',
}

@Entity('categories')
export class Category {
  @ApiProperty({ description: 'Category ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Category name' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ description: 'Category slug' })
  @Column({ unique: true })
  slug: string;

  @ApiProperty({ description: 'Category description', required: false })
  @Column('text', { nullable: true })
  description?: string;



  @ApiProperty({ description: 'Category icon', required: false })
  @Column({ nullable: true })
  icon?: string;

  @ApiProperty({ description: 'Display order' })
  @Column({ default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @Column({ nullable: true })
  parentId?: string;

  @ApiProperty({ description: 'Category level in hierarchy' })
  @Column({ default: 1 })
  level: number;

  @ApiProperty({ description: 'Category image URL', required: false })
  @Column({ nullable: true })
  imageUrl?: string;

  @ApiProperty({ description: 'Commission type', enum: CommissionType })
  @Column({ type: 'enum', enum: CommissionType, default: CommissionType.PERCENTAGE })
  commissionType: CommissionType;

  @ApiProperty({ description: 'Commission value' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  commissionValue: number;

  @ApiProperty({ description: 'Is featured category' })
  @Column({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Is active category' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'SEO meta title', required: false })
  @Column({ nullable: true })
  metaTitle?: string;

  @ApiProperty({ description: 'SEO meta description', required: false })
  @Column('text', { nullable: true })
  metaDescription?: string;

  @ApiProperty({ description: 'SEO meta keywords', required: false })
  @Column('text', { nullable: true })
  metaKeywords?: string;

  @ApiProperty({ description: 'Category creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Category last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Category products', type: () => [Product] })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @ApiProperty({ description: 'Parent category', type: () => Category, required: false })
  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @ApiProperty({ description: 'Child categories', type: () => [Category] })
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  // Virtual properties
  @ApiProperty({ description: 'Is root category' })
  get isRoot(): boolean {
    return !this.parentId;
  }

  @ApiProperty({ description: 'Has children' })
  get hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }

  @ApiProperty({ description: 'Full category path' })
  get fullPath(): string {
    // This would be populated by service logic
    return this.name;
  }
}