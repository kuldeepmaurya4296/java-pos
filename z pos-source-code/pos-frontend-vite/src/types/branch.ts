import { User } from './user';
import { Store } from './store';

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  workingDays?: string[];
  openTime?: string;
  closeTime?: string;
  store?: Store;
  manager?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  workingDays?: string[];
  openTime?: string;
  closeTime?: string;
  storeId?: number;
}

