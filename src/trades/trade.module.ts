import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { BinanceClientModule } from '../binance-client/binance-client.module';

@Module({
  imports: [BinanceClientModule],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
