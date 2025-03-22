import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateBingoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  private: boolean;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  fullLineValue: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
}
