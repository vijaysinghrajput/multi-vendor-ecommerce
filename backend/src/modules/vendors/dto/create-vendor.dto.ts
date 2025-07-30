import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsObject,
  IsUrl,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  ValidateNested,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VendorType } from '../entities/vendor.entity';

class BusinessAddressDto {
  @ApiProperty({ description: 'Address line 1' })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  addressLine1: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city: string;

  @ApiProperty({ description: 'State/Province' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  state: string;

  @ApiProperty({ description: 'Postal/ZIP code' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  country: string;
}

class BankDetailsDto {
  @ApiProperty({ description: 'Account holder name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  accountHolderName: string;

  @ApiProperty({ description: 'Bank account number' })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  accountNumber: string;

  @ApiProperty({ description: 'Bank name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  bankName: string;

  @ApiPropertyOptional({ description: 'Routing number' })
  @IsOptional()
  @IsString()
  routingNumber?: string;

  @ApiPropertyOptional({ description: 'SWIFT code' })
  @IsOptional()
  @IsString()
  swiftCode?: string;

  @ApiPropertyOptional({ description: 'IBAN' })
  @IsOptional()
  @IsString()
  iban?: string;
}

export class CreateVendorDto {
  @ApiProperty({
    description: 'Business name',
    example: 'Tech Solutions Inc.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  businessName: string;

  @ApiProperty({
    description: 'Display name for the store',
    example: 'Tech Solutions',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  displayName: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'tech-solutions',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    description: 'Business description',
    example: 'We provide cutting-edge technology solutions...',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Logo URL',
    example: 'https://example.com/logo.png',
  })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Banner URL',
    example: 'https://example.com/banner.png',
  })
  @IsOptional()
  @IsUrl()
  banner?: string;

  @ApiProperty({
    description: 'Vendor type',
    enum: VendorType,
    example: VendorType.BUSINESS,
  })
  @IsEnum(VendorType)
  type: VendorType;

  @ApiPropertyOptional({
    description: 'Business registration number',
    example: 'REG123456789',
  })
  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  @ApiPropertyOptional({
    description: 'Tax identification number',
    example: 'TAX123456789',
  })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiProperty({
    description: 'Business address',
    type: BusinessAddressDto,
  })
  @ValidateNested()
  @Type(() => BusinessAddressDto)
  businessAddress: BusinessAddressDto;

  @ApiProperty({
    description: 'Business phone number',
    example: '+1234567890',
  })
  @IsPhoneNumber()
  businessPhone: string;

  @ApiProperty({
    description: 'Business email',
    example: 'business@techsolutions.com',
  })
  @IsEmail()
  businessEmail: string;

  @ApiPropertyOptional({
    description: 'Business website',
    example: 'https://techsolutions.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Bank account details',
    type: BankDetailsDto,
  })
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bankDetails: BankDetailsDto;

  @ApiPropertyOptional({
    description: 'Commission rate (percentage)',
    example: 10.5,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;
}