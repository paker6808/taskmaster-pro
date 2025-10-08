import { OrderDto } from '../../../shared/models/order';

export interface PagedAllOrders {
  draw: number;
  recordsTotal: number;
  data: OrderDto[];
}
