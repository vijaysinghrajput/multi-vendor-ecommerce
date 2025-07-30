import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
  ParseIntPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { VendorsService } from '../services/vendors.service';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { QueryVendorsDto } from '../dto/query-vendors.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { User } from '../../users/entities/user.entity';
import { VendorStatus } from '../entities/vendor.entity';

@ApiTags('vendors')
@Controller('vendors')
@UseGuards(JwtAuthGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Vendor created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Vendor already exists for this user or slug already taken',
  })
  async create(
    @Body() createVendorDto: CreateVendorDto,
    @CurrentUser() user: User,
  ) {
    return this.vendorsService.create(createVendorDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendors retrieved successfully',
  })
  async findAll(@Query() queryDto: QueryVendorsDto) {
    return this.vendorsService.findAll(queryDto);
  }

  @Get('my-vendor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user\'s vendor' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
  })
  async getMyVendor(@CurrentUser() user: User) {
    return this.vendorsService.findByUserId(user.id);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor statistics (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    return this.vendorsService.getStats();
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top vendors by rating' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of top vendors to return',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Top vendors retrieved successfully',
  })
  async getTopVendors(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.vendorsService.getTopVendors(limit || 10);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search vendors' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search query',
    example: 'tech solutions',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results to return',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Search results retrieved successfully',
  })
  async searchVendors(
    @Query('q') query: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.vendorsService.searchVendors(query, limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiParam({
    name: 'id',
    description: 'Vendor UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get vendor by slug' })
  @ApiParam({
    name: 'slug',
    description: 'Vendor slug',
    example: 'tech-solutions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
  })
  async findBySlug(@Param('slug') slug: string) {
    return this.vendorsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor' })
  @ApiParam({
    name: 'id',
    description: 'Vendor UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not authorized to update this vendor',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVendorDto: UpdateVendorDto,
    @CurrentUser() user: User,
  ) {
    return this.vendorsService.update(id, updateVendorDto, user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor status (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Vendor UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor status updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: VendorStatus,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.vendorsService.updateStatus(id, status, rejectionReason);
  }

  @Patch(':id/verify')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify vendor (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Vendor UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor verified successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
  })
  async verifyVendor(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorsService.updateVerification(id, true);
  }

  @Patch(':id/commission')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update vendor commission rate (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Vendor UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commission rate updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
  })
  async updateCommissionRate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('commissionRate', ParseFloatPipe) commissionRate: number,
  ) {
    return this.vendorsService.updateCommissionRate(id, commissionRate);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete vendor (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'Vendor UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.vendorsService.remove(id, user.id);
  }
}