import { ProductionMetrics as Metrics } from '../core/domain/production/ProductionTypes';

interface ProductionMetricsProps {
  metrics: Metrics;
}

export function ProductionMetrics({ metrics }: ProductionMetricsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-gray-600 mb-2">Producción Diaria</h3>
        <p className="text-2xl font-bold">{metrics.dailyProduction} unidades</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-gray-600 mb-2">Eficiencia</h3>
        <p className="text-2xl font-bold text-green-600">{metrics.efficiency}%</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-gray-600 mb-2">Tiempo Medio</h3>
        <p className="text-2xl font-bold">{metrics.averageTime} min/u</p>
      </div>
    </div>
  );
}