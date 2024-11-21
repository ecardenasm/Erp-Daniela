import { useState, useEffect, lazy, Suspense } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';
import { useProductionStore } from '../store/productionStore';
import { ProductionMetrics } from './ProductionMetrics';

const LoadingScreen = lazy(() => import('./LoadingScreen'));
const OrderSelectionModal = lazy(() => import('./OrderSelectionModal'));

const PRODUCTION_INTERVAL = 50;
const INITIAL_LOAD_DELAY = 800;

export default function ProductionModule() {
  const {
    inventory,
    currentOrder,
    isProducing,
    producedAmount,
    metrics,
    setCurrentOrder,
    setIsProducing,
    setProducedAmount,
    incrementInventory,
    incrementProducedAmount,
    startProduction,
    stopProduction,
    fetchCurrentProduction,
    fetchMetrics,
  } = useProductionStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  // Initial data loading
  useEffect(() => {
    const initializeProduction = async () => {
      try {
        await Promise.all([
          fetchCurrentProduction().catch(() => {
            console.warn('Modulo de producción no disponible');
            setBackendUnavailable(true);
          }),
          fetchMetrics().catch(() => {
            console.warn('Métricas no disponibles');
          }),
        ]);
      } catch (err) {
        setError('Error al cargar los datos de producción');
      } finally {
        setTimeout(() => setIsLoading(false), INITIAL_LOAD_DELAY);
      }
    };

    initializeProduction();
  }, [fetchCurrentProduction, fetchMetrics]);

  // Production process
  // Production process
useEffect(() => {
  if (!isProducing || !currentOrder) return;

  let productionInterval: number; // Cambiado de NodeJS.Timeout a number
  
  const produce = async () => {
    try {
      setProgress((prev) => {
        if (prev >= 100) {
          if (producedAmount >= currentOrder.quantity) {
            stopProduction();
            setCurrentOrder(null);
            setProducedAmount(0);
            return 0;
          }
          incrementInventory();
          incrementProducedAmount();
          return 0;
        }
        return prev + 5;
      });
    } catch (err) {
      setError('Error en el proceso de producción');
      stopProduction();
    }
  };

  productionInterval = setInterval(produce, PRODUCTION_INTERVAL);
  return () => clearInterval(productionInterval);
}, [isProducing, currentOrder, producedAmount, incrementInventory, incrementProducedAmount, stopProduction, setCurrentOrder, setProducedAmount]);


  const handleStartProduction = async () => {
    if (backendUnavailable) {
      setError('El módulo de producción no está habilitado en el backend');
      return;
    }
    try {
      if (!currentOrder) {
        setShowOrderModal(true);
        return;
      }

      if (isProducing) {
        await stopProduction();
      } else {
        await startProduction(currentOrder.id);
      }
      setError(null);
    } catch (err) {
      setError('Error al iniciar/detener la producción');
    }
  };

  const handleOrderSelect = async (order: any) => {
    if (backendUnavailable) {
      setError('El módulo de producción no está habilitado en el backend');
      return;
    }
    try {
      setCurrentOrder(order);
      setProducedAmount(0);
      setShowOrderModal(false);
      await startProduction(order.id);
    } catch (err) {
      setError('Error al iniciar la producción del pedido');
    }
  };

  if (isLoading) {
    return (
      <Suspense fallback={null}>
        <LoadingScreen />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Estado de Producción</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {backendUnavailable && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <p className="font-medium">El módulo de producción no está habilitado.</p>
            <p>Contacte al administrador para habilitar el backend.</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">Inventario Actual</p>
            <p className="text-2xl font-bold">{inventory}</p>
          </div>
          <button
            onClick={handleStartProduction}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
              isProducing
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            disabled={backendUnavailable}
          >
            {isProducing ? (
              <>
                <Pause className="w-5 h-5" /> Detener
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> {currentOrder ? 'Continuar' : 'Seleccionar Pedido'}
              </>
            )}
          </button>
        </div>

        {currentOrder && !backendUnavailable && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
            <p className="font-medium">Pedido en Producción</p>
            <p>Cliente: {currentOrder.client}</p>
            <p>Progreso: {producedAmount} / {currentOrder.quantity} unidades</p>
          </div>
        )}

        {isProducing && !backendUnavailable && (
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {!backendUnavailable && <ProductionMetrics metrics={metrics} />}

      <Suspense fallback={null}>
        {showOrderModal && (
          <OrderSelectionModal 
            isOpen={showOrderModal}
            onClose={() => setShowOrderModal(false)}
            onSelect={handleOrderSelect}
            currentInventory={inventory}
          />
        )}
      </Suspense>
    </div>
  );
}
