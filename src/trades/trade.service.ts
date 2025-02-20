import { HttpException, Injectable } from '@nestjs/common';
import { BinanceClient } from '../binance-client/binance.client';
import * as _ from 'lodash';
import { TradeDto } from '../binance-client/dto/trade.dto';

@Injectable()
export class TradeService {
  constructor(private readonly binanceClient: BinanceClient) {}

  public async analyzeHistoricTrades(
    symbol: string,
    startTime: number,
    endTime: number,
  ) {
    let historicalTrades: TradeDto[];

    try {
      historicalTrades = await this.binanceClient.getHistoricalTrades(
        symbol,
        startTime,
        endTime,
      );
    } catch (e) {
      throw new HttpException('Could not retrieve historic trades', e);
    }

    const tradeWithLowestPrice = _.minBy(historicalTrades, 'price');
    const tradeWithHighestPrice = _.maxBy(historicalTrades, 'price');
    let priceIncreasedCounter = 0;
    let priceDecreasedCounter = 0;
    let maxIncreasedBy = 0;
    let maxDecreasedBy = 0;

    for (let i = 0; i < historicalTrades.length - 1; i++) {
      const change =
        Number(historicalTrades[i + 1].price) -
        Number(historicalTrades[i].price);

      if (change > 0) {
        priceIncreasedCounter++;
        if (maxIncreasedBy < change) {
          maxIncreasedBy = change;
        }
      } else if (change < 0) {
        priceDecreasedCounter++;
        if (maxDecreasedBy < Math.abs(change)) {
          maxDecreasedBy = Math.abs(change);
        }
      }
    }

    return {
      totalTrades: historicalTrades.length,
      priceDecreasedTotalTimes: priceDecreasedCounter,
      priceIncreasedTotalTimes: priceIncreasedCounter,
      maxIncreasedBy,
      maxDecreasedBy,
      tradeWithLowestPrice,
      tradeWithHighestPrice,
    };
  }
}
