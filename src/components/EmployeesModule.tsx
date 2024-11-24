import { useState, useEffect } from 'react';
import { HardHat, Clock, Wrench, UserPlus } from 'lucide-react';
import RequestPersonnelModal from './RequestPersonnelModal';
import { getWorkers } from '../infrastructure/adapters/WorkersApiAdapter'; // Importar la función

export default function EmployeesModule() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]); // Estado para almacenar los empleados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener empleados al montar el componente
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const workers = await getWorkers(); // Llamamos al adaptador para obtener los trabajadores
        setEmployees(workers); // Actualizamos el estado con los trabajadores
        setLoading(false); // Desactivamos el loading
      } catch (err: any) {
        setError('Error al obtener los empleados');
        setLoading(false);
      }
    };
    
    fetchEmployees(); // Llamada a la API
  }, []);

  if (loading) return <div>Cargando empleados...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal</h2>
        <button
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200"
        >
          <UserPlus className="w-5 h-5" />
          Solicitar Personal
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Personal Activo</h3>
          <p className="text-2xl font-bold text-green-600">{employees.filter(employee => employee.status === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">En Descanso</h3>
          <p className="text-2xl font-bold text-orange-600">{employees.filter(employee => employee.status === 'break').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-600 mb-2">Total Personal</h3>
          <p className="text-2xl font-bold">{employees.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Personal en Turno</h2>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Activo
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              En Descanso
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  employee.status === 'active' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <HardHat className={`w-6 h-6 ${
                    employee.status === 'active' ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{employee.shift}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{employee.machine}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RequestPersonnelModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
      />
    </div>
  );
}
