import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guards/auth.guard';

import { CreateBingoCommand } from './commands/create-bingo.command';
import { FormatBingoActivitiesCommand } from './commands/format-bingo-activities.command';
import { UpdateBingoCommand } from './commands/update-bingo-command';
import { BingoDto } from './dto/bingo.dto';
import { CreateBingoDto } from './dto/create-bingo.dto';
import { PaginatedBingoActivitiesDto } from './dto/paginated-bingo-activities.dto';
import { PaginatedBingosDto } from './dto/paginated-bingos.dto';
import { UpdateBingoDto } from './dto/update-bingo.dto';
import { GetBingoByIdParams, GetBingoByIdQuery } from './queries/get-bingo-by-id.query';
import { SearchBingoActivitiesParams, SearchBingoActivitiesQuery } from './queries/search-bingo-activities.query';
import { SearchBingosParams, SearchBingosQuery } from './queries/search-bingos.query';

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
  @ApiOperation({ summary: 'Get bingos with limit and offset parameters' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Here are the bingos' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getBingos(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<PaginatedBingosDto> {
    const params = {
      requester: req.userEntity,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    } satisfies SearchBingosParams;

    const { items, ...pagination } = await this.queryBus.execute(new SearchBingosQuery(params));

    const bingosDto = await Promise.all(items.map(async (bingo) => await BingoDto.fromBingo(bingo)));

    return new PaginatedBingosDto({ items: bingosDto, ...pagination });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a bingo by its id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The bingo has been found', type: BingoDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'The bingo does not exist' })
  async findById(@Param('id') id: number, @Req() req: Request): Promise<BingoDto> {
    const params: GetBingoByIdParams = { bingoId: id, requester: req.userEntity! };
    const bingo = await this.queryBus.execute(new GetBingoByIdQuery(params));
    return await BingoDto.fromBingo(bingo);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a bingo event' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The bingo has been updated', type: BingoDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request parameters' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Not authorized to modify this bingo event' })
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateBingoDto: UpdateBingoDto,
  ): Promise<BingoDto> {
    const bingo = await this.commandBus.execute(
      new UpdateBingoCommand({ requester: req.userEntity!, bingoId: id, updateBingoDto: updateBingoDto }),
    );

    return new BingoDto(bingo);
  }

  @Get(':id/activities')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getActivities(
    @Req() req: Request,
    @Param('id') bingoId: number,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<PaginatedBingoActivitiesDto> {
    const params = {
      requester: req.userEntity!,
      bingoId,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    } satisfies SearchBingoActivitiesParams;

    const { items, ...pagination } = await this.queryBus.execute(new SearchBingoActivitiesQuery(params));
    const itemsDto = await this.commandBus.execute(new FormatBingoActivitiesCommand(items));
    return new PaginatedBingoActivitiesDto({ items: itemsDto, ...pagination });
  }
}
