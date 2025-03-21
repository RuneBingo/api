import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { resolvePaginatedQueryWithoutTotal } from '@/db/paginated-query.utils';

import { Bingo } from '../bingo.entity';
import { GetBingosQuery, GetBingosResult } from './get-bingos.query';

@QueryHandler(GetBingosQuery)
export class GetBingosHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
  ) {}

  async execute(query: GetBingosQuery): Promise<GetBingosResult> {
    const { ...pagination } = query.params;
    const bingos = this.bingoRepository.createQueryBuilder('bingo');
    return resolvePaginatedQueryWithoutTotal(bingos, pagination);
  }
}
