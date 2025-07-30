import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Exchange, ExchangeStatus } from '../entities/exchange.entity';
import { CreateExchangeDto } from '../dto/create-exchange.dto';
import { UpdateExchangeDto } from '../dto/update-exchange.dto';
import { QueryExchangesDto } from '../dto/query-exchanges.dto';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
  ) {}

  async create(createExchangeDto: CreateExchangeDto, userId: string): Promise<Exchange> {
    // Check if exchange already exists for this order item
    const existingExchange = await this.exchangeRepository.findOne({
      where: { orderItemId: createExchangeDto.orderItemId },
    });

    if (existingExchange) {
      throw new BadRequestException('Exchange already exists for this order item');
    }

    // For now, set a default price difference (will be calculated when entities are available)
    const priceDifference = 0;

    const exchange = this.exchangeRepository.create({
      ...createExchangeDto,
      userId,
      priceDifference,
    });

    return await this.exchangeRepository.save(exchange);
  }

  async findAll(queryDto: QueryExchangesDto, currentUserId?: string, userRole?: UserRole) {
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

    const queryBuilder: SelectQueryBuilder<Exchange> = this.exchangeRepository
      .createQueryBuilder('exchange')
      .leftJoinAndSelect('exchange.user', 'user');

    // Role-based filtering
    if (userRole === UserRole.CUSTOMER) {
      queryBuilder.andWhere('exchange.userId = :currentUserId', { currentUserId });
    }
    // Admin and super_admin can see all exchanges

    // Apply filters
    if (status) {
      queryBuilder.andWhere('exchange.status = :status', { status });
    }

    if (reason) {
      queryBuilder.andWhere('exchange.reason = :reason', { reason });
    }

    if (userId) {
      queryBuilder.andWhere('exchange.userId = :userId', { userId });
    }

    if (orderItemId) {
      queryBuilder.andWhere('exchange.orderItemId = :orderItemId', { orderItemId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(exchange.description ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (startDate) {
      queryBuilder.andWhere('exchange.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('exchange.createdAt <= :endDate', { endDate });
    }

    // Sorting
    const validSortFields = ['createdAt', 'updatedAt', 'status', 'priceDifference'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`exchange.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [exchanges, total] = await queryBuilder.getManyAndCount();

    return {
      data: exchanges,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUserId?: string, userRole?: UserRole): Promise<Exchange> {
    const queryBuilder = this.exchangeRepository
      .createQueryBuilder('exchange')
      .leftJoinAndSelect('exchange.user', 'user')
      .where('exchange.id = :id', { id });

    // Role-based access control
    if (userRole === UserRole.CUSTOMER) {
      queryBuilder.andWhere('exchange.userId = :currentUserId', { currentUserId });
    }

    const exchange = await queryBuilder.getOne();

    if (!exchange) {
      throw new NotFoundException('Exchange not found');
    }

    return exchange;
  }

  async update(
    id: string,
    updateExchangeDto: UpdateExchangeDto,
    currentUserId: string,
    userRole: UserRole,
  ): Promise<Exchange> {
    const exchange = await this.findOne(id, currentUserId, userRole);

    // Only admin/super_admin can update status, admin notes, price difference, and tracking
    if (
      updateExchangeDto.status ||
      updateExchangeDto.adminNotes ||
      updateExchangeDto.priceDifference !== undefined ||
      updateExchangeDto.trackingNumber
    ) {
      if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(userRole)) {
        throw new ForbiddenException(
          'Only admins can update exchange status, notes, price difference, or tracking',
        );
      }
    }

    // Update timestamps based on status changes
    if (updateExchangeDto.status) {
      if (updateExchangeDto.status === ExchangeStatus.APPROVED && !exchange.approvedAt) {
        exchange.approvedAt = new Date();
      } else if (updateExchangeDto.status === ExchangeStatus.REJECTED && !exchange.rejectedAt) {
        exchange.rejectedAt = new Date();
      } else if (updateExchangeDto.status === ExchangeStatus.SHIPPED && !exchange.shippedAt) {
        exchange.shippedAt = new Date();
      } else if (updateExchangeDto.status === ExchangeStatus.COMPLETED && !exchange.completedAt) {
        exchange.completedAt = new Date();
      }
    }

    Object.assign(exchange, updateExchangeDto);
    return await this.exchangeRepository.save(exchange);
  }

  async remove(id: string, currentUserId: string, userRole: UserRole): Promise<void> {
    const exchange = await this.findOne(id, currentUserId, userRole);

    // Only allow deletion if exchange is pending and user owns it or user is admin
    if (exchange.status !== ExchangeStatus.PENDING) {
      throw new BadRequestException('Can only delete pending exchanges');
    }

    if (userRole === UserRole.CUSTOMER && exchange.userId !== currentUserId) {
      throw new ForbiddenException('You can only delete your own exchanges');
    }

    await this.exchangeRepository.remove(exchange);
  }

  async getExchangeStats(vendorId?: string) {
    const queryBuilder = this.exchangeRepository
      .createQueryBuilder('exchange')
      .leftJoin('exchange.orderItem', 'orderItem')
      .leftJoin('orderItem.product', 'product');

    if (vendorId) {
      queryBuilder.where('product.vendorId = :vendorId', { vendorId });
    }

    const [totalExchanges, pendingExchanges, approvedExchanges, completedExchanges] = await Promise.all([
      queryBuilder.getCount(),
      queryBuilder.clone().andWhere('exchange.status = :status', { status: ExchangeStatus.PENDING }).getCount(),
      queryBuilder.clone().andWhere('exchange.status = :status', { status: ExchangeStatus.APPROVED }).getCount(),
      queryBuilder.clone().andWhere('exchange.status = :status', { status: ExchangeStatus.COMPLETED }).getCount(),
    ]);

    const totalPriceDifference = await queryBuilder
      .select('SUM(exchange.priceDifference)', 'total')
      .andWhere('exchange.status = :status', { status: ExchangeStatus.COMPLETED })
      .getRawOne();

    return {
      totalExchanges,
      pendingExchanges,
      approvedExchanges,
      completedExchanges,
      totalPriceDifference: parseFloat(totalPriceDifference?.total || '0'),
    };
  }
}