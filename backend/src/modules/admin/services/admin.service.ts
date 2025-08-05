import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../../users/entities/user.entity';
import { Vendor, VendorStatus } from '../../vendors/entities/vendor.entity';
import { Category } from '../../categories/entities/category.entity';
import { Product, ProductStatus } from '../../products/entities/product.entity';
import { Order, OrderStatus } from '../../orders/entities/order.entity';
import { Return, ReturnStatus } from '../../returns/entities/return.entity';
import { Exchange, ExchangeStatus } from '../../exchanges/entities/exchange.entity';
import { Review, ReviewStatus } from '../../reviews/entities/review.entity';
import { Commission } from '../../commissions/entities/commission.entity';
import { Analytics } from '../../analytics/entities/analytics.entity';

export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
    customers: number;
    vendors: number;
    admins: number;
    newThisMonth: number;
  };
  vendors: {
    total: number;
    approved: number;
    pending: number;
    suspended: number;
    newThisMonth: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    newThisMonth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
    thisMonthRevenue: number;
  };
  returns: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  exchanges: {
    total: number;
    pending: number;
    approved: number;
    completed: number;
  };
  reviews: {
    total: number;
    pending: number;
    approved: number;
    averageRating: number;
  };
  categories: {
    total: number;
    active: number;
  };
  commissions: {
    total: number;
    active: number;
    totalEarned: number;
    thisMonthEarned: number;
  };
}

