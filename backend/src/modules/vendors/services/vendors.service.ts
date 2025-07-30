import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { Vendor, VendorStatus, VendorType } from '../entities/vendor.entity';
import { VendorPayout } from '../entities/vendor-payout.entity';
import { User, UserRole } from '../../users/entities/user.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { QueryVendorsDto } from '../dto/query-vendors.dto';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(VendorPayout)
    private readonly vendorPayoutRepository: Repository<VendorPayout>,
    private readonly usersService: UsersService,
  ) {}

  async create(createVendorDto: CreateVendorDto, userId: string): Promise<Vendor> {
    // Check if user already has a vendor account
    const existingVendor = await this.vendorRepository.findOne({
      where: { userId },
    });

    if (existingVendor) {
      throw new ConflictException('User already has a vendor account');
    }

    // Check if business name or slug already exists
    const { businessName, slug } = createVendorDto;
    const existingByName = await this.vendorRepository.findOne({
      where: [{ businessName }, { slug }],
    });

    if (existingByName) {
      throw new ConflictException('Business name or slug already exists');
    }

    // Update user role to vendor
    await this.usersService.updateRole(userId, UserRole.VENDOR);

    const vendor = this.vendorRepository.create({
      ...createVendorDto,
      userId,
      status: VendorStatus.PENDING,
    });

    return this.vendorRepository.save(vendor);
  }

  async findAll(queryDto: QueryVendorsDto) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      isVerified,
    } = queryDto;

    const queryBuilder = this.vendorRepository.createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.user', 'user');

    // Apply filters
    if (status) {
      queryBuilder.andWhere('vendor.status = :status', { status });
    }

    if (type) {
      queryBuilder.andWhere('vendor.type = :type', { type });
    }

    if (isVerified !== undefined) {
      queryBuilder.andWhere('vendor.isVerified = :isVerified', { isVerified });
    }

    if (search) {
      queryBuilder.andWhere(
        '(vendor.businessName ILIKE :search OR vendor.displayName ILIKE :search OR vendor.businessEmail ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`vendor.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [vendors, total] = await queryBuilder.getManyAndCount();

    return {
      data: vendors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['user', 'products', 'payouts'],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async findByUserId(userId: string): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async findBySlug(slug: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { slug },
      relations: ['user', 'products'],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto, currentUserId: string): Promise<Vendor> {
    const vendor = await this.findOne(id);

    // Check if user owns this vendor or is admin
    const currentUser = await this.usersService.findOne(currentUserId);
    if (vendor.userId !== currentUserId && ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role)) {
      throw new ForbiddenException('You can only update your own vendor account');
    }

    // Check for conflicts if updating business name or slug
    const { businessName, slug } = updateVendorDto;
    if (businessName && businessName !== vendor.businessName) {
      const existingByName = await this.vendorRepository.findOne({
        where: { businessName },
      });
      if (existingByName && existingByName.id !== id) {
        throw new ConflictException('Business name already exists');
      }
    }

    if (slug && slug !== vendor.slug) {
      const existingBySlug = await this.vendorRepository.findOne({
        where: { slug },
      });
      if (existingBySlug && existingBySlug.id !== id) {
        throw new ConflictException('Slug already exists');
      }
    }

    Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async updateStatus(id: string, status: VendorStatus, rejectionReason?: string): Promise<Vendor> {
    const vendor = await this.findOne(id);

    vendor.status = status;
    if (status === VendorStatus.REJECTED && rejectionReason) {
      vendor.rejectionReason = rejectionReason;
    }
    if (status === VendorStatus.ACTIVE) {
      vendor.rejectionReason = null;
    }

    return this.vendorRepository.save(vendor);
  }

  async updateVerification(id: string, isVerified: boolean): Promise<Vendor> {
    const vendor = await this.findOne(id);

    vendor.isVerified = isVerified;
    vendor.verifiedAt = isVerified ? new Date() : null;

    return this.vendorRepository.save(vendor);
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const vendor = await this.findOne(id);

    // Check if user owns this vendor or is admin
    const currentUser = await this.usersService.findOne(currentUserId);
    if (vendor.userId !== currentUserId && ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role)) {
      throw new ForbiddenException('You can only delete your own vendor account');
    }

    await this.vendorRepository.remove(vendor);
  }

  async getStats() {
    const [total, pending, active, suspended, rejected, verified, individual, business] = await Promise.all([
      this.vendorRepository.count(),
      this.vendorRepository.count({ where: { status: VendorStatus.PENDING } }),
      this.vendorRepository.count({ where: { status: VendorStatus.ACTIVE } }),
      this.vendorRepository.count({ where: { status: VendorStatus.SUSPENDED } }),
      this.vendorRepository.count({ where: { status: VendorStatus.REJECTED } }),
      this.vendorRepository.count({ where: { isVerified: true } }),
      this.vendorRepository.count({ where: { type: VendorType.INDIVIDUAL } }),
      this.vendorRepository.count({ where: { type: VendorType.BUSINESS } }),
    ]);

    return {
      total,
      byStatus: {
        pending,
        active,
        suspended,
        rejected,
      },
      byType: {
        individual,
        business,
      },
      verified,
    };
  }

  async updateCommissionRate(id: string, commissionRate: number): Promise<Vendor> {
    if (commissionRate < 0 || commissionRate > 100) {
      throw new BadRequestException('Commission rate must be between 0 and 100');
    }

    const vendor = await this.findOne(id);
    vendor.commissionRate = commissionRate;
    return this.vendorRepository.save(vendor);
  }

  async getTopVendors(limit: number = 10) {
    return this.vendorRepository.find({
      where: { status: VendorStatus.ACTIVE },
      order: { rating: 'DESC', salesCount: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }

  async searchVendors(query: string, limit: number = 20) {
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.user', 'user')
      .where('vendor.status = :status', { status: VendorStatus.ACTIVE })
      .andWhere(
        '(vendor.businessName ILIKE :query OR vendor.displayName ILIKE :query OR vendor.description ILIKE :query)',
        { query: `%${query}%` },
      )
      .orderBy('vendor.rating', 'DESC')
      .addOrderBy('vendor.salesCount', 'DESC')
      .take(limit)
      .getMany();
  }
}