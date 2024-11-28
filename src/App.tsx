import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProductionModule from './components/ProductionModule';
import InventoryModule from './components/InventoryModule';
import SuppliersModule from './components/SuppliersModule';
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
      case 'inventory':
        return <InventoryModule />;
      case 'suppliers':
        return <SuppliersModule />;
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