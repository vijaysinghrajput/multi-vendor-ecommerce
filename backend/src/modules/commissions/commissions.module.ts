import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commission } from './entities/commission.entity';
import { CommissionsService } from './services/commissions.service';
import { CommissionsController } from './controllers/commissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Commission])],
  controllers: [CommissionsController],
  providers: [CommissionsService],
  exports: [CommissionsService],
})
export class CommissionsModule {}