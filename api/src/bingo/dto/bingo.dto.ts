import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '@/user/dto/user.dto';

import { Bingo } from '../bingo.entity';

export class BingoDto {
  constructor(
    bingo: Bingo,
    users?: {
      createdBy?: UserDto;
      startedBy?: UserDto;
      endedBy?: UserDto;
      canceledBy?: UserDto;
      deletedBy?: UserDto;
    },
  ) {
    this.language = bingo.language;
    this.title = bingo.title;
    this.description = bingo.description;
    this.private = bingo.private;
    this.width = bingo.width;
    this.height = bingo.height;
    this.fullLineValue = bingo.fullLineValue;
    this.startDate = bingo.startDate;
    this.endDate = bingo.endDate;
    this.createdBy = users?.createdBy;
    this.startedAt = bingo.startedAt;
    this.startedBy = users?.startedBy;
    this.endedAt = bingo.endedAt;
    this.endedBy = users?.endedBy;
    this.canceledAt = bingo.canceledAt;
    this.canceledBy = users?.canceledBy;
    this.deletedBy = users?.deletedBy;
  }

  @ApiProperty()
  createdBy: UserDto | undefined;

  @ApiProperty()
  updatedBy: UserDto | undefined;

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
  startedBy: UserDto | undefined;

  @ApiProperty()
  endedAt: Date;

  @ApiProperty()
  endedBy: UserDto | undefined;

  @ApiProperty()
  canceledAt: Date;

  @ApiProperty()
  canceledBy: UserDto | undefined;

  @ApiProperty()
  deletedBy: UserDto | undefined;
}
