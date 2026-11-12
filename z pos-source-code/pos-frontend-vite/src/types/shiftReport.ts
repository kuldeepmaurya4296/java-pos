import { User } from './user';
import { Branch } from './branch';
import { Product } from './product';
import { Order } from './order';

export interface PaymentSummary {
  paymentType: string;
  totalAmount: number;
  count: number;
}

export interface ShiftReport {
  id: number;
  shiftStart: string;
  shiftEnd?: string;
  totalSales: number;
  totalRefunds: number;
  netSales: number;
  totalOrders: number;
  cashier?: User;
  branch?: Branch;
  paymentSummaries?: PaymentSummary[];
  topSellingProducts?: Product[];
  recentOrders?: Order[];
}

