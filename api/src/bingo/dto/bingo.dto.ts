import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '@/user/dto/user.dto';

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
    this.createdBy = null;
    this.startedAt = bingo.startedAt;
    this.startedBy = null;
    this.endedAt = bingo.endedAt;
    this.endedBy = null;
    this.cancelledAt = bingo.cancelledAt;
    this.cancelledBy = null;
  }

  static async fromBingo(bingo: Bingo): Promise<BingoDto> {
    const dto = new BingoDto(bingo);

    const creator = await bingo.creator;
    dto.createdBy = creator? new UserDto(creator) : null;

    const startedBy = await bingo.startedBy;
    dto.startedBy = startedBy ? new UserDto(startedBy) : null;

    const endedBy = await bingo.endedBy;
    dto.endedBy = endedBy ? new UserDto(endedBy) : null;

    const cancelledBy = await bingo.cancelledBy;
    dto.cancelledBy = cancelledBy ? new UserDto(cancelledBy) : null;

    const updatedBy = await bingo.updater;
    dto.updatedBy = updatedBy ? new UserDto(updatedBy) : null;

    return dto;
  }

  @ApiProperty()
  createdBy: UserDto | null;

  @ApiProperty()
  updatedBy: UserDto | null;

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
  startedBy: UserDto | null;

  @ApiProperty()
  endedAt: Date;

  @ApiProperty()
  endedBy: UserDto | null;

  @ApiProperty()
  cancelledAt: Date;

  @ApiProperty()
  cancelledBy: UserDto | null;
}
