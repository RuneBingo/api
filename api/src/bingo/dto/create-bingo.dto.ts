import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString, Matches } from 'class-validator';

export class CreateBingoDto {
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
  width: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  height: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  fullLineValue: number;

  @ApiProperty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in the format yyyy-mm-dd',
  })
  startDate: Date;

  @ApiProperty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in the format yyyy-mm-dd',
  })
  endDate: Date;
}
