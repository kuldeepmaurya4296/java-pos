import { Branch } from './branch';
import { Product } from './product';

export interface Inventory {
  id: number;
  branch: Branch;
  product: Product;
  quantity: number;
  lastUpdated?: string;
}

export interface InventoryDTO {
  id?: number;
  branchId: number;
  productId: number;
  quantity: number;
  lastUpdated?: string;
  product?: Product;
}

