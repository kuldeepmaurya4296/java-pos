import { User } from './user';

export type StoreStatus = 'PENDING' | 'ACTIVE' | 'BLOCKED';

export interface StoreContact {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface Store {
  id: number;
  brand: string;
  storeType?: string;
  description?: string;
  status: StoreStatus;
  contact?: StoreContact;
  storeAdmin?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStoreRequest {
  brand: string;
  storeType?: string;
  description?: string;
  contact?: StoreContact;
}

