import { Order } from '../domain/production/ProductionTypes';

export interface ProductionPort {
  getOrders(): Promise<Order[]>;
}