import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { CommissionsModule } from '../commissions/commissions.module';
import { UsersModule } from '../users/users.module';
import { VendorsModule } from '../vendors/vendors.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { ReturnsModule } from '../returns/returns.module';
import { ExchangesModule } from '../exchanges/exchanges.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { AuthModule } from '../auth/auth.module';

// Import entities for admin overview
import { User } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Return } from '../returns/entities/return.entity';
import { Exchange } from '../exchanges/entities/exchange.entity';
import { Review } from '../reviews/entities/review.entity';
import { Commission } from '../commissions/entities/commission.entity';
import { Analytics } from '../analytics/entities/analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Vendor,
      Category,
      Product,
      Order,
      Return,
      Exchange,
      Review,
      Commission,
      Analytics,
    ]),
    AuthModule,
    AnalyticsModule,
    CommissionsModule,
    UsersModule,
    VendorsModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    ReturnsModule,
    ExchangesModule,
    ReviewsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}