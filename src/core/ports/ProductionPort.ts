import { Order, ProductionMetrics, ProductionState } from '../domain/production/ProductionTypes';

export interface ProductionPort {
  getOrders(): Promise<Order[]>;
  getCurrentProduction(): Promise<ProductionState>;
  startProduction(orderId: string): Promise<void>;
  stopProduction(): Promise<void>;
  updateInventory(amount: number): Promise<number>;
  getMetrics(): Promise<ProductionMetrics>;
}