import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnsService } from './services/returns.service';
import { ReturnsController } from './controllers/returns.controller';
import { Return } from './entities/return.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Return]),
  ],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {}