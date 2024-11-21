import { create } from 'zustand';
import { ProductionState } from '../core/domain/production/ProductionTypes';
import { ProductionApiAdapter } from '../infrastructure/adapters/ProductionApiAdapter';

const productionAdapter = new ProductionApiAdapter();

interface ProductionStore extends ProductionState {
  setInventory: (inventory: number) => void;
  setCurrentOrder: (order: any) => void;
  setIsProducing: (isProducing: boolean) => void;
  setProducedAmount: (amount: number) => void;
  incrementInventory: () => Promise<void>;
  incrementProducedAmount: () => void;
  startProduction: (orderId: string) => Promise<void>;
  stopProduction: () => Promise<void>;
  fetchCurrentProduction: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
}

export const useProductionStore = create<ProductionStore>((set, get) => ({
  inventory: 0,
  currentOrder: null,
  isProducing: false,
  producedAmount: 0,
  metrics: {
    dailyProduction: 0,
    efficiency: 0,
    averageTime: 0
  },

  setInventory: (inventory) => set({ inventory }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setIsProducing: (isProducing) => set({ isProducing }),
  setProducedAmount: (amount) => set({ producedAmount: amount }),

  incrementInventory: async () => {
    try {
      const newInventory = await productionAdapter.updateInventory(get().inventory + 1);
      set({ inventory: newInventory });
    } catch (error) {
      console.error('Error incrementing inventory:', error);
      throw error; // Propagar el error para manejarlo en el componente
    }
  },

  incrementProducedAmount: () => {
    set((state) => ({ producedAmount: state.producedAmount + 1 }));
  },

  startProduction: async (orderId: string) => {
    try {
      await productionAdapter.startProduction(orderId);
      set({ isProducing: true });
    } catch (error) {
      console.error('Error starting production:', error);
      throw error;
    }
  },

  stopProduction: async () => {
    try {
      await productionAdapter.stopProduction();
      set({ isProducing: false });
    } catch (error) {
      console.error('Error stopping production:', error);
      throw error;
    }
  },

  fetchCurrentProduction: async () => {
    try {
      const production = await productionAdapter.getCurrentProduction();
      set(production);
    } catch (error) {
      console.error('Error fetching production:', error);
      throw error;
    }
  },

  fetchMetrics: async () => {
    try {
      const metrics = await productionAdapter.getMetrics();
      set({ metrics });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },
}));