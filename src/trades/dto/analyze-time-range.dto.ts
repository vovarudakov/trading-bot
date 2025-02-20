import { IsNumber, IsString } from 'class-validator';

export class AnalyzeTimeRangeDto {
  @IsString()
  readonly symbol: string;
  @IsNumber()
  readonly startTime: number;
  @IsNumber()
  readonly endTime: number;
  @IsNumber()
  readonly limit: number;
}
