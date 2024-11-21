import { api } from '../config'; // Importar la instancia de axios configurada

// Función genérica para hacer peticiones a la API usando la instancia de Axios
export const InventarioApi = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> => {
  try {
    const response = await api.request<T>({
      method,
      url: endpoint, // Solo el endpoint porque la baseURL ya está en la configuración
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
    });

    return response.data; // Axios ya maneja el parsing del JSON
  } catch (error: any) {
    if (error.response) {
      // Error específico del servidor
      throw new Error(error.response.data?.message || 'Error en la solicitud');
    } else {
      // Error de red u otro
      throw new Error(error.message || 'Error de red o desconocido');
    }
  }
};
