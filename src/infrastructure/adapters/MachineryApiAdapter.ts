import { api } from '../config'; // Importamos la instancia de axios configurada



// Función genérica para hacer peticiones a la API usando la instancia de Axios
export const MachineryApi = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> => {
  try {
    const response = await api.request<T>({
      method,
      url: endpoint, // Solo el endpoint porque la baseURL ya está configurada
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
export const getWorkersByMachine = async (machineId: string): Promise<Worker[]> => {
    try {
      const response = await api.get<Worker[]>(`/machines/${machineId}/workers`);
      return response.data; // Retorna la lista de trabajadores de esa máquina
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener trabajadores para la máquina');
    }
  };
  

// Tipos para las líneas de producción y trabajadores
interface Worker {
    id: number;
    name: string;
    uid: string;
    fk_production_line: number;
  }
  
  interface ProductionLine {
    id: number;
    liquid_capacity: number;
    solid_capacity: number;
    production_factor: number;
    workers: Worker[];
  }
  
  // Función para obtener las líneas de producción, ahora con la estructura correcta
  export const getProductionLines = async (): Promise<ProductionLine[]> => {
    return MachineryApi<ProductionLine[]>(
      '/production_lines', // Endpoint para obtener las líneas de producción
      'GET'
    );
  };
  
// Ejemplo de uso: Obtener las líneas de producción y luego manejar la respuesta
getProductionLines()
  .then((productionLines) => {
    console.log('Líneas de Producción:', productionLines);
  })
  .catch((error) => {
    console.error('Error al obtener líneas de producción:', error);
  });
