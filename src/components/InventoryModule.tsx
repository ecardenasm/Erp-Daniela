import { useState, useEffect } from "react";
import { Package, Citrus, Box, ShoppingCart } from "lucide-react";
import PurchaseOrderModal from "./PurchaseOrderModal";
import { InventarioApi } from "../infrastructure/adapters/InventarioApiAdapter"; // Importa el adaptador InventarioApi

interface InventoryItem {
  id: string;         // ID del producto
  name: string;       // Nombre del producto
  quantity: number;   // Cantidad disponible
  unit: string;       // Unidad de medida
  min: number;        // Mínimo requerido
  supplier: string;   // Proveedor
  type: "product" | "raw" | "material"; // Tipo de ítem
  available_units?: number; // Agregar disponible unidades como opcional
}

interface ApiResponse<T> {
  products?: T[];
  ingredients?: T[];
}
// Función para mapear un item genérico
const mapInventoryItem = (item: any, type: "product" | "raw" | "material"): InventoryItem => ({
  id: item.id.toString(),
  name: item.name,
  quantity: item.available_units || 500, // Si `available_units` no está definido, asigna 500 por defecto
  unit: 'unidades', // Puedes asignar un valor predeterminado para la unidad
  min: 10, // Valor predeterminado, puedes cambiarlo si lo obtienes de otro lado
  supplier: "Proveedor Desconocido", // Valor predeterminado, lo puedes cambiar
  type, // Definimos el tipo basado en el parámetro
  available_units: item.available_units, // Agregar la propiedad de unidades disponibles
});

export default function InventoryModule() {
  const [selectedType, setSelectedType] = useState<"raw" | "material" | "product">("raw");
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryItem | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener productos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Llamada al adaptador con el endpoint específico y anotación de tipo
        const productsResponse = await InventarioApi<ApiResponse<InventoryItem>>("/products", "GET");
        const rawResponse = await InventarioApi<ApiResponse<InventoryItem>>("/ingredients", "GET");
  
        // Mapeo de productos e ingredientes usando la función reutilizable
        const mappedProducts = productsResponse.products?.map((product) => mapInventoryItem(product, "product"));
        const mappedRaw = rawResponse.ingredients?.map((ingredient) => mapInventoryItem(ingredient, "raw"));
  
        // Combine los productos y los ingredientes en el inventario
        setInventory([
          ...(mappedProducts || []),
          ...(mappedRaw || []),
        ]);
      } catch (err: any) {
        setError(err.message || "Error al cargar el inventario.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Filtrar inventario según el tipo seleccionado
  const filteredInventory = inventory.filter((item) => item.type === selectedType);

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.min) return "text-red-600";
    if (item.quantity <= item.min * 2) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Botones para filtrar */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedType("raw")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === "raw" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100"
          }`}
        >
          <Citrus className="w-5 h-5" />
          Materia Prima
        </button>
        <button
          onClick={() => setSelectedType("material")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === "material" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100"
          }`}
        >
          <Box className="w-5 h-5" />
          Materiales
        </button>
        <button
          onClick={() => setSelectedType("product")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === "product" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100"
          }`}
        >
          <Package className="w-5 h-5" />
          Productos
        </button>
      </div>
  
      {/* Mostrar error o estado de carga */}
      {loading && <p>Cargando inventario...</p>}
      {error && <p className="text-red-600">{error}</p>}
  
      {!loading && !error && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="space-y-4">
            {filteredInventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.type === "product" ? (
                      <div className="text-sm text-gray-500">
                        {/* Aquí puedes agregar detalles del producto si es necesario */}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Mínimo requerido: {item.min} {item.unit}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${getStockStatus(item)}`}>
                      {item.quantity} / 500 {item.unit} {/* Mostrar cantidad disponible / 500 */}
                    </p>
                    {item.type !== "product" && (
                      <p className={`text-sm ${getStockStatus(item)}`}>
                        {item.quantity <= item.min
                          ? "Stock bajo"
                          : item.quantity <= item.min * 2
                          ? "Stock moderado"
                          : "Stock óptimo"}
                      </p>
                    )}
                  </div>
                  {item.type !== "product" && (
                    <button
                      onClick={() => setSelectedMaterial(item)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
  
      {selectedMaterial && (
        <PurchaseOrderModal
          isOpen={!!selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
          material={selectedMaterial}
        />
      )}
    </div>
  );
}
