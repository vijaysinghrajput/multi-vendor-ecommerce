import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { CreateReturnDto } from './create-return.dto';
import { ReturnStatus } from '../entities/return.entity';

export class UpdateReturnDto extends PartialType(CreateReturnDto) {
  @ApiProperty({ description: 'Return status', enum: ReturnStatus, required: false })
  @IsOptional()
  @IsEnum(ReturnStatus)
  status?: ReturnStatus;

  @ApiProperty({ description: 'Admin notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNotes?: string;

  @ApiProperty({ description: 'Refund amount', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  refundAmount?: number;
}