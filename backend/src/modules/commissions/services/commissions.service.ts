import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between } from 'typeorm';
import { Commission, CommissionType, CommissionScope } from '../entities/commission.entity';
import { CreateCommissionDto } from '../dto/create-commission.dto';
import { UpdateCommissionDto } from '../dto/update-commission.dto';
import { QueryCommissionsDto } from '../dto/query-commissions.dto';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
  ) {}

  async create(createCommissionDto: CreateCommissionDto): Promise<Commission> {
    // Validate scope-specific requirements
    await this.validateCommissionScope(createCommissionDto);

    // Check for existing default commission if setting as default
    if (createCommissionDto.isDefault) {
      await this.handleDefaultCommission(createCommissionDto);
    }

    // Validate date range
    if (createCommissionDto.startDate && createCommissionDto.endDate) {
      const startDate = new Date(createCommissionDto.startDate);
      const endDate = new Date(createCommissionDto.endDate);
      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }
    }

    // Validate order value range
    if (createCommissionDto.minOrderValue && createCommissionDto.maxOrderValue) {
      if (createCommissionDto.minOrderValue >= createCommissionDto.maxOrderValue) {
        throw new BadRequestException('Minimum order value must be less than maximum order value');
      }
    }

    const commission = this.commissionRepository.create({
      ...createCommissionDto,
      startDate: createCommissionDto.startDate ? new Date(createCommissionDto.startDate) : null,
      endDate: createCommissionDto.endDate ? new Date(createCommissionDto.endDate) : null,
    });

    return await this.commissionRepository.save(commission);
  }

  async findAll(queryDto: QueryCommissionsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      scope,
      categoryId,
      vendorId,
      productId,
      isActive,
      isDefault,
      startDateFrom,
      startDateTo,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      include = [],
    } = queryDto;

    const queryBuilder = this.commissionRepository.createQueryBuilder('commission');

    // Include relations
    if (include.includes('category')) {
      queryBuilder.leftJoinAndSelect('commission.category', 'category');
    }
    if (include.includes('vendor')) {
      queryBuilder.leftJoinAndSelect('commission.vendor', 'vendor');
    }

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(commission.name ILIKE :search OR commission.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type) {
      queryBuilder.andWhere('commission.type = :type', { type });
    }

    if (scope) {
      queryBuilder.andWhere('commission.scope = :scope', { scope });
    }

    if (categoryId) {
      queryBuilder.andWhere('commission.categoryId = :categoryId', { categoryId });
    }

    if (vendorId) {
      queryBuilder.andWhere('commission.vendorId = :vendorId', { vendorId });
    }

    if (productId) {
      queryBuilder.andWhere('commission.productId = :productId', { productId });
    }

    if (typeof isActive === 'boolean') {
      queryBuilder.andWhere('commission.isActive = :isActive', { isActive });
    }

    if (typeof isDefault === 'boolean') {
      queryBuilder.andWhere('commission.isDefault = :isDefault', { isDefault });
    }

    if (startDateFrom) {
      queryBuilder.andWhere('commission.startDate >= :startDateFrom', {
        startDateFrom: new Date(startDateFrom),
      });
    }

    if (startDateTo) {
      queryBuilder.andWhere('commission.startDate <= :startDateTo', {
        startDateTo: new Date(startDateTo),
      });
    }

    // Apply sorting
    queryBuilder.orderBy(`commission.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, include: string[] = []): Promise<Commission> {
    const queryBuilder = this.commissionRepository.createQueryBuilder('commission');
    
    queryBuilder.where('commission.id = :id', { id });

    if (include.includes('category')) {
      queryBuilder.leftJoinAndSelect('commission.category', 'category');
    }
    if (include.includes('vendor')) {
      queryBuilder.leftJoinAndSelect('commission.vendor', 'vendor');
    }

    const commission = await queryBuilder.getOne();
    
    if (!commission) {
      throw new NotFoundException(`Commission with ID ${id} not found`);
    }

    return commission;
  }

  async update(id: string, updateCommissionDto: UpdateCommissionDto): Promise<Commission> {
    const commission = await this.findOne(id);

    // Validate scope-specific requirements if scope is being updated
    if (updateCommissionDto.scope || updateCommissionDto.categoryId || updateCommissionDto.vendorId || updateCommissionDto.productId) {
      await this.validateCommissionScope({
        ...commission,
        ...updateCommissionDto,
      });
    }

    // Handle default commission changes
    if (updateCommissionDto.isDefault && !commission.isDefault) {
      await this.handleDefaultCommission({
        ...commission,
        ...updateCommissionDto,
      });
    }

    // Validate date range if dates are being updated
    const startDate = updateCommissionDto.startDate ? new Date(updateCommissionDto.startDate) : commission.startDate;
    const endDate = updateCommissionDto.endDate ? new Date(updateCommissionDto.endDate) : commission.endDate;
    
    if (startDate && endDate && startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Validate order value range if values are being updated
    const minOrderValue = updateCommissionDto.minOrderValue ?? commission.minOrderValue;
    const maxOrderValue = updateCommissionDto.maxOrderValue ?? commission.maxOrderValue;
    
    if (minOrderValue && maxOrderValue && minOrderValue >= maxOrderValue) {
      throw new BadRequestException('Minimum order value must be less than maximum order value');
    }

    Object.assign(commission, {
      ...updateCommissionDto,
      startDate: updateCommissionDto.startDate ? new Date(updateCommissionDto.startDate) : commission.startDate,
      endDate: updateCommissionDto.endDate ? new Date(updateCommissionDto.endDate) : commission.endDate,
    });

    return await this.commissionRepository.save(commission);
  }

  async remove(id: string): Promise<void> {
    const commission = await this.findOne(id);
    await this.commissionRepository.remove(commission);
  }

  /**
   * Calculate commission for a given order item
   */
  async calculateCommission(
    vendorId: string,
    categoryId: string,
    productId: string,
    orderValue: number,
  ): Promise<{ commission: Commission; amount: number }> {
    // Priority order: Product > Vendor > Category > Global
    let applicableCommission: Commission;

    // 1. Check for product-specific commission
    applicableCommission = await this.commissionRepository.findOne({
      where: {
        scope: CommissionScope.PRODUCT,
        productId,
        isActive: true,
      },
      order: { priority: 'DESC' },
    });

    // 2. Check for vendor-specific commission
    if (!applicableCommission) {
      applicableCommission = await this.commissionRepository.findOne({
        where: {
          scope: CommissionScope.VENDOR,
          vendorId,
          isActive: true,
        },
        order: { priority: 'DESC' },
      });
    }

    // 3. Check for category-specific commission
    if (!applicableCommission) {
      applicableCommission = await this.commissionRepository.findOne({
        where: {
          scope: CommissionScope.CATEGORY,
          categoryId,
          isActive: true,
        },
        order: { priority: 'DESC' },
      });
    }

    // 4. Fall back to global default commission
    if (!applicableCommission) {
      applicableCommission = await this.commissionRepository.findOne({
        where: {
          scope: CommissionScope.GLOBAL,
          isDefault: true,
          isActive: true,
        },
      });
    }

    if (!applicableCommission) {
      throw new NotFoundException('No applicable commission found');
    }

    // Check if commission is currently active (date range)
    if (!applicableCommission.isCurrentlyActive) {
      throw new BadRequestException('Commission is not currently active');
    }

    // Check order value constraints
    if (applicableCommission.minOrderValue && orderValue < applicableCommission.minOrderValue) {
      throw new BadRequestException('Order value below minimum commission threshold');
    }

    if (applicableCommission.maxOrderValue && orderValue > applicableCommission.maxOrderValue) {
      throw new BadRequestException('Order value above maximum commission threshold');
    }

    // Calculate commission amount
    let amount: number;
    if (applicableCommission.type === CommissionType.PERCENTAGE) {
      amount = (orderValue * applicableCommission.value) / 100;
    } else {
      amount = applicableCommission.value;
    }

    return {
      commission: applicableCommission,
      amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
    };
  }

  /**
   * Get commission statistics
   */
  async getCommissionStats() {
    const [total, active, byType, byScope] = await Promise.all([
      this.commissionRepository.count(),
      this.commissionRepository.count({ where: { isActive: true } }),
      this.commissionRepository
        .createQueryBuilder('commission')
        .select('commission.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('commission.type')
        .getRawMany(),
      this.commissionRepository
        .createQueryBuilder('commission')
        .select('commission.scope', 'scope')
        .addSelect('COUNT(*)', 'count')
        .groupBy('commission.scope')
        .getRawMany(),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = parseInt(item.count);
        return acc;
      }, {}),
      byScope: byScope.reduce((acc, item) => {
        acc[item.scope] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }

  private async validateCommissionScope(commissionData: any): Promise<void> {
    const { scope, categoryId, vendorId, productId } = commissionData;

    switch (scope) {
      case CommissionScope.CATEGORY:
        if (!categoryId) {
          throw new BadRequestException('Category ID is required for category-scoped commissions');
        }
        break;
      case CommissionScope.VENDOR:
        if (!vendorId) {
          throw new BadRequestException('Vendor ID is required for vendor-scoped commissions');
        }
        break;
      case CommissionScope.PRODUCT:
        if (!productId) {
          throw new BadRequestException('Product ID is required for product-scoped commissions');
        }
        break;
      case CommissionScope.GLOBAL:
        if (categoryId || vendorId || productId) {
          throw new BadRequestException('Global commissions cannot have category, vendor, or product associations');
        }
        break;
    }
  }

  private async handleDefaultCommission(commissionData: any): Promise<void> {
    const { scope, categoryId, vendorId, productId } = commissionData;

    // Find existing default commission with same scope
    const existingDefault = await this.commissionRepository.findOne({
      where: {
        scope,
        isDefault: true,
        ...(scope === CommissionScope.CATEGORY && { categoryId }),
        ...(scope === CommissionScope.VENDOR && { vendorId }),
        ...(scope === CommissionScope.PRODUCT && { productId }),
      },
    });

    if (existingDefault) {
      // Remove default flag from existing commission
      existingDefault.isDefault = false;
      await this.commissionRepository.save(existingDefault);
    }
  }
}