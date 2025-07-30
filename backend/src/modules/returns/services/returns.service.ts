import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Return, ReturnStatus } from '../entities/return.entity';
import { CreateReturnDto } from '../dto/create-return.dto';
import { UpdateReturnDto } from '../dto/update-return.dto';
import { QueryReturnsDto } from '../dto/query-returns.dto';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(Return)
    private readonly returnRepository: Repository<Return>,
  ) {}

  async create(createReturnDto: CreateReturnDto, userId: string): Promise<Return> {
    // Check if return already exists for this order item
    const existingReturn = await this.returnRepository.findOne({
      where: { orderItemId: createReturnDto.orderItemId },
    });

    if (existingReturn) {
      throw new BadRequestException('Return already exists for this order item');
    }

    // For now, set a default refund amount (will be calculated when OrderItem is available)
    const refundAmount = 0;

    const returnEntity = this.returnRepository.create({
      ...createReturnDto,
      userId,
      refundAmount,
    });

    return await this.returnRepository.save(returnEntity);
  }

  async findAll(queryDto: QueryReturnsDto, currentUserId?: string, userRole?: UserRole) {
    const {
      page = 1,
      limit = 10,
      status,
      reason,
      userId,
      orderItemId,
      search,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const queryBuilder: SelectQueryBuilder<Return> = this.returnRepository
      .createQueryBuilder('return')
      .leftJoinAndSelect('return.user', 'user');

    // Role-based filtering
    if (userRole === UserRole.CUSTOMER) {
      queryBuilder.andWhere('return.userId = :currentUserId', { currentUserId });
    }
    // Admin and super_admin can see all returns

    // Apply filters
    if (status) {
      queryBuilder.andWhere('return.status = :status', { status });
    }

    if (reason) {
      queryBuilder.andWhere('return.reason = :reason', { reason });
    }

    if (userId) {
      queryBuilder.andWhere('return.userId = :userId', { userId });
    }

    if (orderItemId) {
      queryBuilder.andWhere('return.orderItemId = :orderItemId', { orderItemId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(return.description ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (startDate) {
      queryBuilder.andWhere('return.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('return.createdAt <= :endDate', { endDate });
    }

    // Sorting
    const validSortFields = ['createdAt', 'updatedAt', 'status', 'refundAmount'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`return.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [returns, total] = await queryBuilder.getManyAndCount();

    return {
      data: returns,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUserId?: string, userRole?: UserRole): Promise<Return> {
    const queryBuilder = this.returnRepository
      .createQueryBuilder('return')
      .leftJoinAndSelect('return.user', 'user')
      .where('return.id = :id', { id });

    // Role-based access control
    if (userRole === UserRole.CUSTOMER) {
      queryBuilder.andWhere('return.userId = :currentUserId', { currentUserId });
    }

    const returnEntity = await queryBuilder.getOne();

    if (!returnEntity) {
      throw new NotFoundException('Return not found');
    }

    return returnEntity;
  }

  async update(
    id: string,
    updateReturnDto: UpdateReturnDto,
    currentUserId: string,
    userRole: UserRole,
  ): Promise<Return> {
    const returnEntity = await this.findOne(id, currentUserId, userRole);

    // Only admin/super_admin can update status and admin notes
    if (updateReturnDto.status || updateReturnDto.adminNotes || updateReturnDto.refundAmount) {
      if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userRole)) {
        throw new ForbiddenException('Only admins can update return status, notes, or refund amount');
      }
    }

    // Update timestamps based on status changes
    if (updateReturnDto.status) {
      if (updateReturnDto.status === ReturnStatus.APPROVED && !returnEntity.approvedAt) {
        returnEntity.approvedAt = new Date();
      } else if (updateReturnDto.status === ReturnStatus.REJECTED && !returnEntity.rejectedAt) {
        returnEntity.rejectedAt = new Date();
      } else if (updateReturnDto.status === ReturnStatus.COMPLETED && updateReturnDto.refundAmount) {
        returnEntity.refundProcessedAt = new Date();
      }
    }

    Object.assign(returnEntity, updateReturnDto);
    return await this.returnRepository.save(returnEntity);
  }

  async remove(id: string, currentUserId: string, userRole: UserRole): Promise<void> {
    const returnEntity = await this.findOne(id, currentUserId, userRole);

    // Only allow deletion if return is pending and user owns it or user is admin
    if (returnEntity.status !== ReturnStatus.PENDING) {
      throw new BadRequestException('Can only delete pending returns');
    }

    if (userRole === UserRole.CUSTOMER && returnEntity.userId !== currentUserId) {
      throw new ForbiddenException('You can only delete your own returns');
    }

    await this.returnRepository.remove(returnEntity);
  }

  async getReturnStats(vendorId?: string) {
    const queryBuilder = this.returnRepository
      .createQueryBuilder('return')
      .leftJoin('return.orderItem', 'orderItem')
      .leftJoin('orderItem.product', 'product');

    if (vendorId) {
      queryBuilder.where('product.vendorId = :vendorId', { vendorId });
    }

    const [totalReturns, pendingReturns, approvedReturns, completedReturns] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.clone().andWhere('return.status = :status', { status: ReturnStatus.PENDING }).getCount(),
      queryBuilder.clone().andWhere('return.status = :status', { status: ReturnStatus.APPROVED }).getCount(),
      queryBuilder.clone().andWhere('return.status = :status', { status: ReturnStatus.COMPLETED }).getCount(),
    ]);

    const totalRefundAmount = await queryBuilder
      .select('SUM(return.refundAmount)', 'total')
      .andWhere('return.status = :status', { status: ReturnStatus.COMPLETED })
      .getRawOne();

    return {
      totalReturns,
      pendingReturns,
      approvedReturns,
      completedReturns,
      totalRefundAmount: parseFloat(totalRefundAmount?.total || '0'),
    };
  }
}