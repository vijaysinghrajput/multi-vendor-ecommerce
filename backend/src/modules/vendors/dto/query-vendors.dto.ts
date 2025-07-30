import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { VendorStatus, VendorType } from '../entities/vendor.entity';

export class QueryVendorsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by vendor status',
    enum: VendorStatus,
  })
  @IsOptional()
  @IsEnum(VendorStatus)
  status?: VendorStatus;

  @ApiPropertyOptional({
    description: 'Filter by vendor type',
    enum: VendorType,
  })
  @IsOptional()
  @IsEnum(VendorType)
  type?: VendorType;

  @ApiPropertyOptional({
    description: 'Search by business name or display name',
    example: 'tech solutions',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'businessName',
    enum: ['businessName', 'displayName', 'createdAt', 'rating', 'salesCount', 'totalRevenue'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['businessName', 'displayName', 'createdAt', 'rating', 'salesCount', 'totalRevenue'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: 'Filter by verification status',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by minimum rating',
    example: 4.0,
    minimum: 0,
    maximum: 5,
  })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  minRating?: number;

  @ApiPropertyOptional({
    description: 'Filter by location (city)',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  location?: string;
}