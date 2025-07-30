import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
  Min,
  MaxLength,
} from 'class-validator';
import { ReturnReason } from '../entities/return.entity';

export class CreateReturnDto {
  @ApiProperty({ description: 'Order item ID', example: 'uuid' })
  @IsUUID()
  orderItemId: string;

  @ApiProperty({ description: 'Return reason', enum: ReturnReason })
  @IsEnum(ReturnReason)
  reason: ReturnReason;

  @ApiProperty({ description: 'Return description', example: 'Product was damaged during shipping' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Quantity to return', example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Return images', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}