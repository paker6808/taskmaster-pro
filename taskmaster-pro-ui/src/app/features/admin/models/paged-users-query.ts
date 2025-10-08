export interface PagedUsersQuery {
  draw: number;
  start: number;
  length: number;

  order: Array<{
    column: number;
    dir: 'asc' | 'desc' | '';
  }>;

  columns: Array<{
    data: string;
    name: string;
    orderable: boolean;
  }>;
}