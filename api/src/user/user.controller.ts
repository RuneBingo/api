import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiQuery, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { I18n, I18nLang, I18nService } from 'nestjs-i18n';

import { AppConfig } from '../config';
import { UserDto } from './dto/user.dto';
import { SearchUsersParams, SearchUsersQuery } from './queries/search-users.query';
import { Roles } from '../auth/roles/roles.constants';
import { PaginatedDtoWithoutTotal } from '../db/dto/paginated.dto';

@Controller('v1/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search for users' })
  @ApiResponse({ status: 200, description: 'Some users may have been found.' })
  @ApiResponse({ status: 400, description: 'The search query or filters are invalid' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', enum: ['active', 'disabled'], required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async searchUsers(
    @Req() req: Request,
    @I18n() i18nService: I18nService,
    @Query('search') search: string = '',
    @Query('status') status: string | null = null,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    // TODO: Add requester
    const requester = req.userEntity ?? null;

    if (status && !['active', 'disabled'].includes(status)) {
      throw new BadRequestException(i18nService.t('user.searchUsers.invalidStatus'));
    }

    const params = { requester, search, status, limit, offset } as SearchUsersParams;
    const { items, ...pagination } = await this.queryBus.execute(new SearchUsersQuery(params));

    const itemsDto = items.map((user) => new UserDto(user));

    return new PaginatedDtoWithoutTotal<UserDto>({ items: itemsDto, ...pagination });
  }
}
