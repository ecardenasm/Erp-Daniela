import { 
  Factory, 
  Package, 
  Users,
  Citrus,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const themes = [
  { id: 'yellow', label: 'Limón', light: 'bg-yellow-100 text-yellow-700', dark: 'bg-yellow-900 text-yellow-100' },
  { id: 'emerald', label: 'Esmeralda', light: 'bg-emerald-100 text-emerald-700', dark: 'bg-emerald-900 text-emerald-100' },
  { id: 'indigo', label: 'Índigo', light: 'bg-indigo-100 text-indigo-700', dark: 'bg-indigo-900 text-indigo-100' },
];

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const { color, mode, isCollapsed, setColor, setMode, toggleCollapsed } = useThemeStore();
  
  // Eliminar los módulos "Empleados" y "Maquinaria"
  const modules = [
    { id: 'production', icon: Factory, label: 'Producción' },
    { id: 'inventory', icon: Package, label: 'Inventario' },
    { id: 'suppliers', icon: Users, label: 'Proveedores' },
    // Eliminar empleados y maquinaria
  ];

  const getActiveStyles = (moduleId: string) => {
    const isActive = activeModule === moduleId;
    const baseStyles = 'transition-colors rounded-lg';
    const collapsedPadding = isCollapsed ? 'p-3' : 'p-3 px-4';
    
    if (isActive) {
      return `${baseStyles} ${collapsedPadding} ${
        mode === 'light' 
          ? `bg-${color}-100 text-${color}-700`
          : `bg-${color}-900 text-${color}-100`
      }`;
    }
    
    return `${baseStyles} ${collapsedPadding} text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800`;
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 shadow-lg flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Citrus className={`w-8 h-8 text-${color}-400`} />
          {!isCollapsed && <h1 className="text-xl font-bold text-gray-800 dark:text-white">Diana ERP</h1>}
        </div>
        <button 
          onClick={toggleCollapsed}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={`w-full flex items-center gap-3 ${getActiveStyles(module.id)}`}
              title={isCollapsed ? module.label : undefined}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">{module.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t dark:border-gray-800">
        <div className="space-y-4">
          <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
            <button
              onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              title={isCollapsed ? 'Cambiar modo' : undefined}
            >
              {mode === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {!isCollapsed && <span className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </span>}
          </div>

          {!isCollapsed && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Palette className="w-4 h-4" />
                <span>Tema de color</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setColor(theme.id as any)}
                    className={`p-2 rounded-lg text-xs ${
                      color === theme.id 
                        ? mode === 'light' ? theme.light : theme.dark
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