export interface AdminRecentActivity {
  type: 'user' | 'vendor' | 'order' | 'product' | 'return' | 'exchange' | 'review';
  action: string;
  description: string;
  timestamp: Date;
  entityId: string;
  userId?: string;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Return)
    private readonly returnRepository: Repository<Return>,
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Commission)
    private readonly commissionRepository: Repository<Commission>,
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
  ) {}

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User statistics
    const [totalUsers, activeUsers, customers, vendors, admins, newUsersThisMonth] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { status: UserStatus.ACTIVE } }),
      this.userRepository.count({ where: { role: UserRole.CUSTOMER } }),
      this.userRepository.count({ where: { role: UserRole.VENDOR } }),
      this.userRepository.count({ where: { role: UserRole.ADMIN } }),
      this.userRepository.count({ where: { createdAt: { $gte: startOfMonth } as any } }),
    ]);

    // Vendor statistics
    const [totalVendors, approvedVendors, pendingVendors, suspendedVendors, newVendorsThisMonth] = await Promise.all([
      this.vendorRepository.count(),
      this.vendorRepository.count({ where: { status: VendorStatus.ACTIVE } }),
      this.vendorRepository.count({ where: { status: VendorStatus.PENDING } }),
      this.vendorRepository.count({ where: { status: VendorStatus.SUSPENDED } }),
      this.vendorRepository.count({ where: { createdAt: { $gte: startOfMonth } as any } }),
    ]);

    // Product statistics
    const [totalProducts, activeProducts, outOfStockProducts, newProductsThisMonth] = await Promise.all([
      this.productRepository.count(),
      this.productRepository.count({ where: { status: ProductStatus.ACTIVE } }),
      this.productRepository.count({ where: { stockQuantity: 0 } }),
      this.productRepository.count({ where: { createdAt: { $gte: startOfMonth } as any } }),
    ]);

    // Order statistics
    const [totalOrders, pendingOrders, completedOrders, cancelledOrders] = await Promise.all([
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: OrderStatus.PENDING } }),
      this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } }),
      this.orderRepository.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    // Revenue calculations
    const totalRevenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    const thisMonthRevenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'total')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .andWhere('order.createdAt >= :startOfMonth', { startOfMonth })
      .getRawOne();

    // Return statistics
    const [totalReturns, pendingReturns, approvedReturns, rejectedReturns] = await Promise.all([
      this.returnRepository.count(),
      this.returnRepository.count({ where: { status: ReturnStatus.PENDING } }),
      this.returnRepository.count({ where: { status: ReturnStatus.APPROVED } }),
      this.returnRepository.count({ where: { status: ReturnStatus.REJECTED } }),
    ]);

    // Exchange statistics
    const [totalExchanges, pendingExchanges, approvedExchanges, completedExchanges] = await Promise.all([
      this.exchangeRepository.count(),
      this.exchangeRepository.count({ where: { status: ExchangeStatus.PENDING } }),
      this.exchangeRepository.count({ where: { status: ExchangeStatus.APPROVED } }),
      this.exchangeRepository.count({ where: { status: ExchangeStatus.COMPLETED } }),
    ]);

    // Review statistics
    const [totalReviews, pendingReviews, approvedReviews] = await Promise.all([
      this.reviewRepository.count(),
      this.reviewRepository.count({ where: { status: ReviewStatus.PENDING } }),
      this.reviewRepository.count({ where: { status: ReviewStatus.APPROVED } }),
    ]);

    const averageRatingResult = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.status = :status', { status: ReviewStatus.APPROVED })
      .getRawOne();

    // Category statistics
    const [totalCategories, activeCategories] = await Promise.all([
      this.categoryRepository.count(),
      this.categoryRepository.count({ where: { isActive: true } }),
    ]);

    // Commission statistics
    const [totalCommissions, activeCommissions] = await Promise.all([
      this.commissionRepository.count(),
      this.commissionRepository.count({ where: { isActive: true } }),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        customers,
        vendors,
        admins,
        newThisMonth: newUsersThisMonth,
      },
      vendors: {
        total: totalVendors,
        approved: approvedVendors,
        pending: pendingVendors,
        suspended: suspendedVendors,
        newThisMonth: newVendorsThisMonth,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        outOfStock: outOfStockProducts,
        newThisMonth: newProductsThisMonth,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        totalRevenue: parseFloat(totalRevenueResult?.total || '0'),
        thisMonthRevenue: parseFloat(thisMonthRevenueResult?.total || '0'),
      },
      returns: {
        total: totalReturns,
        pending: pendingReturns,
        approved: approvedReturns,
        rejected: rejectedReturns,
      },
      exchanges: {
        total: totalExchanges,
        pending: pendingExchanges,
        approved: approvedExchanges,
        completed: completedExchanges,
      },
      reviews: {
        total: totalReviews,
        pending: pendingReviews,
        approved: approvedReviews,
        averageRating: parseFloat(averageRatingResult?.average || '0'),
      },
      categories: {
        total: totalCategories,
        active: activeCategories,
      },
      commissions: {
        total: totalCommissions,
        active: activeCommissions,
        totalEarned: 0, // This would need commission calculation logic
        thisMonthEarned: 0, // This would need commission calculation logic
      },
    };
  }

  async getRecentActivity(limit: number = 20): Promise<AdminRecentActivity[]> {
    const activities: AdminRecentActivity[] = [];

    // Get recent users
    const recentUsers = await this.userRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    recentUsers.forEach(user => {
      activities.push({
        type: 'user',
        action: 'registered',
        description: `New user ${user.firstName} ${user.lastName} registered`,
        timestamp: user.createdAt,
        entityId: user.id,
        userId: user.id,
      });
    });

    // Get recent vendors
    const recentVendors = await this.vendorRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['user'],
    });

    recentVendors.forEach(vendor => {
      activities.push({
        type: 'vendor',
        action: 'applied',
        description: `New vendor application: ${vendor.businessName}`,
        timestamp: vendor.createdAt,
        entityId: vendor.id,
        userId: vendor.userId,
      });
    });

    // Get recent orders
    const recentOrders = await this.orderRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['user'],
    });

    recentOrders.forEach(order => {
      activities.push({
        type: 'order',
        action: 'placed',
        description: `Order #${order.orderNumber} placed for $${order.totalAmount}`,
        timestamp: order.createdAt,
        entityId: order.id,
        userId: order.userId,
      });
    });

    // Get recent returns
    const recentReturns = await this.returnRepository.find({
      order: { createdAt: 'DESC' },
      take: 3,
      relations: ['user'],
    });

    recentReturns.forEach(returnItem => {
      activities.push({
        type: 'return',
        action: 'requested',
        description: `Return request for reason: ${returnItem.reason}`,
        timestamp: returnItem.createdAt,
        entityId: returnItem.id,
        userId: returnItem.userId,
      });
    });

    // Sort by timestamp and limit
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getSystemHealth() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check recent activity
    const recentActivity = await this.analyticsRepository.count({
      where: {
        createdAt: { $gte: oneHourAgo } as any,
      },
    });

    // Check pending items that need attention
    const [pendingVendors, pendingReturns, pendingExchanges, pendingReviews] = await Promise.all([
      this.vendorRepository.count({ where: { status: VendorStatus.PENDING } }),
      this.returnRepository.count({ where: { status: ReturnStatus.PENDING } }),
      this.exchangeRepository.count({ where: { status: ExchangeStatus.PENDING } }),
      this.reviewRepository.count({ where: { status: ReviewStatus.PENDING } }),
    ]);

    return {
      status: 'healthy',
      recentActivity,
      pendingItems: {
        vendors: pendingVendors,
        returns: pendingReturns,
        exchanges: pendingExchanges,
        reviews: pendingReviews,
        total: pendingVendors + pendingReturns + pendingExchanges + pendingReviews,
      },
      lastChecked: now,
    };
  }

  async getTopPerformers() {
    // Top vendors by revenue
    const topVendors = await this.vendorRepository
      .createQueryBuilder('vendor')
      .select(['vendor.id', 'vendor.businessName', 'vendor.totalRevenue'])
      .orderBy('vendor.totalRevenue', 'DESC')
      .limit(5)
      .getMany();

    // Top products by sales (this would need order items)
    const topProducts = await this.productRepository
      .createQueryBuilder('product')
      .select(['product.id', 'product.name', 'product.price'])
      .orderBy('product.createdAt', 'DESC') // Placeholder - would need sales data
      .limit(5)
      .getMany();

    // Top categories by product count
    const topCategories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .select(['category.id', 'category.name'])
      .addSelect('COUNT(product.id)', 'productCount')
      .groupBy('category.id')
      .orderBy('productCount', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      vendors: topVendors,
      products: topProducts,
      categories: topCategories,
    };
  }

  // Vendors Management
  async getAllVendors(page: number = 1, limit: number = 10, search?: string, status?: string) {
    const queryBuilder = this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.user', 'user')
      .leftJoinAndSelect('vendor.products', 'products')
      .select([
        'vendor.id',
        'vendor.businessName',
        'vendor.status',
        'vendor.isVerified',
        'vendor.totalRevenue',
        'vendor.commissionRate',
        'vendor.createdAt',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.phone',
      ])
      .addSelect('COUNT(products.id)', 'productCount')
      .groupBy('vendor.id, user.id');

    if (search) {
      queryBuilder.andWhere(
        '(vendor.businessName ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('vendor.status = :status', { status });
    }

    const total = await queryBuilder.getCount();
    const vendors = await queryBuilder
      .orderBy('vendor.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    return {
      data: vendors.entities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getVendorApplications(page: number = 1, limit: number = 10) {
    const queryBuilder = this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.user', 'user')
      .where('vendor.status = :status', { status: 'pending' })
      .orderBy('vendor.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const applications = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Products Management
  async getAllProducts(page: number = 1, limit: number = 10, search?: string, category?: string, status?: string) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.vendor', 'vendor')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('vendor.user', 'user')
      .select([
        'product.id',
        'product.name',
        'product.sku',
        'product.price',
        'product.stockQuantity',
        'product.status',
        'product.rating',
        'product.reviewCount',
        'product.createdAt',
        'vendor.businessName',
        'category.name',
        'user.firstName',
        'user.lastName',
      ]);

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search OR vendor.businessName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (category) {
      queryBuilder.andWhere('category.id = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    const total = await queryBuilder.getCount();
    const products = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Orders Management
  async getAllOrders(page: number = 1, limit: number = 10, search?: string, status?: string, dateFrom?: Date, dateTo?: Date) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.vendor', 'vendor')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.payment', 'payment')
      .select([
        'order.id',
        'order.orderNumber',
        'order.status',
        'order.paymentStatus',
        'order.totalAmount',
        'order.shippingAmount',
        'order.taxAmount',
        'order.createdAt',
        'user.firstName',
        'user.lastName',
        'user.email',
        'vendor.businessName',
        'payment.status',
        'payment.paymentGateway',
      ])
      .addSelect('COUNT(orderItems.id)', 'itemCount')
      .groupBy('order.id, user.id, vendor.id, payment.id');

    if (search) {
      queryBuilder.andWhere(
        '(order.orderNumber ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (dateFrom) {
      queryBuilder.andWhere('order.createdAt >= :dateFrom', { dateFrom });
    }

    if (dateTo) {
      queryBuilder.andWhere('order.createdAt <= :dateTo', { dateTo });
    }

    const total = await queryBuilder.getCount();
    const orders = await queryBuilder
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    return {
      data: orders.entities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Customers Management
  async getAllCustomers(page: number = 1, limit: number = 10, search?: string, status?: string) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.orders', 'orders')
      .where('user.role = :role', { role: 'customer' })
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.phone',
        'user.status',
        'user.emailVerified',
        'user.phoneVerified',
        'user.createdAt',
      ])
      .addSelect('COUNT(orders.id)', 'orderCount')
      .addSelect('COALESCE(SUM(orders.totalAmount), 0)', 'totalSpent')
      .groupBy('user.id');

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const total = await queryBuilder.getCount();
    const customers = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    return {
      data: customers.entities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Categories Management
  async getAllCategories(page: number = 1, limit: number = 10, search?: string) {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'products')
      .leftJoin('category.parent', 'parent')
      .select([
        'category.id',
        'category.name',
        'category.slug',
        'category.description',
        'category.isActive',
        'category.createdAt',
        'parent.name',
      ])
      .addSelect('COUNT(products.id)', 'productCount')
      .groupBy('category.id, parent.id');

    if (search) {
      queryBuilder.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    const total = await queryBuilder.getCount();
    const categories = await queryBuilder
      .orderBy('category.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    return {
      data: categories.entities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Financial Reports
  async getFinancialReports(dateFrom?: Date, dateTo?: Date) {
    const now = new Date();
    const startDate = dateFrom || new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = dateTo || now;

    // Revenue by period
    const revenueData = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'DATE(order.createdAt) as date',
        'SUM(order.totalAmount) as revenue',
        'COUNT(order.id) as orderCount',
      ])
      .where('order.status = :status', { status: 'delivered' })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('DATE(order.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();

    // Commission data
    const commissionData = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.vendor', 'vendor')
      .select([
        'vendor.businessName',
        'SUM(order.totalAmount * vendor.commissionRate / 100) as commission',
        'COUNT(order.id) as orderCount',
      ])
      .where('order.status = :status', { status: 'delivered' })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('vendor.id, vendor.businessName')
      .orderBy('commission', 'DESC')
      .getRawMany();

    // Payment method breakdown
    const paymentMethods = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.payment', 'payment')
      .select([
        'payment.paymentGateway',
        'COUNT(order.id) as count',
        'SUM(order.totalAmount) as amount',
      ])
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('payment.paymentGateway')
      .getRawMany();

    // Top selling products
    const topProducts = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.orderItems', 'orderItems')
      .leftJoin('orderItems.product', 'product')
      .select([
        'product.name',
        'SUM(orderItems.quantity) as totalSold',
        'SUM(orderItems.totalPrice) as revenue',
      ])
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('product.id, product.name')
      .orderBy('totalSold', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      period: { startDate, endDate },
      revenue: revenueData,
      commissions: commissionData,
      paymentMethods,
      topProducts,
    };
  }

  // Marketing Data
  async getMarketingData() {
    // Coupon usage statistics
    const couponStats = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.coupon', 'coupon')
      .select([
        'coupon.code',
        'coupon.name',
        'COUNT(order.id) as usageCount',
        'SUM(order.discountAmount) as totalDiscount',
      ])
      .where('coupon.id IS NOT NULL')
      .groupBy('coupon.id, coupon.code, coupon.name')
      .orderBy('usageCount', 'DESC')
      .getRawMany();

    // Customer acquisition by month
    const customerAcquisition = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'DATE_TRUNC(\'month\', user.createdAt) as month',
        'COUNT(user.id) as newCustomers',
      ])
      .where('user.role = :role', { role: 'customer' })
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();

    // Review statistics
    const reviewStats = await this.reviewRepository
      .createQueryBuilder('review')
      .select([
        'review.rating',
        'COUNT(review.id) as count',
      ])
      .where('review.status = :status', { status: 'approved' })
      .groupBy('review.rating')
      .orderBy('review.rating', 'ASC')
      .getRawMany();

    return {
      coupons: couponStats,
      customerAcquisition,
      reviews: reviewStats,
    };
  }

  // Returns and Exchanges
  async getReturnsAndExchanges(page: number = 1, limit: number = 10, type?: 'return' | 'exchange', status?: string) {
    let queryBuilder;
    let total;
    let data;

    if (type === 'return' || !type) {
      queryBuilder = this.returnRepository
        .createQueryBuilder('return')
        .leftJoinAndSelect('return.orderItem', 'orderItem')
        .leftJoinAndSelect('orderItem.order', 'order')
        .leftJoinAndSelect('orderItem.product', 'product')
        .leftJoinAndSelect('order.user', 'user');

      if (status) {
        queryBuilder.andWhere('return.status = :status', { status });
      }

      total = await queryBuilder.getCount();
      data = await queryBuilder
        .orderBy('return.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    }

    if (type === 'exchange') {
      queryBuilder = this.exchangeRepository
        .createQueryBuilder('exchange')
        .leftJoinAndSelect('exchange.orderItem', 'orderItem')
        .leftJoinAndSelect('orderItem.order', 'order')
        .leftJoinAndSelect('orderItem.product', 'product')
        .leftJoinAndSelect('order.user', 'user');

      if (status) {
        queryBuilder.andWhere('exchange.status = :status', { status });
      }

      total = await queryBuilder.getCount();
      data = await queryBuilder
        .orderBy('exchange.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
    }

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}