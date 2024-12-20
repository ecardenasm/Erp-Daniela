import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { InventarioApi } from '../infrastructure/adapters/InventarioApiAdapter';
import { getSuppliers } from '../infrastructure/adapters/SuppliersApiAdapter';

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    supplier?: string;
    type: 'Solido' | 'Liquido' | 'Envase';
  };
}

export default function PurchaseOrderModal({ isOpen, onClose, material }: PurchaseOrderModalProps) {
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const fetchedSuppliers = await getSuppliers();
        const filteredSuppliers = fetchedSuppliers.filter((supplier) =>
          supplier.ingredients.some((ingredient) => ingredient.ingredient_id === Number(material.id))
        );
        setSuppliers(filteredSuppliers);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setError('Error al cargar los proveedores.');
      }
    };
    if (isOpen) fetchSuppliers();
  }, [material.id, isOpen]);

  if (!isOpen) return null;

  // Asegúrate de que se haga el cálculo solo si hay proveedor seleccionado
  const totalCost = orderQuantity > 100 ?(orderQuantity*180.6) : (orderQuantity * 250.8)

  const handleSubmit = async () => {
    if (orderQuantity <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (!selectedSupplier) {
      setError('Debe seleccionar un proveedor');
      return;
    }

    const purchaseData = {
      supplier_id: selectedSupplier,
      ingredient_id: material.id,
      quantity: orderQuantity,
      value: totalCost,
    };

    setIsLoading(true);
    try {
      await InventarioApi('/ingredients/purchase', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Compra registrada:', purchaseData);
      onClose();
    } catch (err: any) {
      console.error('Error al procesar la solicitud:', err);
      setError(err.message || 'Error al procesar la solicitud. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Crear Orden de Compra</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Material</label>
            <p className="mt-1 text-gray-900">{material.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Actual</label>
            <p className="mt-1 text-gray-900">{material.quantity} lotes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad a Ordenar (lotes)
            </label>
            <input
              type="number"
              min="1"
              value={orderQuantity}
              onChange={(e) => {
                setOrderQuantity(Number(e.target.value));
                setError('');
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Costo Total</label>
            <p className="mt-1 text-gray-900 font-semibold">{totalCost} Pesos</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Proveedor</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              value={selectedSupplier ?? ''}
              onChange={(e) => setSelectedSupplier(Number(e.target.value))}
            >
              <option value="" disabled>
                Seleccione un proveedor
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} - {supplier.price_per_unit} USD/lote
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className={`px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Crear Orden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
