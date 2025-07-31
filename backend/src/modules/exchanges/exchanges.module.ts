import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangesService } from './services/exchanges.service';
import { ExchangesController } from './controllers/exchanges.controller';
import { Exchange } from './entities/exchange.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exchange]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ExchangesController],
  providers: [ExchangesService],
  exports: [ExchangesService],
})
export class ExchangesModule {}