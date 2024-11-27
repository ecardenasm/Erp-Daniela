import { useEffect, useState } from 'react';
import { Settings, Calendar, Activity } from 'lucide-react';
import { getProductionLines } from '../infrastructure/adapters/MachineryApiAdapter'; // Asegúrate de importar la función

// Tipos para las líneas de producción y trabajadores
interface Worker {
  id: number;
  name: string;
  uid: string;
  fk_production_line: number;
}

interface ProductionLine {
  id: number;
  liquid_capacity: number;
  solid_capacity: number;
  production_factor: number;
  workers: Worker[];
}

export default function MachineryModule() {
  const [productionLines, setProductionLines] = useState<ProductionLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar las líneas de producción desde la API
  useEffect(() => {
    const fetchProductionLines = async () => {
      try {
        const data = await getProductionLines();
        setProductionLines(data);
      } catch (error: any) {
        setError(error.message || 'Error al obtener las líneas de producción');
        console.error("Error al obtener líneas de producción:", error);
      }
    };

    fetchProductionLines();
  }, []);

  if (error) {
    return (
      <div className="text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {/* Contadores de estado */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Operativas</h3>
          <p className="text-2xl font-bold text-green-600">
            {productionLines.filter(line => line.liquid_capacity > 0 && line.solid_capacity > 0).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">En Mantenimiento</h3>
          <p className="text-2xl font-bold text-orange-600">
            {productionLines.filter(line => line.liquid_capacity === 0 || line.solid_capacity === 0).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Requieren Atención</h3>
          <p className="text-2xl font-bold text-red-600">
            {productionLines.filter(line => line.liquid_capacity < 500).length}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Estado de Maquinaria</h2>
        <div className="space-y-4">
          {productionLines.map((line) => (
            <div key={line.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    line.liquid_capacity > 0 ? 'bg-green-100' :
                    line.liquid_capacity === 0 ? 'bg-orange-100' : 'bg-red-100'
                  }`}>
                    <Settings className={`w-6 h-6 ${
                      line.liquid_capacity > 0 ? 'text-green-600' :
                      line.liquid_capacity === 0 ? 'text-orange-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{`Línea de Producción ${line.id}`}</h3>
                    <p className="text-sm text-gray-500">
                      {line.liquid_capacity > 0 ? 'En operación' : line.liquid_capacity === 0 ? 'En mantenimiento' : 'Requiere atención'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Capacidad Líquida</p>
                    <p className="font-medium">{line.liquid_capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacidad Sólida</p>
                    <p className="font-medium">{line.solid_capacity}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Próximo Mantenimiento</p>
                    <p className="font-medium">2024-03-20</p> {/* Esta data puede ser parte de la API si la tuviera */}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Último Mantenimiento</p>
                    <p className="font-medium">2024-02-20</p> {/* Lo mismo para esta */}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium">Trabajadores:</h4>
                <ul className="list-disc ml-6">
                  {line.workers.map((worker) => (
                    <li key={worker.id}>{worker.name} ({worker.uid})</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
