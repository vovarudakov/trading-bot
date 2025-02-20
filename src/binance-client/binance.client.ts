import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { TradeDto } from './dto/trade.dto';
import { AggTradeDto } from './dto/agg-trade.dto';

@Injectable()
export class BinanceClient {
  private readonly logger = new Logger(BinanceClient.name);

  constructor(private readonly httpService: HttpService) {}

  private readonly DEFAULT_LIMIT = 500;

  public async getHistoricalTrades(
    symbol: string,
    startTime: number,
    endTime: number,
    limit: number = this.DEFAULT_LIMIT,
  ): Promise<TradeDto[]> {
    let historicalData;
    try {
      historicalData = await firstValueFrom(
        this.httpService.get<AggTradeDto[]>('api/v3/aggTrades', {
          params: { startTime, endTime, limit, symbol },
        }),
      );
    } catch (e) {
      this.logger.error(e);
      throw new BadGatewayException('Could not retrieve historic trades', e);
    }

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
