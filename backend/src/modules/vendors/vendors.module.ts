import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorsController } from './controllers/vendors.controller';
import { VendorsService } from './services/vendors.service';
import { Vendor } from './entities/vendor.entity';
import { VendorPayout } from './entities/vendor-payout.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, VendorPayout]),
    UsersModule,
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService, TypeOrmModule],
})
export class VendorsModule {}