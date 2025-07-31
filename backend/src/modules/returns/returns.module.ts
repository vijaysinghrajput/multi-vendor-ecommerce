import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnsService } from './services/returns.service';
import { ReturnsController } from './controllers/returns.controller';
import { Return } from './entities/return.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Return]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {}