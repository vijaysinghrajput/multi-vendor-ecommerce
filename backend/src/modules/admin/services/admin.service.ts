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
}