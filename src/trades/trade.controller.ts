import { Controller, Post, Body } from '@nestjs/common';
import { TradeService } from './trade.service';
import { AnalyzeTimeRangeDto } from './dto/analyze-time-range.dto';

@Controller('trades')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('analyze')
  async analyze(@Body() analyzeTimeRangeDto: AnalyzeTimeRangeDto) {
    return this.tradeService.analyzeHistoricTrades(
      analyzeTimeRangeDto.symbol,
      analyzeTimeRangeDto.startTime,
      analyzeTimeRangeDto.endTime,
    );
  }
}
