import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUrl,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VendorType } from '../entities/vendor.entity';

class BusinessAddressDto {
  @ApiPropertyOptional({ description: 'Address line 1' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  addressLine1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  state?: string;

  @ApiPropertyOptional({ description: 'Postal/ZIP code' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  country?: string;
}

class BankDetailsDto {
  @ApiPropertyOptional({ description: 'Account holder name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  accountHolderName?: string;

  @ApiPropertyOptional({ description: 'Bank account number' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  accountNumber?: string;

  @ApiPropertyOptional({ description: 'Bank name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  bankName?: string;

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

class SocialLinksDto {
  @ApiPropertyOptional({ description: 'Facebook URL' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({ description: 'Twitter URL' })
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @ApiPropertyOptional({ description: 'Instagram URL' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({ description: 'LinkedIn URL' })
  @IsOptional()
  @IsUrl()
  linkedin?: string;
}

export class UpdateVendorDto {
  @ApiPropertyOptional({
    description: 'Business name',
    example: 'Tech Solutions Inc.',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  businessName?: string;

  @ApiPropertyOptional({
    description: 'Display name for the store',
    example: 'Tech Solutions',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  displayName?: string;

  @ApiPropertyOptional({
    description: 'URL-friendly slug',
    example: 'tech-solutions',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug?: string;

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

  @ApiPropertyOptional({
    description: 'Vendor type',
    enum: VendorType,
  })
  @IsOptional()
  @IsEnum(VendorType)
  type?: VendorType;

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

  @ApiPropertyOptional({
    description: 'Business address',
    type: BusinessAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessAddressDto)
  businessAddress?: BusinessAddressDto;

  @ApiPropertyOptional({
    description: 'Business phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsPhoneNumber()
  businessPhone?: string;

  @ApiPropertyOptional({
    description: 'Business email',
    example: 'business@techsolutions.com',
  })
  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @ApiPropertyOptional({
    description: 'Business website',
    example: 'https://techsolutions.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Bank account details',
    type: BankDetailsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankDetailsDto)
  bankDetails?: BankDetailsDto;

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

  @ApiPropertyOptional({
    description: 'Social media links',
    type: SocialLinksDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @ApiPropertyOptional({
    description: 'Business hours',
  })
  @IsOptional()
  @IsObject()
  businessHours?: any;

  @ApiPropertyOptional({
    description: 'Verification documents',
  })
  @IsOptional()
  @IsObject()
  verificationDocuments?: any;
}