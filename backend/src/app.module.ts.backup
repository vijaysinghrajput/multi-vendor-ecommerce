import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';

// Configuration
import { envValidationSchema } from './config/env.validation';
import { DatabaseConfig } from './config/database.config';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Modules
import { UsersModule } from './modules/users/users.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { ExchangesModule } from './modules/exchanges/exchanges.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { AddressModule } from './modules/address/address.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CommissionsModule } from './modules/commissions/commissions.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60'),
        limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100'),
      }),
    }),

    // Task scheduling
    ScheduleModule.forRoot(),

    // File upload
    MulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
      },
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    VendorsModule,
    ProductsModule,
    CategoriesModule,
    ReviewsModule,
    CartModule,
    WishlistModule,
    AddressModule,
    NotificationsModule,
    PaymentsModule,
    OrdersModule,
    ReturnsModule,
    ExchangesModule,
    
    // Admin modules
    AdminModule,
    AnalyticsModule,
    CommissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}