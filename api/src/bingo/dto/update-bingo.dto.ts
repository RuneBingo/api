import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateBingoDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  private: boolean;

  @ApiProperty()
  fullLineValue: number;

  @ApiProperty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  endDate: Date;
}
