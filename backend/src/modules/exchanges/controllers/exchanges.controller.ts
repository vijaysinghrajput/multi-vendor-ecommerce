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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExchangesService } from '../services/exchanges.service';
import { CreateExchangeDto } from '../dto/create-exchange.dto';
import { UpdateExchangeDto } from '../dto/update-exchange.dto';
import { QueryExchangesDto } from '../dto/query-exchanges.dto';
import { Exchange } from '../entities/exchange.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('Exchanges')
@Controller('exchanges')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exchange request' })
  @ApiResponse({ status: 201, description: 'Exchange created successfully', type: Exchange })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Order item or variant not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createExchangeDto: CreateExchangeDto,
    @CurrentUser('id') userId: string,
  ): Promise<Exchange> {
    return await this.exchangesService.create(createExchangeDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exchanges with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Exchanges retrieved successfully' })
  @ApiQuery({ type: QueryExchangesDto })
  async findAll(
    @Query() queryDto: QueryExchangesDto,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return await this.exchangesService.findAll(queryDto, currentUserId, userRole);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get exchange statistics' })
  @ApiResponse({ status: 200, description: 'Exchange statistics retrieved successfully' })
  async getStats(
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    const vendorId = userRole === UserRole.VENDOR ? currentUserId : undefined;
    return await this.exchangesService.getExchangeStats(vendorId);
  }

  @Get('my-exchanges')
  @ApiOperation({ summary: 'Get current user exchanges' })
  @ApiResponse({ status: 200, description: 'User exchanges retrieved successfully' })
  @ApiQuery({ type: QueryExchangesDto })
  async getMyExchanges(
    @Query() queryDto: QueryExchangesDto,
    @CurrentUser('id') userId: string,
  ) {
    const userQueryDto = { ...queryDto, userId };
    return await this.exchangesService.findAll(userQueryDto, userId, UserRole.CUSTOMER);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exchange by ID' })
  @ApiResponse({ status: 200, description: 'Exchange retrieved successfully', type: Exchange })
  @ApiResponse({ status: 404, description: 'Exchange not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Exchange> {
    return await this.exchangesService.findOne(id, currentUserId, userRole);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exchange' })
  @ApiResponse({ status: 200, description: 'Exchange updated successfully', type: Exchange })
  @ApiResponse({ status: 404, description: 'Exchange not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExchangeDto: UpdateExchangeDto,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Exchange> {
    return await this.exchangesService.update(id, updateExchangeDto, currentUserId, userRole);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Approve exchange request' })
  @ApiResponse({ status: 200, description: 'Exchange approved successfully', type: Exchange })
  @ApiResponse({ status: 404, description: 'Exchange not found' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Exchange> {
    const updateDto: UpdateExchangeDto = { status: 'approved' as any };
    return await this.exchangesService.update(id, updateDto, currentUserId, userRole);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reject exchange request' })
  @ApiResponse({ status: 200, description: 'Exchange rejected successfully', type: Exchange })
  @ApiResponse({ status: 404, description: 'Exchange not found' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { adminNotes?: string },
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Exchange> {
    const updateDto: UpdateExchangeDto = { 
      status: 'rejected' as any,
      adminNotes: body.adminNotes,
    };
    return await this.exchangesService.update(id, updateDto, currentUserId, userRole);
  }

  @Patch(':id/ship')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Mark exchange as shipped' })
  @ApiResponse({ status: 200, description: 'Exchange marked as shipped successfully', type: Exchange })
  @ApiResponse({ status: 404, description: 'Exchange not found' })
  async ship(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { trackingNumber?: string; adminNotes?: string },
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Exchange> {
    const updateDto: UpdateExchangeDto = { 
      status: 'shipped' as any,
      trackingNumber: body.trackingNumber,
      adminNotes: body.adminNotes,
    };
    return await this.exchangesService.update(id, updateDto, currentUserId, userRole);
  }

  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Complete exchange' })
  @ApiResponse({ status: 200, description: 'Exchange completed successfully', type: Exchange })
  @ApiResponse({ status: 404, description: 'Exchange not found' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { adminNotes?: string },
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Exchange> {
    const updateDto: UpdateExchangeDto = { 
      status: 'completed' as any,
      adminNotes: body.adminNotes,
    };
    return await this.exchangesService.update(id, updateDto, currentUserId, userRole);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exchange' })
  @ApiResponse({ status: 200, description: 'Exchange deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exchange not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<{ message: string }> {
    await this.exchangesService.remove(id, currentUserId, userRole);
    return { message: 'Exchange deleted successfully' };
  }
}