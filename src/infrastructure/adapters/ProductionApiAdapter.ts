import { ProductionPort } from '../../core/ports/ProductionPort';
import { Order } from '../../core/domain/production/ProductionTypes';
import { api } from '../config'; // Instancia axios configurada

// Adaptador para consumir la API
export class ProductionApiAdapter implements ProductionPort {
  // Función genérica para realizar peticiones a la API
  private async fetchApi<T>(endpoint: string, options?: { method?: string; data?: any }): Promise<T> {
    try {
      // Usar la instancia de axios configurada para realizar la solicitud
      const response = await api.request<T>({
        url: endpoint,
        method: options?.method || 'GET',  // Método GET por defecto
        data: options?.data,
        withCredentials: true,  // Si es necesario para autenticación
      });
      return response.data;
    } catch (error: any) {
      // Manejo de errores más robusto
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      console.error('API Error:', errorMessage);
      throw new Error(errorMessage); // Lanza el error para manejarlo más arriba en la cadena
    }
  }

  // Método para obtener las órdenes agrupadas por productos
  async getOrders(): Promise<Order[]> {
    try {
      const ordersData = await this.fetchApi<{ id: number; nombre: string; orders: { quantity: number; date: string }[] }[]>(
        '/orders/grouped-order-by-products'  // URL de la API
      );

      // Convertir los datos de productos y órdenes en un arreglo de órdenes
      const orders: Order[] = ordersData.flatMap(product => 
        product.orders.map(order => ({
          productId: product.id.toString(),  // Convertir el productId a string
          quantity: order.quantity,
          date: order.date,  // Mantener el formato de fecha
        }))
      );

      return orders; // Retornar el listado de órdenes
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error; // Re-lanzar el error para que se maneje en el contexto superior
    }
  }
}
