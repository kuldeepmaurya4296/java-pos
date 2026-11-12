export type UserRole =
  | 'ROLE_ADMIN'
  | 'ROLE_STORE_ADMIN'
  | 'ROLE_STORE_MANAGER'
  | 'ROLE_BRANCH_MANAGER'
  | 'ROLE_BRANCH_ADMIN'
  | 'ROLE_BRANCH_CASHIER'
  | 'ROLE_CUSTOMER';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  storeId?: number;
  branchId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  storeId?: number;
  branchId?: number;
  jwt?: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
  message?: string;
  status?: boolean;
}

