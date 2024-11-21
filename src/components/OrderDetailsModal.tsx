import React from 'react';
import { X, Package, Calendar, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  client: string;
  quantity: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const currentStock = 150; // Este valor debería venir de un estado global o prop

  const stockDifference = currentStock - order.quantity;
  const isStockSufficient = stockDifference >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Detalles del Pedido #{order.id}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Cliente</p>
              <p className="font-medium">{order.client}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Creación</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cantidad</p>
              <p className="font-medium">{order.quantity} unidades</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Entrega</p>
              <p className="font-medium">
                {new Date(order.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Análisis de Stock</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Stock Actual:</span>
                <span className="font-medium">{currentStock} unidades</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cantidad Requerida:</span>
                <span className="font-medium">{order.quantity} unidades</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span>Diferencia:</span>
                  <span className={`font-medium ${
                    isStockSufficient ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stockDifference > 0 ? '+' : ''}{stockDifference} unidades
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!isStockSufficient && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>
                Stock insuficiente. Se requiere producir {Math.abs(stockDifference)} unidades adicionales.
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cerrar
            </button>
            {order.status === 'pending' && (
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                onClick={() => {
                  // Aquí iría la lógica para iniciar la producción
                  onClose();
                }}
              >
                Iniciar Producción
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}