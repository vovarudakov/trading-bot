import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BinanceClient } from './binance.client';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT', 60000),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 3),
        baseURL: configService.get(
          'BINANCE_BASE_URL',
          'https://api.binance.com',
        ),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BinanceClient],
  exports: [BinanceClient],
})
export class BinanceClientModule {}
