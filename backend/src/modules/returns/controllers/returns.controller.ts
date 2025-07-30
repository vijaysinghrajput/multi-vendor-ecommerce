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
import { ReturnsService } from '../services/returns.service';
import { CreateReturnDto } from '../dto/create-return.dto';
import { UpdateReturnDto } from '../dto/update-return.dto';
import { QueryReturnsDto } from '../dto/query-returns.dto';
import { Return } from '../entities/return.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('Returns')
@Controller('returns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new return request' })
  @ApiResponse({ status: 201, description: 'Return created successfully', type: Return })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createReturnDto: CreateReturnDto,
    @CurrentUser('id') userId: string,
  ): Promise<Return> {
    return await this.returnsService.create(createReturnDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all returns with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Returns retrieved successfully' })
  @ApiQuery({ type: QueryReturnsDto })
  async findAll(
    @Query() queryDto: QueryReturnsDto,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    return await this.returnsService.findAll(queryDto, currentUserId, userRole);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Get return statistics' })
  @ApiResponse({ status: 200, description: 'Return statistics retrieved successfully' })
  async getStats(
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ) {
    const vendorId = userRole === UserRole.VENDOR ? currentUserId : undefined;
    return await this.returnsService.getReturnStats(vendorId);
  }

  @Get('my-returns')
  @ApiOperation({ summary: 'Get current user returns' })
  @ApiResponse({ status: 200, description: 'User returns retrieved successfully' })
  @ApiQuery({ type: QueryReturnsDto })
  async getMyReturns(
    @Query() queryDto: QueryReturnsDto,
    @CurrentUser('id') userId: string,
  ) {
    const userQueryDto = { ...queryDto, userId };
    return await this.returnsService.findAll(userQueryDto, userId, UserRole.CUSTOMER);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get return by ID' })
  @ApiResponse({ status: 200, description: 'Return retrieved successfully', type: Return })
  @ApiResponse({ status: 404, description: 'Return not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Return> {
    return await this.returnsService.findOne(id, currentUserId, userRole);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update return' })
  @ApiResponse({ status: 200, description: 'Return updated successfully', type: Return })
  @ApiResponse({ status: 404, description: 'Return not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReturnDto: UpdateReturnDto,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Return> {
    return await this.returnsService.update(id, updateReturnDto, currentUserId, userRole);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Approve return request' })
  @ApiResponse({ status: 200, description: 'Return approved successfully', type: Return })
  @ApiResponse({ status: 404, description: 'Return not found' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Return> {
    const updateDto: UpdateReturnDto = { status: 'approved' as any };
    return await this.returnsService.update(id, updateDto, currentUserId, userRole);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Reject return request' })
  @ApiResponse({ status: 200, description: 'Return rejected successfully', type: Return })
  @ApiResponse({ status: 404, description: 'Return not found' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { adminNotes?: string },
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Return> {
    const updateDto: UpdateReturnDto = { 
      status: 'rejected' as any,
      adminNotes: body.adminNotes,
    };
    return await this.returnsService.update(id, updateDto, currentUserId, userRole);
  }

  @Patch(':id/complete')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Complete return and process refund' })
  @ApiResponse({ status: 200, description: 'Return completed successfully', type: Return })
  @ApiResponse({ status: 404, description: 'Return not found' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { refundAmount?: number; adminNotes?: string },
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<Return> {
    const updateDto: UpdateReturnDto = { 
      status: 'completed' as any,
      refundAmount: body.refundAmount,
      adminNotes: body.adminNotes,
    };
    return await this.returnsService.update(id, updateDto, currentUserId, userRole);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete return' })
  @ApiResponse({ status: 200, description: 'Return deleted successfully' })
  @ApiResponse({ status: 404, description: 'Return not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<{ message: string }> {
    await this.returnsService.remove(id, currentUserId, userRole);
    return { message: 'Return deleted successfully' };
  }
}