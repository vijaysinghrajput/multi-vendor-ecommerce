import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean, IsNumber, Min, Max, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CategoryStatus, CommissionType } from '../entities/category.entity';

export class QueryCategoriesDto {
  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Category status', enum: CategoryStatus, required: false })
  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;

  @ApiProperty({ description: 'Parent category ID', required: false })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({ description: 'Category level', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  level?: number;

  @ApiProperty({ description: 'Commission type', enum: CommissionType, required: false })
  @IsOptional()
  @IsEnum(CommissionType)
  commissionType?: CommissionType;

  @ApiProperty({ description: 'Is featured', required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ description: 'Is active', required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Sort field', required: false, default: 'sortOrder' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'sortOrder';

  @ApiProperty({ description: 'Sort order', required: false, default: 'ASC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({ description: 'Include children in response', required: false, default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeChildren?: boolean = false;

  @ApiProperty({ description: 'Include parent in response', required: false, default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeParent?: boolean = false;
}