import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TradeModule } from './trades/trade.module';
import { BinanceClientModule } from './binance-client/binance-client.module';

@Module({
  imports: [ConfigModule.forRoot(), TradeModule, BinanceClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
