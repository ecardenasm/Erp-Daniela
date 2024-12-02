import { useState, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { InventarioApi } from '../infrastructure/adapters/InventarioApiAdapter';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export default function LemonadeProductionForm() {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { color, mode } = useThemeStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await InventarioApi<{ products: InventoryItem[] }>('/products', {
          method: 'GET',
        });
        setProducts(response.products || []);
        setError(null);
      } catch (err: any) {
        setError('❌ No pudimos cargar los productos. Revisa tu conexión e inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedProduct || quantity <= 0) {
      setError('⚠️ Selecciona un producto y especifica una cantidad mayor a 0.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await InventarioApi(`/products/production?product_id=${selectedProduct}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
        },
      });

      alert('🎉 Producción iniciada exitosamente.');
    } catch (err: any) {
      setError('❌ Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTextColor = () => {
    const darkTextColors = {
      yellow: 'text-gray-900',
      emerald: 'text-gray-100',
      indigo: 'text-gray-100',
    };

    const lightTextColors = {
      yellow: 'text-gray-800',
      emerald: 'text-gray-900',
      indigo: 'text-gray-900',
    };

    return mode === 'dark' ? darkTextColors[color] : lightTextColors[color];
  };

  const themeClasses = {
    bg: mode === 'dark' ? `bg-${color}-900` : `bg-${color}-100`,
    border: mode === 'dark' ? 'border-gray-700' : 'border-gray-300',
    button: mode === 'dark' ? `bg-${color}-700 hover:bg-${color}-800` : `bg-${color}-500 hover:bg-${color}-600`,
  };

  return (
    <div
      className={`max-w-xl mx-auto p-8 rounded-lg shadow-lg space-y-6 transition-all ${themeClasses.bg} ${getTextColor()}`}
    >
      <h2 className="text-3xl font-bold text-center">🍋 Producción de Limonada</h2>

      {loading && <p className="text-center">⏳ Cargando productos...</p>}
      {error && <p className="text-red-500 font-medium text-center">{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="product" className="block text-sm font-medium">
              Selecciona un producto:
            </label>
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className={`mt-1 block w-full rounded-lg shadow-sm focus:ring-${color}-500 focus:border-${color}-500 sm:text-sm ${themeClasses.border}`}
            >
              <option value="">-- Selecciona un producto --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.quantity} {product.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium">
              Cantidad a producir:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className={`mt-1 block w-full rounded-lg shadow-sm focus:ring-${color}-500 focus:border-${color}-500 sm:text-sm ${themeClasses.border}`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-lg font-semibold rounded-lg shadow-md text-white transition-all ${
              isSubmitting
                ? `bg-${color}-400 cursor-not-allowed opacity-70`
                : themeClasses.button
            }`}
          >
            {isSubmitting ? 'Procesando...' : 'Iniciar Producción'}
          </button>
        </form>
      )}
    </div>
  );
}
