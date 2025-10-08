import { UserDto } from './user.dto';

export interface OrderDto {
  id: string;
  customerName: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  created: string;
  createdBy: string;
  updated?: string;
  updatedBy?: string;
}

export interface CreateOrderDto {
  customerName: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
}

export interface UpdateOrderDto {
  id:           string;
  customerName: string;
  orderDate:    string;
  status:       OrderStatus;
  totalAmount:  number;
}

export interface OrderDetailDto {
  id: string;
  customerName: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  created: string;
  createdBy?: UserDto;
  updated?: string;
  updatedBy?: UserDto;
}

export enum OrderStatus {
  New = 'New',
  Processing = 'Processing',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}
