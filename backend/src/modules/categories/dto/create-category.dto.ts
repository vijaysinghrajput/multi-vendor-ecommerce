import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsUUID, Min, Max } from 'class-validator';
import { CommissionType } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Category slug', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'Category description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Category image URL', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Category icon', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({ description: 'Commission type', enum: CommissionType })
  @IsEnum(CommissionType)
  commissionType: CommissionType;

  @ApiProperty({ description: 'Commission value' })
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionValue: number;

  @ApiProperty({ description: 'Is featured category', required: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ description: 'Is active category', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Display order', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ description: 'SEO meta title', required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ description: 'SEO meta description', required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ description: 'SEO meta keywords', required: false })
  @IsOptional()
  @IsString()
  metaKeywords?: string;
}