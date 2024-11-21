export interface Product {
  id: string;
  name: string;
  quantity: number;
  status: 'good' | 'expiring' | 'defective';
  productionDate: string;
  expirationDate: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minimumStock: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: 'quality' | 'price';
  rating: number;
  contactInfo: string;
  products: string[];
}