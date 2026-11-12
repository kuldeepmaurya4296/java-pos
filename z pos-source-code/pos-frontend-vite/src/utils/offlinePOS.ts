import { CreateOrderDTO, Order } from '@/types/order';
import api from './api';

const OFFLINE_ORDERS_KEY = 'pos_offline_orders_queue';
const CACHED_PRODUCTS_KEY = 'pos_cached_branch_products';

export interface OfflineOrderRecord {
  tempId: string;
  orderData: CreateOrderDTO;
  createdAt: string;
  synced: boolean;
}

/**
 * Saves an order to local offline queue when connection drops.
 */
export const queueOfflineOrder = (orderData: CreateOrderDTO): OfflineOrderRecord => {
  const existingQueue: OfflineOrderRecord[] = JSON.parse(
    localStorage.getItem(OFFLINE_ORDERS_KEY) || '[]'
  );

  const newOfflineRecord: OfflineOrderRecord = {
    tempId: 'offline_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    orderData,
    createdAt: new Date().toISOString(),
    synced: false,
  };

  existingQueue.push(newOfflineRecord);
  localStorage.setItem(OFFLINE_ORDERS_KEY, JSON.stringify(existingQueue));
  return newOfflineRecord;
};

/**
 * Returns all pending offline orders.
 */
export const getOfflineOrders = (): OfflineOrderRecord[] => {
  return JSON.parse(localStorage.getItem(OFFLINE_ORDERS_KEY) || '[]');
};

/**
 * Synchronizes queued offline orders with the backend when connection is restored.
 */
export const syncOfflineOrders = async (onSyncedCallback?: (syncedCount: number) => void) => {
  if (!navigator.onLine) return;

  const queue: OfflineOrderRecord[] = getOfflineOrders();
  if (queue.length === 0) return;

  const remainingQueue: OfflineOrderRecord[] = [];
  let successfulSyncs = 0;

  for (const record of queue) {
    try {
      await api.post('/api/orders', record.orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      successfulSyncs++;
    } catch (error) {
      console.error('Failed to sync offline order:', record.tempId, error);
      remainingQueue.push(record);
    }
  }

  localStorage.setItem(OFFLINE_ORDERS_KEY, JSON.stringify(remainingQueue));
  if (onSyncedCallback && successfulSyncs > 0) {
    onSyncedCallback(successfulSyncs);
  }
};

/**
 * Caches product catalog locally for instant search and offline lookup.
 */
export const cacheProductsLocally = (products: any[]) => {
  try {
    localStorage.setItem(CACHED_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn('LocalStorage limit reached for products cache');
  }
};

/**
 * Retrieves locally cached products.
 */
export const getCachedProducts = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem(CACHED_PRODUCTS_KEY) || '[]');
  } catch {
    return [];
  }
};

