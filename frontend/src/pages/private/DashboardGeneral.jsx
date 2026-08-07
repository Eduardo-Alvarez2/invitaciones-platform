import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//  Cambiamos axios por la instancia configurada 'api'
import { api } from "../services/api"; 
import { 
  Plus, Calendar, MapPin, 
  Layout, Settings, CreditCard, CheckCircle, Clock 
} from "lucide-react";

// Detecta si estamos en Producción o Desarrollo para renderizar la imagen
const BASE_URL = import.meta.env.PROD 
  ? "https://invitto.cloud" 
  : "http://localhost:5000";

function DashboardGeneral() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        // ✅ Usamos 'api.get' que ya adjunta el token JWT automáticamente
        const res = await api.get("/eventos");
        setEventos(res.data);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  const getEstadoEvento = (evento) => {
    const fechaEvento = new Date(evento.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaEvento < hoy) {
      return { 
        label: "Finalizado", 
        class: "bg-gray-100 text-gray-500", 
        icon: <Clock size={12} /> 
      };
    }
    if (!evento.pagado) {
      return { 
        label: "Pendiente", 
        class: "bg-red-500 text-white shadow-lg shadow-red-200", 
        icon: <CreditCard size={12} /> 
      };
    }
    return { 
      label: "Activo", 
      class: "bg-green-500 text-white shadow-lg shadow-green-200", 
      icon: <CheckCircle size={12} /> 
    };
  };

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Cargando tus eventos...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* 🛠️ HEADER RESPONSIVO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Mis Eventos</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Gestiona y monitorea tus invitaciones</p>
          </div>
          <Link 
            to="/editor" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 text-xs font-black uppercase tracking-wider shrink-0"
          >
            <Plus size={16} /> Crear Nuevo
          </Link>
        </div>

        {/* 🛠️ CONTENEDOR VACÍO RESPONSIVO */}
        {eventos.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-16 text-center border-2 border-dashed border-gray-200 flex flex-col items-center">
            <Layout className="text-gray-300 mb-4 shrink-0" size={44} />
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-gray-800">No hay nada por aquí</h2>
            <p className="text-gray-500 text-sm mt-1 mb-6 max-w-sm">
              Comienza creando tu primera invitación digital ahora mismo.
            </p>
            <Link 
              to="/editor" 
              className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
              Crear mi primer evento
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {eventos.map((evento) => {
              const estado = getEstadoEvento(evento);
              return (
                <div key={evento.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
                  
                  {/* Miniatura de Portada */}
                  <div className="h-40 w-full overflow-hidden relative">
                    {evento.imagen_portada ? (
                      <img 
                        // ✅ Usamos la constante dinámica BASE_URL
                        src={`${BASE_URL}${evento.imagen_portada}`} 
                        alt={evento.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-90" />
                    )}
                    
                    {/* Badge de estado flotante */}
                    <div className="absolute top-4 right-4">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase flex items-center gap-1.5 backdrop-blur-md ${estado.class}`}>
                        {estado.icon} {estado.label}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {evento.nombre}
                    </h3>
                    
                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <div className="bg-gray-100 p-1.5 rounded-md"><Calendar size={14} /></div>
                        {new Date(evento.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <div className="bg-gray-100 p-1.5 rounded-md"><MapPin size={14} /></div>
                        <span className="line-clamp-1">{evento.lugar}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        to={`/dashboard/evento/${evento.id}`}
                        className="flex-1 text-center bg-gray-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg shadow-gray-100"
                      >
                        Gestionar
                      </Link>
                      <Link 
                        to={`/editor-detalle/${evento.id}`}
                        className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                        title="Editar diseño"
                      >
                        <Settings size={18} />
                      </Link>
                    </div>
                  </div>

                  {/* Botón de Pago */}
                  {!evento.pagado && new Date(evento.fecha) >= new Date().setHours(0,0,0,0) && (
                    <Link 
                      to={`/checkout/${evento.id}`}
                      className="bg-amber-500 hover:bg-amber-600 text-white py-3.5 px-6 text-[10px] font-black tracking-widest flex items-center justify-center gap-2 transition-colors uppercase"
                    >
                      <CreditCard size={14} /> Activar Invitación
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardGeneral;