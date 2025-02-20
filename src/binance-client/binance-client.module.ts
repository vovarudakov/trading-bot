import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TradeService } from '../trades/trade.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT', 5000),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 3),
        baseURL: configService.get(
          'BINANCE_BASE_URL',
          'https://api.binance.com',
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TradeService],
  exports: [TradeService],
})
export class BinanceClientModule {}
