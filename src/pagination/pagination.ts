import { PaginationResultInterface } from './pagination.interfaces';

export class Pagination<PaginationEntity> {
  public results: PaginationEntity[];
  public total: number;

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.results = paginationResults.results;
    this.total = paginationResults.total;
  }
}
