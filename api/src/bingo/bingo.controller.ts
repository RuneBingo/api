import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guards/auth.guard';

import { CreateBingoCommand } from './commands/create-bingo.command';
import { BingoDto } from './dto/bingo.dto';
import { CreateBingoDto } from './dto/create-bingo.dto';
import { PaginatedBingosDto } from './dto/paginated-bingos.dto';
import { FindBingoByIdQuery } from './queries/find-bingo-by-id.query';
import { GetBingosParams, GetBingosQuery } from './queries/get-bingos.query';

@Controller('v1/bingo')
export class BingoController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new bingo event' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The bingo event has been created', type: BingoDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The input values are invalid' })
  async create(@Body(new ValidationPipe()) body: CreateBingoDto, @Req() req: Request): Promise<BingoDto> {
    const bingo = await this.commandBus.execute(
      new CreateBingoCommand({ requester: req.userEntity!, createBingoDto: body }),
    );
    return new BingoDto(bingo);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get bingos with limit and offset parameters' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Here are the bingos' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getBingos(@Query('limit') limit?: string, @Query('offset') offset?: string): Promise<PaginatedBingosDto> {
    const params = {
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    } satisfies GetBingosParams;

    const { items, ...pagination } = await this.queryBus.execute(new GetBingosQuery(params));

    const bingosDto = items.map((bingo) => new BingoDto(bingo));

    return new PaginatedBingosDto({ items: bingosDto, ...pagination });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a bingo by its id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The bingo has been found', type: BingoDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'The bingo does not exist' })
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: number): Promise<BingoDto> {
    const bingo = await this.queryBus.execute(new FindBingoByIdQuery(id));
    return await BingoDto.fromBingo(bingo);
  }
}
