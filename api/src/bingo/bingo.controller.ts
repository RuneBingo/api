import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthGuard } from '@/auth/guards/auth.guard';

import { Bingo } from './bingo.entity';
import { CreateBingoCommand } from './commands/create-bingo.command';
import { BingoDto } from './dto/bingo.dto';
import { CreateBingoDto } from './dto/create-bingo.dto';

@Controller('v1/bingo')
export class BingoController {
  constructor(
    @InjectRepository(Bingo)
    private bingoRepository: Repository<Bingo>,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body(new ValidationPipe()) body: CreateBingoDto, @Req() req: Request): Promise<BingoDto> {
    const bingo = await this.commandBus.execute(
      new CreateBingoCommand({ requester: req.userEntity!, createBingoDto: body }),
    );
    return new BingoDto(bingo);
  }
}
