import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { TradeService } from './trade.service';
import { AnalyzeTimeRangeDto } from './dto/analyze-time-range.dto';

@Controller('trades')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  async analyze(@Body() analyzeTimeRangeDto: AnalyzeTimeRangeDto) {
    return this.tradeService.analyzeHistoricTrades(
      analyzeTimeRangeDto.symbol,
      analyzeTimeRangeDto.startTime,
      analyzeTimeRangeDto.endTime,
      analyzeTimeRangeDto.limit,
    );
  }
}
