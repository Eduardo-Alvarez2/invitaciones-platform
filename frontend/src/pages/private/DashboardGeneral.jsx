import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  Plus, Calendar, MapPin, 
  ChevronRight, Layout, Settings 
} from "lucide-react";

function DashboardGeneral() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/eventos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEventos(res.data);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando tus eventos...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header con botón de crear */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Eventos</h1>
            <p className="text-gray-500">Gestiona tus tarjetas de invitación</p>
          </div>
          <Link 
            to="/editor" 
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md font-medium"
          >
            <Plus size={20} /> Crear Nuevo
          </Link>
        </div>

        {eventos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layout className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Aún no tienes eventos</h2>
            <p className="text-gray-500 mb-6">Comienza creando tu primera invitación digital.</p>
            <Link to="/editor" className="text-indigo-600 font-bold hover:underline">
              Crear mi primer evento →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => (
              <div key={evento.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                      <Calendar size={20} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${
                      evento.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {evento.activo ? 'Activo' : 'Pausado'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {evento.nombre}
                  </h3>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={14} /> {new Date(evento.fecha).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin size={14} /> {evento.lugar}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      to={`/dashboard/evento/${evento.id}`}
                      className="flex-1 text-center bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Gestionar
                    </Link>
                    <Link 
                      to={`/editor-detalle/${evento.id}`}
                      target="_blank"
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="editar invitación"
                    >
                      <Settings size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardGeneral;