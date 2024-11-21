import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const qualityData = [
  { date: '01/03', good: 95, expiring: 3, defective: 2 },
  { date: '02/03', good: 93, expiring: 4, defective: 3 },
  { date: '03/03', good: 96, expiring: 2, defective: 2 },
  { date: '04/03', good: 94, expiring: 4, defective: 2 },
  { date: '05/03', good: 97, expiring: 2, defective: 1 },
];

export default function QualityModule() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Estado Perfecto</h3>
          <p className="text-2xl font-bold text-green-600">95%</p>
          <p className="text-sm text-gray-500">142 unidades</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Próximos a Vencer</h3>
          <p className="text-2xl font-bold text-orange-600">3%</p>
          <p className="text-sm text-gray-500">5 unidades</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Defectuosos</h3>
          <p className="text-2xl font-bold text-red-600">2%</p>
          <p className="text-sm text-gray-500">3 unidades</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Histórico de Calidad</h2>
        <LineChart width={800} height={300} data={qualityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="good" stroke="#22c55e" />
          <Line type="monotone" dataKey="expiring" stroke="#f97316" />
          <Line type="monotone" dataKey="defective" stroke="#ef4444" />
        </LineChart>
      </div>
    </div>
  );
}