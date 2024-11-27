import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { getSuppliers } from "../infrastructure/adapters/SuppliersApiAdapter";

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

export default function SuppliersModule() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const fetchedSuppliers = await getSuppliers();
        setSuppliers(fetchedSuppliers);
      } catch (err) {
        setError((err as Error).message || "Error al obtener proveedores");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Proveedores</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      {loading && <p>Cargando proveedores...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Agregar Nuevo Proveedor</h3>
          <form className="space-y-4">{/* Formulario aquí */}</form>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="p-4 border rounded-lg hover:border-yellow-200 transition-colors"
          >
            <h4 className="font-medium">{supplier.name}</h4>
            <p className="text-sm text-gray-500">{supplier.contact}</p>
            <h5 className="mt-4 font-semibold">Ingredientes:</h5>
            <ul className="list-disc list-inside">
              {supplier.ingredients.map((ingredient) => (
                <li key={ingredient.ingredient_id}>
                  {ingredient.ingredient_name} - {ingredient.quantity} unidades (${ingredient.price})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
