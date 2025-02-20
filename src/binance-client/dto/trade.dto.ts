export class TradeDto {
  tradeId: number;
  price: string;
  quantity: string;
  firstTradeId: number;
  lastTradeId: number;
  timestamp: number;
  isMaker: boolean;
  isBestPriceMatch: boolean;
}