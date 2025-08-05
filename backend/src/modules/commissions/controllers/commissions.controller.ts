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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CommissionsService } from '../services/commissions.service';
import { CreateCommissionDto } from '../dto/create-commission.dto';
import { UpdateCommissionDto } from '../dto/update-commission.dto';
import { QueryCommissionsDto } from '../dto/query-commissions.dto';
import { Commission } from '../entities/commission.entity';

@ApiTags('Admin - Commissions')
@Controller('admin/commissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new commission' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Commission created successfully',
    type: Commission,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid commission data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Commission already exists',
  })
  async create(@Body() createCommissionDto: CreateCommissionDto): Promise<Commission> {
    return await this.commissionsService.create(createCommissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all commissions with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commissions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/Commission' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'type', required: false, enum: ['flat', 'percentage'], description: 'Commission type' })
  @ApiQuery({ name: 'scope', required: false, enum: ['global', 'category', 'vendor', 'product'], description: 'Commission scope' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category ID' })
  @ApiQuery({ name: 'vendorId', required: false, type: String, description: 'Filter by vendor ID' })
  @ApiQuery({ name: 'productId', required: false, type: String, description: 'Filter by product ID' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'isDefault', required: false, type: Boolean, description: 'Filter by default status' })
  @ApiQuery({ name: 'startDateFrom', required: false, type: String, description: 'Filter by start date (from)' })
  @ApiQuery({ name: 'startDateTo', required: false, type: String, description: 'Filter by start date (to)' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @ApiQuery({ name: 'include', required: false, type: String, description: 'Include relations (comma-separated)' })
  async findAll(@Query() queryDto: QueryCommissionsDto) {
    return await this.commissionsService.findAll(queryDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get commission statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commission statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        byType: {
          type: 'object',
          properties: {
            flat: { type: 'number' },
            percentage: { type: 'number' },
          },
        },
        byScope: {
          type: 'object',
          properties: {
            global: { type: 'number' },
            category: { type: 'number' },
            vendor: { type: 'number' },
            product: { type: 'number' },
          },
        },
      },
    },
  })
  async getStats() {
    return await this.commissionsService.getCommissionStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get commission by ID' })
  @ApiParam({ name: 'id', description: 'Commission ID' })
  @ApiQuery({ name: 'include', required: false, type: String, description: 'Include relations (comma-separated)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commission retrieved successfully',
    type: Commission,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Commission not found',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string,
  ): Promise<Commission> {
    const includeArray = include ? include.split(',').map(s => s.trim()) : [];
    return await this.commissionsService.findOne(id, includeArray);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update commission' })
  @ApiParam({ name: 'id', description: 'Commission ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commission updated successfully',
    type: Commission,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Commission not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid commission data',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommissionDto: UpdateCommissionDto,
  ): Promise<Commission> {
    return await this.commissionsService.update(id, updateCommissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete commission' })
  @ApiParam({ name: 'id', description: 'Commission ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Commission deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Commission not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.commissionsService.remove(id);
  }

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate commission for order item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commission calculated successfully',
    schema: {
      type: 'object',
      properties: {
        commission: { $ref: '#/components/schemas/Commission' },
        amount: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No applicable commission found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid calculation parameters',
  })
  async calculateCommission(
    @Body()
    calculateDto: {
      vendorId: string;
      categoryId: string;
      productId: string;
      orderValue: number;
    },
  ) {
    const { vendorId, categoryId, productId, orderValue } = calculateDto;
    return await this.commissionsService.calculateCommission(
      vendorId,
      categoryId,
      productId,
      orderValue,
    );
  }

  @Post('bulk-update')
  @ApiOperation({ summary: 'Bulk update commissions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commissions updated successfully',
    schema: {
      type: 'object',
      properties: {
        updated: { type: 'number' },
        failed: { type: 'number' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              error: { type: 'string' },
            },
          },
        },
      },
    },
  })
  async bulkUpdate(
    @Body()
    bulkUpdateDto: {
      commissions: Array<{ id: string } & Partial<UpdateCommissionDto>>;
    },
  ) {
    const results = {
      updated: 0,
      failed: 0,
      errors: [] as Array<{ id: string; error: string }>,
    };

    for (const commissionUpdate of bulkUpdateDto.commissions) {
      try {
        const { id, ...updateData } = commissionUpdate;
        await this.commissionsService.update(id, updateData);
        results.updated++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          id: commissionUpdate.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  @Post('activate/:id')
  @ApiOperation({ summary: 'Activate commission' })
  @ApiParam({ name: 'id', description: 'Commission ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commission activated successfully',
    type: Commission,
  })
  async activate(@Param('id', ParseUUIDPipe) id: string): Promise<Commission> {
    return await this.commissionsService.update(id, { isActive: true });
  }

  @Post('deactivate/:id')
  @ApiOperation({ summary: 'Deactivate commission' })
  @ApiParam({ name: 'id', description: 'Commission ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Commission deactivated successfully',
    type: Commission,
  })
  async deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<Commission> {
    return await this.commissionsService.update(id, { isActive: false });
  }
}