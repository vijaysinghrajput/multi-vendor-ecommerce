import {
  Controller,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            customers: { type: 'number' },
            vendors: { type: 'number' },
            admins: { type: 'number' },
            newThisMonth: { type: 'number' },
          },
        },
        vendors: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            approved: { type: 'number' },
            pending: { type: 'number' },
            suspended: { type: 'number' },
            newThisMonth: { type: 'number' },
          },
        },
        products: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            active: { type: 'number' },
            outOfStock: { type: 'number' },
            newThisMonth: { type: 'number' },
          },
        },
        orders: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pending: { type: 'number' },
            processing: { type: 'number' },
            shipped: { type: 'number' },
            delivered: { type: 'number' },
            cancelled: { type: 'number' },
            totalRevenue: { type: 'number' },
            revenueThisMonth: { type: 'number' },
          },
        },
        returns: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pending: { type: 'number' },
            approved: { type: 'number' },
            rejected: { type: 'number' },
            completed: { type: 'number' },
          },
        },
        exchanges: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pending: { type: 'number' },
            approved: { type: 'number' },
            rejected: { type: 'number' },
            completed: { type: 'number' },
          },
        },
        reviews: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pending: { type: 'number' },
            approved: { type: 'number' },
            rejected: { type: 'number' },
            averageRating: { type: 'number' },
          },
        },
        categories: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            active: { type: 'number' },
          },
        },
        commissions: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            active: { type: 'number' },
            totalEarned: { type: 'number' },
            pendingPayout: { type: 'number' },
          },
        },
      },
    },
  })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/recent-activity')
  @ApiOperation({ summary: 'Get recent platform activity' })
  @ApiResponse({
    status: 200,
    description: 'Recent activity retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        recentOrders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              orderNumber: { type: 'string' },
              customerName: { type: 'string' },
              vendorName: { type: 'string' },
              total: { type: 'number' },
              status: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        recentUsers: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        recentVendors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              businessName: { type: 'string' },
              displayName: { type: 'string' },
              status: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        recentProducts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              vendorName: { type: 'string' },
              price: { type: 'number' },
              status: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  async getRecentActivity(
    @Query('limit') limit: string = '10',
  ) {
    const limitNum = parseInt(limit, 10) || 10;
    return this.adminService.getRecentActivity(limitNum);
  }

  @Get('system/health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({
    status: 200,
    description: 'System health status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        database: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            responseTime: { type: 'number' },
          },
        },
        server: {
          type: 'object',
          properties: {
            uptime: { type: 'number' },
            memory: {
              type: 'object',
              properties: {
                used: { type: 'number' },
                total: { type: 'number' },
                percentage: { type: 'number' },
              },
            },
            cpu: {
              type: 'object',
              properties: {
                usage: { type: 'number' },
              },
            },
          },
        },
        storage: {
          type: 'object',
          properties: {
            used: { type: 'number' },
            total: { type: 'number' },
            percentage: { type: 'number' },
          },
        },
      },
    },
  })
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  @Get('analytics/top-performers')
  @ApiOperation({ summary: 'Get top performing vendors, products, and categories' })
  @ApiResponse({
    status: 200,
    description: 'Top performers retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        topVendors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              businessName: { type: 'string' },
              displayName: { type: 'string' },
              totalRevenue: { type: 'number' },
              salesCount: { type: 'number' },
              rating: { type: 'number' },
            },
          },
        },
        topProducts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              vendorName: { type: 'string' },
              salesCount: { type: 'number' },
              revenue: { type: 'number' },
              averageRating: { type: 'number' },
            },
          },
        },
        topCategories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              productCount: { type: 'number' },
              totalSales: { type: 'number' },
            },
          },
        },
      },
    },
  })
  async getTopPerformers() {
    return this.adminService.getTopPerformers();
  }
}