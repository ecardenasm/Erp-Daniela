import { useState, useEffect } from "react";
import { Plus, Loader2, ChevronDown, ChevronUp } from "lucide-react";
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
  const [formData, setFormData] = useState({ name: "", contact: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [ingredientData, setIngredientData] = useState({
    ingredient_id: "",
    quantity: "",
    price: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIngredientData({ ...ingredientData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }
    setFormError(null);
    console.log("Datos enviados:", formData);
    setFormData({ name: "", contact: "" });
    setShowForm(false);
  };

  const handleAddIngredient = (e: React.FormEvent, supplierId: number) => {
    e.preventDefault();
    const { ingredient_id, quantity, price } = ingredientData;

    if (!ingredient_id || !quantity || !price) {
      setFormError("Por favor, completa todos los campos.");
      return;
    }

    console.log(`Ingrediente agregado para el proveedor ${supplierId}:`, ingredientData);

    setIngredientData({ ingredient_id: "", quantity: "", price: "" });
    setSelectedSupplier(null);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Proveedores</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          <p className="ml-2 text-gray-500">Cargando proveedores...</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium mb-4">Agregar Nuevo Proveedor</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Nombre del proveedor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contacto
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Número de contacto o email"
              />
            </div>
            {formError && <p className="text-red-500">{formError}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-600"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-medium text-gray-800">
                  {supplier.name}
                </h4>
                <p className="text-sm text-gray-600">{supplier.contact}</p>
              </div>
              <button
                onClick={() =>
                  setSelectedSupplier(
                    selectedSupplier === supplier.id ? null : supplier.id
                  )
                }
                className="text-gray-500 hover:text-emerald-500"
              >
                {selectedSupplier === supplier.id ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>

            {selectedSupplier === supplier.id && (
              <form
                onSubmit={(e) => handleAddIngredient(e, supplier.id)}
                className="mt-4 space-y-2"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID del Ingrediente
                  </label>
                  <input
                    type="number"
                    name="ingredient_id"
                    value={ingredientData.ingredient_id}
                    onChange={handleIngredientChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={ingredientData.quantity}
                    onChange={handleIngredientChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={ingredientData.price}
                    onChange={handleIngredientChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-600"
                  >
                    Agregar Ingrediente
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
