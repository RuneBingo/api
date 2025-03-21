import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { resolvePaginatedQueryWithoutTotal } from '@/db/paginated-query.utils';

import { Bingo } from '../bingo.entity';
import { SearchBingosQuery, SearchBingosResult } from './search-bingos.query';

@QueryHandler(SearchBingosQuery)
export class SearchBingosHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
  ) {}

  async execute(query: SearchBingosQuery): Promise<SearchBingosResult> {
    const { ...pagination } = query.params;
    const bingos = this.bingoRepository.createQueryBuilder('bingo');
    return resolvePaginatedQueryWithoutTotal(bingos, pagination);
  }
}
