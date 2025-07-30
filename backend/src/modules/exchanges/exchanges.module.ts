import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangesService } from './services/exchanges.service';
import { ExchangesController } from './controllers/exchanges.controller';
import { Exchange } from './entities/exchange.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exchange]),
  ],
  controllers: [ExchangesController],
  providers: [ExchangesService],
  exports: [ExchangesService],
})
export class ExchangesModule {}