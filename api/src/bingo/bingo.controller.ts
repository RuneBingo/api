import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { PaginatedActivitiesDto } from '@/activity/dto/paginated-activities.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { AddBingoParticipantCommand } from '@/bingo-participant/commands/add-bingo-participant.command';
import { UserDto } from '@/user/dto/user.dto';

import { CancelBingoCommand } from './commands/cancel-bingo-command';
import { CreateBingoCommand } from './commands/create-bingo.command';
import { DeleteBingoCommand } from './commands/delete-bingo-command';
import { FormatBingoActivitiesCommand } from './commands/format-bingo-activities.command';
import { UpdateBingoCommand } from './commands/update-bingo-command';
import { BingoDto } from './dto/bingo.dto';
import { CreateBingoDto } from './dto/create-bingo.dto';
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
  @ApiCreatedResponse({ description: 'The bingo event has been created.', type: BingoDto })
  @ApiBadRequestResponse({ description: 'The input values are invalid.' })
  async create(@Body(new ValidationPipe()) body: CreateBingoDto, @Req() req: Request): Promise<BingoDto> {
    const bingo = await this.commandBus.execute(
      new CreateBingoCommand({
        requester: req.userEntity!,
        language: body.language,
        title: body.title,
        description: body.description,
        isPrivate: body.private,
        width: body.width,
        height: body.height,
        fullLineValue: body.fullLineValue,
        startDate: body.startDate,
        endDate: body.endDate,
      }),
    );
    await this.commandBus.execute(
      new AddBingoParticipantCommand({ user: req.userEntity!, bingo: bingo, role: 'owner' }),
    );
    return new BingoDto(bingo);
  }

  @Get()
  @ApiOperation({ summary: 'Get bingos paginated list of bingos' })
  @ApiOkResponse({ description: 'Here are the bingos.' })
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

    const bingosDto = items.map((bingo) => new BingoDto(bingo));

    return new PaginatedBingosDto({ items: bingosDto, ...pagination });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a bingo by its id' })
  @ApiOkResponse({ description: 'The bingo has been found.', type: BingoDto })
  @ApiNotFoundResponse({ description: 'The bingo does not exist.' })
  async findById(@Param('id') id: number, @Req() req: Request): Promise<BingoDto> {
    const params: GetBingoByIdParams = { bingoId: id, requester: req.userEntity! };
    const bingo = await this.queryBus.execute(new GetBingoByIdQuery(params));
    const createdBy = new UserDto(await bingo.createdBy);
    const canceledBy = new UserDto(await bingo.canceledBy);
    return new BingoDto(bingo, {
      createdBy,
      canceledBy,
    });
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a bingo event' })
  @ApiOkResponse({ description: 'The bingo has been updated.', type: BingoDto })
  @ApiBadRequestResponse({ description: 'Invalid request parameters.' })
  @ApiUnauthorizedResponse({ description: 'Not authorized to modify this bingo event.' })
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: UpdateBingoDto,
  ): Promise<BingoDto> {
    const bingo = await this.commandBus.execute(
      new UpdateBingoCommand({
        requester: req.userEntity!,
        bingoId: id,
        updates: {
          language: body.language,
          title: body.title,
          description: body.description,
          isPrivate: body.private,
          fullLineValue: body.fullLineValue,
          startDate: body.startDate,
          endDate: body.endDate,
        },
      }),
    );

    return new BingoDto(bingo);
  }

  @Get(':id/activities')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get paginated list of bingo activities' })
  @ApiOkResponse({
    description: 'Sucessful query of bingo activities.',
    type: PaginatedActivitiesDto,
  })
  @ApiNotFoundResponse({ description: 'No bingo with provided Id was found.' })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getActivities(
    @Req() req: Request,
    @Param('id') bingoId: number,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<PaginatedActivitiesDto> {
    const params = {
      requester: req.userEntity!,
      bingoId,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    } satisfies SearchBingoActivitiesParams;

    const { items, ...pagination } = await this.queryBus.execute(new SearchBingoActivitiesQuery(params));
    const itemsDto = await this.commandBus.execute(new FormatBingoActivitiesCommand(items));
    return new PaginatedActivitiesDto({ items: itemsDto, ...pagination });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a bingo event' })
  @ApiOkResponse({ description: 'The bingo event has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'No bingo with provided Id was found.' })
  @ApiUnauthorizedResponse({ description: 'Not authorized to delete the bingo event.' })
  async delete(@Req() req: Request, @Param('id') bingoId: number) {
    const bingo = await this.commandBus.execute(new DeleteBingoCommand({ requester: req.userEntity!, bingoId }));
    const deletedBy = new UserDto(await bingo.deletedBy);
    return new BingoDto(bingo, { deletedBy });
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cancel a bingo event' })
  @ApiOkResponse({ description: 'The bingo event has been successfully cancelled.' })
  @ApiNotFoundResponse({ description: 'No bingo with provided Id was found.' })
  @ApiBadRequestResponse({ description: 'The bingo event was already cancelled or has ended.' })
  @ApiUnauthorizedResponse({ description: 'Not authorized to cancel the bingo event.' })
  async cancel(@Req() req: Request, @Param('id') bingoId: number) {
    const bingo = await this.commandBus.execute(new CancelBingoCommand({ requester: req.userEntity!, bingoId }));
    const canceledBy = new UserDto(await bingo.canceledBy);
    const createdBy = new UserDto(await bingo.createdBy);
    return new BingoDto(bingo, { createdBy, canceledBy });
  }
}
