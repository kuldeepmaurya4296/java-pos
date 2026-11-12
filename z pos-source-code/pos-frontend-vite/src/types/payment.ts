import { PaymentGateway, PaymentStatus } from './subscription';

export interface PaymentInitiateRequest {
  storeId: number;
  subscriptionId: number;
  amount: number;
  gateway: PaymentGateway;
  description?: string;
}

export interface PaymentInitiateResponse {
  paymentId: number;
  transactionId: string;
  gateway: PaymentGateway;
  amount: number;
  description?: string;
  checkoutUrl?: string;
  razorpayOrderId?: string;
  success: boolean;
  message?: string;
}

export interface PaymentVerifyRequest {
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  stripePaymentIntentId?: string;
}

export interface PaymentDTO {
  id: number;
  amount: number;
  provider: PaymentGateway;
  providerPaymentId?: string;
  transactionId?: string;
  status: PaymentStatus;
  paidAt?: string;
}

