export interface PagedDataTableResponse<T> {
  data: T[];
  draw: number;
  recordsTotal: number;
}

export interface OrderColumn {
  data: string;
  name: string;
  orderable: boolean;
}

export interface OrderSort {
  column: number;
  dir: 'asc' | 'desc' | '';
}

export interface PagedOrdersQuery {
  draw:   number;
  start:  number;
  length: number;
  order:  OrderSort[];
  columns?: OrderColumn[];
}

export interface PagedOrdersViewModel {
  id: string;
  customerName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  created: string;
  createdBy: string;
  updated?: string;
  updatedBy?: string;
}