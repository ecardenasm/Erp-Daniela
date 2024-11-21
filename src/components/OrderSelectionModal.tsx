import React from 'react';
import { X, Package, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  client: string;
  quantity: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

const mockOrders: Order[] = [
  {
    id: '1',
    client: 'Supermercado XYZ',
    quantity: 500,
    dueDate: '2024-03-20',
    priority: 'high'
  },
  {
    id: '2',
    client: 'Distribuidora ABC',
    quantity: 300,
    dueDate: '2024-03-25',
    priority: 'medium'
  },
  {
    id: '3',
    client: 'Tienda Local',
    quantity: 100,
    dueDate: '2024-03-22',
    priority: 'low'
  }
];

interface OrderSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (order: Order) => void;
  currentInventory: number;
}

export default function OrderSelectionModal({
  isOpen,
  onClose,
  onSelect,
  currentInventory
}: OrderSelectionModalProps) {
  if (!isOpen) return null;

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  const getInventoryStatus = (quantity: number) => {
    const difference = currentInventory - quantity;
    if (difference >= 0) {
      return {
        text: `Stock suficiente (+${difference})`,
        color: 'text-green-600'
      };
    }
    return {
      text: `Stock insuficiente (${difference})`,
      color: 'text-red-600'
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Seleccionar Pedido para Producción</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 p-3 rounded-lg">
            <Package className="w-5 h-5" />
            <span>Stock actual: {currentInventory} unidades</span>
          </div>
        </div>

        <div className="space-y-4">
          {mockOrders.map((order) => {
            const inventoryStatus = getInventoryStatus(order.quantity);
            return (
              <div
                key={order.id}
                className="border rounded-lg p-4 hover:border-yellow-200 transition-colors cursor-pointer"
                onClick={() => onSelect(order)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{order.client}</h4>
                    <p className="text-sm text-gray-500">
                      Vencimiento: {new Date(order.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(order.priority)}`}>
                    {order.priority === 'high' ? 'Urgente' : 
                     order.priority === 'medium' ? 'Normal' : 'Baja'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-lg font-semibold">{order.quantity} unidades</p>
                  <p className={`text-sm ${inventoryStatus.color}`}>
                    {inventoryStatus.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}