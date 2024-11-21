import React, { useState } from 'react';
import { Package, Calendar, AlertCircle } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

interface Order {
  id: string;
  client: string;
  quantity: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

const orders: Order[] = [
  {
    id: '1',
    client: 'Supermercado XYZ',
    quantity: 500,
    dueDate: '2024-03-20',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    client: 'Distribuidora ABC',
    quantity: 300,
    dueDate: '2024-03-25',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-03-14'
  },
  {
    id: '3',
    client: 'Tienda Local',
    quantity: 100,
    dueDate: '2024-03-22',
    priority: 'low',
    status: 'completed',
    createdAt: '2024-03-13'
  }
];

export default function OrdersModule() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const filteredOrders = orders.filter(order => 
    filter === 'all' ? true : order.status === filter
  );

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

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Producción';
      case 'completed':
        return 'Completado';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pedidos</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
            }`}
          >
            En Producción
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'completed' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
            }`}
          >
            Completados
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{order.client}</h3>
                <p className="text-sm text-gray-500">
                  Pedido #{order.id} - Creado: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(order.priority)}`}>
                  {order.priority === 'high' ? 'Urgente' : 
                   order.priority === 'medium' ? 'Normal' : 'Baja'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div>
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="ml-1">{order.quantity} unidades</span>
                </div>
                <div>
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="ml-1">
                    Vence: {new Date(order.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}