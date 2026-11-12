import { Customer } from './customer';
import { Product } from './product';
import { User } from './user';
import { Branch } from './branch';

export type PaymentType = 'CASH' | 'CARD' | 'UPI';
export type OrderStatus = 'COMPLETED' | 'REFUNDED' | 'CANCELLED';

export interface OrderItem {
  id?: number;
  product: Product;
  productId?: number;
  quantity: number;
  price: number;
}

export interface OrderItemDTO {
  productId: number;
  quantity: number;
  price?: number;
  product?: Product;
}

export interface Order {
  id: number;
  totalAmount: number;
  paymentType: PaymentType;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  customer?: Customer;
  cashier?: User;
  branch?: Branch;
}

export interface CreateOrderDTO {
  customerId?: number;
  customer?: Customer;
  paymentType: PaymentType;
  items: Array<{ productId: number; quantity: number }>;
}

