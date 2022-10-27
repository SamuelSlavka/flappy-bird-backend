export interface PaginationResultInterface<PaginationEntity> {
  results: PaginationEntity[];
  total: number;
  next?: string;
  previous?: string;
}

export interface PaginationOptionsInterface {
  limit: number;
  page: number;
}

export interface PositionOptionsInterface {
  record: number;
}
