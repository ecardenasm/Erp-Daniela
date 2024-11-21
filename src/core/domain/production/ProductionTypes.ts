export interface Order {
  id: string;
  client: string;
  quantity: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ProductionMetrics {
  dailyProduction: number;
  efficiency: number;
  averageTime: number;
}

export interface ProductionState {
  inventory: number;
  currentOrder: Order | null;
  isProducing: boolean;
  producedAmount: number;
  metrics: ProductionMetrics;
}