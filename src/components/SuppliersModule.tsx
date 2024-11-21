import React, { useState } from 'react';
import { Star, DollarSign, Plus, Package, Wrench, Box } from 'lucide-react';

const suppliers = [
  {
    id: 1,
    name: 'Limones del Sur',
    type: 'raw',
    category: 'quality',
    rating: 4.8,
    products: ['Limones orgánicos', 'Limones premium'],
    contact: 'contacto@limonesdelsur.com',
  },
  {
    id: 2,
    name: 'Azúcar Industrial SA',
    type: 'raw',
    category: 'price',
    rating: 4.2,
    products: ['Azúcar refinada', 'Azúcar morena'],
    contact: 'ventas@azucarindustrial.com',
  },
  {
    id: 3,
    name: 'Botellas Premium',
    type: 'packaging',
    category: 'quality',
    rating: 4.6,
    products: ['Botellas 500ml', 'Botellas 1L'],
    contact: 'ventas@botellaspremium.com',
  },
  {
    id: 4,
    name: 'Maquinaria Industrial',
    type: 'machinery',
    category: 'quality',
    rating: 4.9,
    products: ['Mantenimiento', 'Repuestos'],
    contact: 'soporte@maquinariaindustrial.com',
  },
];

export default function SuppliersModule() {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'raw' | 'packaging' | 'machinery'>('raw');

  const filterSuppliers = (type: string) => {
    return suppliers.filter(s => s.type === type);
  };

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

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedType('raw')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'raw' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Package className="w-5 h-5" />
          Materia Prima
        </button>
        <button
          onClick={() => setSelectedType('packaging')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'packaging' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Box className="w-5 h-5" />
          Materiales y Empaques
        </button>
        <button
          onClick={() => setSelectedType('machinery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedType === 'machinery' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
          }`}
        >
          <Wrench className="w-5 h-5" />
          Maquinaria y Mantenimiento
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium mb-4">Agregar Nuevo Proveedor</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
                <option value="raw">Materia Prima</option>
                <option value="packaging">Materiales y Empaques</option>
                <option value="machinery">Maquinaria y Mantenimiento</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500">
                <option value="quality">Calidad Premium</option>
                <option value="price">Mejor Precio</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Productos/Servicios</label>
              <input
                type="text"
                placeholder="Separados por coma"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contacto</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-medium">Mejor Calidad</h3>
          </div>
          <div className="space-y-4">
            {filterSuppliers(selectedType)
              .filter((s) => s.category === 'quality')
              .map((supplier) => (
                <div
                  key={supplier.id}
                  className="p-4 border rounded-lg hover:border-yellow-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{supplier.name}</h4>
                      <p className="text-sm text-gray-500">{supplier.contact}</p>
                    </div>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      {supplier.rating}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Productos/Servicios:</p>
                    <div className="flex gap-2 mt-1">
                      {supplier.products.map((product) => (
                        <span
                          key={product}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-medium">Mejor Precio</h3>
          </div>
          <div className="space-y-4">
            {filterSuppliers(selectedType)
              .filter((s) => s.category === 'price')
              .map((supplier) => (
                <div
                  key={supplier.id}
                  className="p-4 border rounded-lg hover:border-green-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{supplier.name}</h4>
                      <p className="text-sm text-gray-500">{supplier.contact}</p>
                    </div>
                    <span className="flex items-center gap-1 text-green-500">
                      <Star className="w-4 h-4 fill-current" />
                      {supplier.rating}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Productos/Servicios:</p>
                    <div className="flex gap-2 mt-1">
                      {supplier.products.map((product) => (
                        <span
                          key={product}
                          className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}