import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorsController } from './controllers/vendors.controller';
import { VendorsService } from './services/vendors.service';
import { Vendor } from './entities/vendor.entity';
import { VendorPayout } from './entities/vendor-payout.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, VendorPayout]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService, TypeOrmModule],
})
export class VendorsModule {}