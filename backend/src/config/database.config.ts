import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

// Entities
import { User } from '../modules/users/entities/user.entity';
import { Vendor } from '../modules/vendors/entities/vendor.entity';
import { VendorPayout } from '../modules/vendors/entities/vendor-payout.entity';
import { Return } from '../modules/returns/entities/return.entity';
import { Exchange } from '../modules/exchanges/entities/exchange.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { OrderItem } from '../modules/orders/entities/order-item.entity';
import { Product } from '../modules/products/entities/product.entity';
import { ProductImage } from '../modules/products/entities/product-image.entity';
import { ProductVariant } from '../modules/products/entities/product-variant.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { Review } from '../modules/reviews/entities/review.entity';
import { Cart } from '../modules/cart/entities/cart.entity';
import { CartItem } from '../modules/cart/entities/cart-item.entity';
import { Wishlist } from '../modules/wishlist/entities/wishlist.entity';
import { WishlistItem } from '../modules/wishlist/entities/wishlist-item.entity';
import { Address } from '../modules/address/entities/address.entity';
import { Notification } from '../modules/notifications/entities/notification.entity';
import { Payment } from '../modules/payments/entities/payment.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USERNAME'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
      entities: [
        User,
        Vendor,
        VendorPayout,
        Return,
        Exchange,
        Order,
        OrderItem,
        Product,
        ProductImage,
        ProductVariant,
        Category,
        Review,
        Cart,
        CartItem,
        Wishlist,
        WishlistItem,
        Address,
        Notification,
        Payment,
      ],
      migrations: ['dist/database/migrations/*.js'],
      synchronize: false,
      logging: this.configService.get('NODE_ENV') === 'development',
      ssl: this.configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
    };
  }
}

// DataSource for migrations
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'mac',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'multi_vendor_ecommerce',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

export const AppDataSource = new DataSource(dataSourceOptions);