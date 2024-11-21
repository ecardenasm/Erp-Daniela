import React from 'react';
import { Settings, AlertTriangle, Calendar, Activity } from 'lucide-react';

const machines = [
  {
    id: 1,
    name: 'Procesadora Principal',
    status: 'operational',
    capacity: 85,
    nextMaintenance: '2024-03-20',
    lastMaintenance: '2024-02-20',
    hoursRunning: 120
  },
  {
    id: 2,
    name: 'Embotelladora',
    status: 'maintenance',
    capacity: 0,
    nextMaintenance: '2024-03-15',
    lastMaintenance: '2024-02-15',
    hoursRunning: 0
  },
  {
    id: 3,
    name: 'Etiquetadora',
    status: 'warning',
    capacity: 60,
    nextMaintenance: '2024-03-18',
    lastMaintenance: '2024-02-18',
    hoursRunning: 80
  }
];

export default function MachineryModule() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Operativas</h3>
          <p className="text-2xl font-bold text-green-600">4</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">En Mantenimiento</h3>
          <p className="text-2xl font-bold text-orange-600">1</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Requieren Atención</h3>
          <p className="text-2xl font-bold text-red-600">1</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Estado de Maquinaria</h2>
        <div className="space-y-4">
          {machines.map((machine) => (
            <div key={machine.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    machine.status === 'operational' ? 'bg-green-100' :
                    machine.status === 'maintenance' ? 'bg-orange-100' : 'bg-red-100'
                  }`}>
                    <Settings className={`w-6 h-6 ${
                      machine.status === 'operational' ? 'text-green-600' :
                      machine.status === 'maintenance' ? 'text-orange-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{machine.name}</h3>
                    <p className="text-sm text-gray-500">
                      {machine.status === 'operational' ? 'En operación' :
                       machine.status === 'maintenance' ? 'En mantenimiento' : 'Requiere atención'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Capacidad</p>
                    <p className="font-medium">{machine.capacity}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horas Activa</p>
                    <p className="font-medium">{machine.hoursRunning}h</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Próximo Mantenimiento</p>
                    <p className="font-medium">{new Date(machine.nextMaintenance).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Último Mantenimiento</p>
                    <p className="font-medium">{new Date(machine.lastMaintenance).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}