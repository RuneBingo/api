import { ApiProperty } from '@nestjs/swagger';

import { Bingo } from '../bingo.entity';

export class BingoDto {
  constructor(bingo: Bingo) {
    this.language = bingo.language;
    this.title = bingo.title;
    this.description = bingo.description;
    this.private = bingo.private;
    this.width = bingo.width;
    this.height = bingo.height;
    this.fullLineValue = bingo.fullLineValue;
    this.startDate = bingo.startDate;
    this.endDate = bingo.endDate;
    this.startedAt = bingo.startedAt;
    this.startedBy = bingo.startedBy;
    this.endedAt = bingo.endedAt;
    this.endedBy = bingo.endedBy;
    this.cancelledAt = bingo.cancelledAt;
    this.cancelledBy = bingo.cancelledBy;
  }
  @ApiProperty()
  language: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  private: boolean;

  @ApiProperty()
  width: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  fullLineValue: number;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  startedAt: Date;

  @ApiProperty()
  startedBy: number;

  @ApiProperty()
  endedAt: Date;

  @ApiProperty()
  endedBy: number;

  @ApiProperty()
  cancelledAt: Date;

  @ApiProperty()
  cancelledBy: number;
}
