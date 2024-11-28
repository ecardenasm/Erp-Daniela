// Interfaz para las órdenes de producción de un producto
export interface Order {
  quantity: number;  // Cantidad de productos en la orden
  date: string;      // Fecha de la orden (puede ser un string o un objeto Date)
  productId: string; // Identificador del producto
}


// Interfaz para un producto
export interface Product {
  id: number;
  nombre: string;
  orders: Order[];
}

// Métricas de producción
export interface ProductionMetrics {
  dailyProduction: number;
  efficiency: number;
  averageTime: number;
}

// Estado de la producción
export interface ProductionState {
  inventory: number;
  currentOrder: Order | null;
  isProducing: boolean;
  producedAmount: number;
  metrics: ProductionMetrics;
}

