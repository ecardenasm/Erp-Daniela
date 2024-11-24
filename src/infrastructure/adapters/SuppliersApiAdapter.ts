import { api } from "../config";

interface Ingredient {
  ingredient_id: number;
  ingredient_name: string;
  quantity: number;
  price: number;
}

interface Supplier {
  id: number;
  name: string;
  contact: string;
  ingredients: Ingredient[];
}

export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const response = await api.get<Supplier[]>("/suppliers");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al obtener proveedores"
    );
  }
};
