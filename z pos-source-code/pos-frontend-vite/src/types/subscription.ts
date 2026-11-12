export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type PaymentGateway = 'RAZORPAY' | 'STRIPE';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  billingCycle: string;
  features?: string[];
  maxBranches?: number;
  maxCashiers?: number;
}

export interface Subscription {
  id: number;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  paymentGateway: PaymentGateway;
  paymentStatus: PaymentStatus;
  transactionId?: string;
}

