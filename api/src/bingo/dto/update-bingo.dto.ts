import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

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
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in the format yyyy-mm-dd',
  })
  startDate: string;

  @ApiProperty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'startDate must be in the format yyyy-mm-dd',
  })
  endDate: string;
}
