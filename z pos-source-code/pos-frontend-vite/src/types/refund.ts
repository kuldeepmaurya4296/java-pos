import { Order } from './order';
import { User } from './user';
import { Branch } from './branch';

export interface Refund {
  id: number;
  order: Order;
  cashier?: User;
  branch?: Branch;
  reason: string;
  amount: number;
  createdAt: string;
}

export interface CreateRefundDTO {
  orderId: number;
  branchId: number;
  reason: string;
}

