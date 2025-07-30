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
import { ExchangeReason } from '../entities/exchange.entity';

export class CreateExchangeDto {
  @ApiProperty({ description: 'Order item ID', example: 'uuid' })
  @IsUUID()
  orderItemId: string;

  @ApiProperty({ description: 'New product variant ID', example: 'uuid' })
  @IsUUID()
  newVariantId: string;

  @ApiProperty({ description: 'Exchange reason', enum: ExchangeReason })
  @IsEnum(ExchangeReason)
  reason: ExchangeReason;

  @ApiProperty({ description: 'Exchange description', example: 'Need different size' })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({ description: 'Quantity to exchange', example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Exchange images', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}