import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsDateString,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { CommissionType, CommissionScope } from '../entities/commission.entity';

export class CreateCommissionDto {
  @ApiProperty({ description: 'Commission name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Commission description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Commission type', enum: CommissionType })
  @IsEnum(CommissionType)
  type: CommissionType;

  @ApiProperty({ description: 'Commission value (percentage 0-100 or flat amount)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ValidateIf((o) => o.type === CommissionType.PERCENTAGE)
  @Max(100)
  value: number;

  @ApiProperty({ description: 'Commission scope', enum: CommissionScope })
  @IsEnum(CommissionScope)
  scope: CommissionScope;

  @ApiProperty({ description: 'Category ID (required for category scope)', required: false })
  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => o.scope === CommissionScope.CATEGORY)
  categoryId?: string;

  @ApiProperty({ description: 'Vendor ID (required for vendor scope)', required: false })
  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => o.scope === CommissionScope.VENDOR)
  vendorId?: string;

  @ApiProperty({ description: 'Product ID (required for product scope)', required: false })
  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => o.scope === CommissionScope.PRODUCT)
  productId?: string;

  @ApiProperty({ description: 'Is default commission', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ description: 'Is commission active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Minimum order value for commission to apply', required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minOrderValue?: number;

  @ApiProperty({ description: 'Maximum order value for commission to apply', required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxOrderValue?: number;

  @ApiProperty({ description: 'Commission start date', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Commission end date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Commission priority (higher number = higher priority)', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;
}