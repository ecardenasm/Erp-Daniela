import { useState, useEffect } from 'react';
import { Package, Citrus, Box, ShoppingCart } from 'lucide-react';
import PurchaseOrderModal from './PurchaseOrderModal';
import { InventarioApi } from '../infrastructure/adapters/InventarioApiAdapter';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  min: number;
  supplier: string;
  type: 'Solido' | 'Liquido' | 'Envase' | 'material' | 'product';
  available_units?: number;
}

interface ApiResponse<T> {
  products?: T[];
  ingredients?: T[];
}

const mapInventoryItem = (item: any, type: 'product' | 'material' | 'raw'): InventoryItem => {
  const rawType = item.type === 'Solido' || item.type === 'Liquido' || item.type === 'Envase' 
    ? item.type 
    : 'material';

  return {
    id: item.id.toString(),
    name: item.name,
    quantity: item.available_units || 500,
    unit: 'unidades',
    min: 10,
    supplier: item.supplier || 'Proveedor Desconocido',
    type: type === 'raw' ? rawType : type,
  };
};

export default function InventoryModule() {
  const [selectedType, setSelectedType] = useState<'raw' | 'material' | 'product'>('raw');
  const [selectedMaterial, setSelectedMaterial] = useState<InventoryItem | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsResponse, rawResponse] = await Promise.all([
          InventarioApi<ApiResponse<InventoryItem>>('/products', { method: 'GET' }), // Usar un objeto con 'method'
          InventarioApi<ApiResponse<InventoryItem>>('/ingredients', { method: 'GET' }),
        ]);
        

        const mappedProducts = productsResponse.products?.map((product) =>
          mapInventoryItem(product, 'product')
        );
        const mappedRaw = rawResponse.ingredients?.map((ingredient) =>
          mapInventoryItem(ingredient, 'raw')
        );

        setInventory([...(mappedProducts || []), ...(mappedRaw || [])]);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el inventario.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredInventory = inventory.filter((item) =>
    selectedType === 'raw'
      ? item.type === 'Solido' || item.type === 'Liquido' || item.type === 'Envase'
      : item.type === selectedType
  );

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.min) return 'text-red-600';
    if (item.quantity <= item.min * 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedType('raw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'raw' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Citrus className="w-5 h-5" />
          Materia Prima
        </button>
        <button
          onClick={() => setSelectedType('material')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'material' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Box className="w-5 h-5" />
          Materiales
        </button>
        <button
          onClick={() => setSelectedType('product')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'product' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Package className="w-5 h-5" />
          Productos
        </button>
      </div>

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
                    <p className="text-sm text-gray-500">
                      Mínimo requerido: {item.min} {item.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-lg font-semibold ${getStockStatus(item)}`}>
                    {item.quantity} / 500 {item.unit}
                  </p>
                  <button
                    onClick={() => setSelectedMaterial(item)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
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
          material={{
            id: selectedMaterial.id,
            name: selectedMaterial.name,
            quantity: selectedMaterial.quantity,
            unit: selectedMaterial.unit,
            supplier: selectedMaterial.supplier,
            type: selectedMaterial.type as 'Solido' | 'Liquido' | 'Envase',
          }}
        />
      )}
    </div>
  );
}
