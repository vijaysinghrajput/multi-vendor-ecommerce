import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { CreateExchangeDto } from './create-exchange.dto';
import { ExchangeStatus } from '../entities/exchange.entity';

export class UpdateExchangeDto extends PartialType(CreateExchangeDto) {
  @ApiProperty({ description: 'Exchange status', enum: ExchangeStatus, required: false })
  @IsOptional()
  @IsEnum(ExchangeStatus)
  status?: ExchangeStatus;

  @ApiProperty({ description: 'Admin notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNotes?: string;

  @ApiProperty({ description: 'Price difference', required: false })
  @IsOptional()
  @IsNumber()
  priceDifference?: number;

  @ApiProperty({ description: 'Tracking number', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  trackingNumber?: string;
}