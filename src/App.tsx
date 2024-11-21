import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProductionModule from './components/ProductionModule';
import OrdersModule from './components/OrdersModule';
import InventoryModule from './components/InventoryModule';
import SuppliersModule from './components/SuppliersModule';
import EmployeesModule from './components/EmployeesModule';
import MachineryModule from './components/MachineryModule';
import { useThemeStore } from './store/themeStore';

function App() {
  const [activeModule, setActiveModule] = useState('production');
  const { mode, isCollapsed } = useThemeStore();

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const renderModule = () => {
    switch (activeModule) {
      case 'production':
        return <ProductionModule />;
      case 'orders':
        return <OrdersModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'suppliers':
        return <SuppliersModule />;
      case 'employees':
        return <EmployeesModule />;
      case 'machinery':
        return <MachineryModule />;
      default:
        return <ProductionModule />;
    }
  };

  return (
    <div className={`min-h-screen ${mode === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <main className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} p-8`}>
        {renderModule()}
      </main>
    </div>
  );
}

export default App;