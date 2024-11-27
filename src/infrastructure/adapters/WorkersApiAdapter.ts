import { api } from '../config'; // Importar la instancia de axios configurada

// Tipo de dato para un worker (ajusta según tu API)
interface Worker {
  id: string;
  name: string;
  position: string;
  isActive: boolean;
}

// Función para obtener todos los workers
export const getWorkers = async (): Promise<Worker[]> => {
  try {
    const response = await api.get<Worker[]>('/workers');
    return response.data; // Retorna la lista de trabajadores
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Error al obtener los trabajadores');
    }
    throw new Error(error.message || 'Error de red o desconocido');
  }
};

// Función para obtener un worker específico por ID
export const getWorkerById = async (id: string): Promise<Worker> => {
  try {
    const response = await api.get<Worker>(`/workers/${id}`);
    return response.data; // Retorna los datos del trabajador
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || `Error al obtener el trabajador con ID ${id}`);
    }
    throw new Error(error.message || 'Error de red o desconocido');
  }
};

// Función para crear un nuevo worker
export const createWorker = async (workerData: Omit<Worker, 'id'>): Promise<Worker> => {
  try {
    const response = await api.post<Worker>('/workers', workerData);
    return response.data; // Retorna los datos del trabajador creado
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Error al crear el trabajador');
    }
    throw new Error(error.message || 'Error de red o desconocido');
  }
};

// Función para actualizar un worker existente
export const updateWorker = async (id: string, workerData: Partial<Worker>): Promise<Worker> => {
  try {
    const response = await api.put<Worker>(`/workers/${id}`, workerData);
    return response.data; // Retorna los datos actualizados
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || `Error al actualizar el trabajador con ID ${id}`);
    }
    throw new Error(error.message || 'Error de red o desconocido');
  }
};

// Función para eliminar un worker
export const deleteWorker = async (id: string): Promise<void> => {
  try {
    await api.delete(`/workers/${id}`);
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || `Error al eliminar el trabajador con ID ${id}`);
    }
    throw new Error(error.message || 'Error de red o desconocido');
  }
};
