export const getPaymentMethodLabel = (method?: string): string => {
  if (!method) return '-';
  switch (method.toLowerCase()) {
    case 'cash':
      return 'Cash';
    case 'card':
      return 'Credit / Debit Card';
    case 'upi':
      return 'UPI / QR Code';
    default:
      return method.toUpperCase();
  }
};

