import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CommissionType, CommissionScope } from '../entities/commission.entity';

export class QueryCommissionsDto {
  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', default: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ description: 'Search term for commission name', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by commission type', enum: CommissionType, required: false })
  @IsOptional()
  @IsEnum(CommissionType)
  type?: CommissionType;

  @ApiProperty({ description: 'Filter by commission scope', enum: CommissionScope, required: false })
  @IsOptional()
  @IsEnum(CommissionScope)
  scope?: CommissionScope;

  @ApiProperty({ description: 'Filter by category ID', required: false })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({ description: 'Filter by vendor ID', required: false })
  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @ApiProperty({ description: 'Filter by product ID', required: false })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Filter by default status', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ description: 'Filter by start date (from)', required: false })
  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @ApiProperty({ description: 'Filter by start date (to)', required: false })
  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @ApiProperty({ description: 'Sort field', default: 'createdAt', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiProperty({ description: 'Sort order', default: 'DESC', required: false })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ description: 'Include relations', required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(s => s.trim());
    }
    return value;
  })
  include?: string[];
}