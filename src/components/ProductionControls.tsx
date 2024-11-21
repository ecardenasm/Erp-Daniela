import React from 'react';
import { Play, Pause } from 'lucide-react';

interface ProductionControlsProps {
  isProducing: boolean;
  onToggleProduction: () => void;
  inventory: number;
  maxInventory: number;
}

export default function ProductionControls({
  isProducing,
  onToggleProduction,
  inventory,
  maxInventory
}: ProductionControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-gray-600">Inventario Actual</p>
        <p className="text-2xl font-bold">{inventory} / {maxInventory}</p>
      </div>
      <button
        onClick={onToggleProduction}
        className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
          isProducing
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {isProducing ? (
          <>
            <Pause className="w-5 h-5" /> Detener
          </>
        ) : (
          <>
            <Play className="w-5 h-5" /> Iniciar
          </>
        )}
      </button>
    </div>
  );
}