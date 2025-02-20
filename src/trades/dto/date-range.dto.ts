import { IsNumberString } from 'class-validator';

export class DateRangeDto {
  @IsNumberString()
  readonly startTime: number;
  @IsNumberString()
  readonly endTime: number;
}
