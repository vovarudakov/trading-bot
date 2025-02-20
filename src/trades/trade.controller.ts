import { Controller, Post, Body } from '@nestjs/common';
import { TradeService } from './trade.service';
import { DateRangeDto } from './dto/date-range.dto';

@Controller('trades')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('analyze')
  async analyze(@Body() dateRangeDto: DateRangeDto) {

  }
}
