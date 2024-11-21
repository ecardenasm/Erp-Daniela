import { ProductionPort } from '../../core/ports/ProductionPort';
import { Order, ProductionMetrics, ProductionState } from '../../core/domain/production/ProductionTypes';
import { api } from '../config'; // Importa la instancia de axios configurada

export class ProductionApiAdapter implements ProductionPort {
  private async fetchApi<T>(endpoint: string, options?: { method?: string; data?: any }): Promise<T> {
    try {
      const response = await api.request<T>({
        url: endpoint,
        method: options?.method || 'GET',
        data: options?.data,
        // Si necesitas manejar cookies o autenticación, puedes configurar las credenciales aquí.
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getOrders(): Promise<Order[]> {
    return this.fetchApi<Order[]>('/orders');
  }

  async getCurrentProduction(): Promise<ProductionState> {
    return this.fetchApi<ProductionState>('/production/current');
  }

  async startProduction(orderId: string): Promise<void> {
    await this.fetchApi('/production/start', {
      method: 'POST',
      data: { orderId },
    });
  }

  async stopProduction(): Promise<void> {
    await this.fetchApi('/production/stop', {
      method: 'POST',
    });
  }

  async updateInventory(amount: number): Promise<number> {
    const response = await this.fetchApi<{ inventory: number }>('/inventory/update', {
      method: 'POST',
      data: { amount },
    });
    return response.inventory;
  }

  async getMetrics(): Promise<ProductionMetrics> {
    return this.fetchApi<ProductionMetrics>('/production/metrics');
  }
}
