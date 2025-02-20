import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { TradeDto } from './dto/trade.dto';
import { AggTradeDto } from './dto/agg-trade.dto';

@Injectable()
export class BinanceClient {
  constructor(private readonly httpService: HttpService) {}

  public async getHistoricalTrades(
    startTime: number,
    endTime: number,
  ): Promise<TradeDto[]> {
    const historicalData = await firstValueFrom(
      this.httpService.get<AggTradeDto[]>('api/v3/aggTrades', {
        params: { endTime, startTime, limit: 100, symbol: 'BNBBTC' },
      }),
    );

    return historicalData.data.map((aggTrade) => ({
      tradeId: aggTrade.a,
      price: aggTrade.p,
      quantity: aggTrade.q,
      firstTradeId: aggTrade.f,
      lastTradeId: aggTrade.l,
      timestamp: aggTrade.T,
      isMaker: aggTrade.m,
      isBestPriceMatch: aggTrade.M,
    }));
  }
}
