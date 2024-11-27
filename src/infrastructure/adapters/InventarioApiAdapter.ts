
import { api } from '../config'; // Importar la instancia de Axios configurada

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Métodos HTTP permitidos
  body?: any; // Cuerpo de la petición, opcional
  headers?: Record<string, string>; // Headers adicionales, opcionales
}

// Función genérica para manejar peticiones a la API
export const InventarioApi = async <T = any>(
  endpoint: string, // Endpoint relativo
  options: RequestOptions = {}
): Promise<T> => {
  const { method = 'GET', body, headers } = options;

  if (!endpoint || typeof endpoint !== 'string') {
    throw new Error('El endpoint es requerido y debe ser un string válido.');
  }

  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
    throw new Error(`Método HTTP no válido: ${method}`);
  }

  try {
    const response = await api.request<T>({
      url: endpoint,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers, // Headers personalizados
      },
      data: body,
    });

    return response.data; // Axios parsea automáticamente la respuesta
  } catch (error: any) {
    // Manejo avanzado de errores
    if (error.response) {
      // Errores del servidor
      console.error(
        `Error del servidor (${error.response.status}):`,
        error.response.data
      );
      throw new Error(error.response.data?.message || 'Error en la solicitud al servidor.');
    } else if (error.request) {
      // Errores de red
      console.error('No se recibió respuesta del servidor:', error.request);
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      // Errores desconocidos
      console.error('Error desconocido:', error.message);
      throw new Error(error.message || 'Ocurrió un error desconocido.');
    }
  }
};
