import axios from "axios";

// Configuración base para axios
export const api = axios.create({
  baseURL: "https://erp-module.onrender.com", // URL base del backend
});

// Función para obtener los productos
export const getProducts = async () => {
  try {
    const response = await api.get("/producto");
    return response.data; // Retorna los datos del backend
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};
