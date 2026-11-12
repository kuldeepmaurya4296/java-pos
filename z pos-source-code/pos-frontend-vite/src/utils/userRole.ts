import { UserRole } from '@/types/user';

export const userRoles: UserRole[] = [
  'ROLE_STORE_ADMIN',
  'ROLE_STORE_MANAGER',
  'ROLE_BRANCH_MANAGER',
  'ROLE_BRANCH_ADMIN',
  'ROLE_BRANCH_CASHIER',
  'ROLE_CUSTOMER',
];

export const storeAdminRole: UserRole[] = [
  'ROLE_STORE_MANAGER',
  'ROLE_BRANCH_MANAGER',
  'ROLE_BRANCH_ADMIN',
  'ROLE_BRANCH_CASHIER',
];

export const branchAdminRole: UserRole[] = [
  'ROLE_BRANCH_MANAGER',
  'ROLE_BRANCH_ADMIN',
  'ROLE_BRANCH_CASHIER',
];

export const formatRoleLabel = (role: UserRole | string): string => {
  return role.replace('ROLE_', '').replace(/_/g, ' ');
};

