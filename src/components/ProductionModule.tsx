import { useState, useEffect } from 'react';
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
        setError('Error al cargar los productos.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    // Validaciones antes de enviar
    console.log('Iniciando validaciones...');
    if (!selectedProduct || quantity <= 0) {
      setError('Por favor, selecciona un producto y especifica una cantidad válida mayor a 0.');
      console.log('Error de validación: Producto o cantidad no válida');
      return;
    }
  
    const productId = parseInt(selectedProduct, 10);
    const quantityInt = parseInt(String(quantity), 10);
  
    if (isNaN(productId) || isNaN(quantityInt) || quantityInt <= 0) {
      setError('El ID del producto o la cantidad no son válidos.');
      console.log('Error de validación: ID del producto o cantidad no válidos', { productId, quantityInt });
      return;
    }
  
    console.log('Datos validados:', { productId, quantityInt });
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      // Construir la URL con parámetros de consulta
      const url = `/products/production?product_id=${productId}&quantity=${quantityInt}`;
      console.log('Construyendo URL:', url);
  
      const response = await InventarioApi(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
      });
  
      console.log('Respuesta recibida:', response);
  
      //if (response.success) {
        //alert(`Producción iniciada para ${quantityInt} unidades del producto con ID ${productId}`);
      //} else {
        //setError('Hubo un error al iniciar la producción. Intenta nuevamente.');
        //console.log('Error en la respuesta del servidor:', response);
      //}
    } catch (err: any) {
//      setError('Hubo un error al procesar la solicitud. Intenta nuevamente.');
      console.error('Error en la solicitud:', err);
    } finally {
      setIsSubmitting(false);
      console.log('Proceso finalizado.');
    }
  };
  

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Producción de Limonada</h2>
      {loading && <p className="text-gray-500">Cargando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Selección del producto */}
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">
              Seleccionar producto
            </label>
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            >
              <option value="">-- Selecciona un producto --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad a producir */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Cantidad a producir
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
            />
          </div>

          {/* Botón para enviar */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-medium py-2 px-4 rounded-md shadow-sm`}
          >
            {isSubmitting ? 'Procesando...' : 'Iniciar Producción'}
          </button>
        </form>
      )}
    </div>
  );
}
