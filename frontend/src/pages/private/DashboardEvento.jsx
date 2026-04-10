import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventoById } from "../../services/EventService"; // Ajusta la ruta a tu service
import axios from "axios"; // Para las confirmaciones que es un endpoint aparte
import { 
  Users, Calendar, MapPin, Share2, 
  Edit3, CheckCircle, XCircle, MessageSquare,
  ExternalLink, ArrowLeft
} from "lucide-react";

function DashboardEvento() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Obtener datos del evento
        const dataEvento = await getEventoById(id);
        setEvento(dataEvento);

        // 2. Obtener confirmaciones (Usando tu endpoint de admin)
        const token = localStorage.getItem("token");
        const resStats = await axios.get(
          `http://localhost:5000/api/admin/eventos/${dataEvento.slug}/confirmaciones`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(resStats.data);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const copyLink = () => {
    const url = `${window.location.origin}/invitacion/${evento.slug}`;
    navigator.clipboard.writeText(url);
    alert("¡Link copiado para enviar por WhatsApp!");
  };

  if (loading) return <div className="p-10 text-center">Cargando panel...</div>;
  if (!evento) return <div className="p-10 text-center">No se encontró el evento.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ArrowLeft size={18} /> Volver a mis eventos
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{evento.nombre}</h1>
            <p className="text-gray-500 flex items-center gap-2 mt-1">
              <Calendar size={16} /> {new Date(evento.fecha).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={copyLink}
              className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
            >
              <Share2 size={18} /> Copiar Link
            </button>
            <Link 
              to={`/editor/${id}`} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium shadow-sm"
            >
              <Edit3 size={18} /> Editar Tarjeta
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<Users className="text-blue-600" />} 
          label="Total Personas" 
          value={stats?.total_personas || 0} 
        />
        <StatCard 
          icon={<CheckCircle className="text-green-600" />} 
          label="Confirmados" 
          value={stats?.total_confirmados || 0} 
        />
        <StatCard 
          icon={<XCircle className="text-red-600" />} 
          label="No Asisten" 
          value={stats?.total_no_asisten || 0} 
        />
        <StatCard 
          icon={<MessageSquare className="text-purple-600" />} 
          label="Mensajes" 
          value={stats?.confirmaciones?.filter(c => c.mensaje).length || 0} 
        />
      </div>

      {/* Listado de Confirmaciones */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Lista de Invitados</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Invitado</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acompañantes</th>
                <th className="px-6 py-4">Mensaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.confirmaciones?.map((conf) => (
                <tr key={conf.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{conf.nombre}</td>
                  <td className="px-6 py-4">
                    {conf.asiste ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold uppercase">Confirmado</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold uppercase">No Asiste</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{conf.cantidad}</td>
                  <td className="px-6 py-4 text-gray-500 italic text-sm">
                    {conf.mensaje || "-"}
                  </td>
                </tr>
              ))}
              {(!stats?.confirmaciones || stats.confirmaciones.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                    Aún no hay confirmaciones para este evento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente pequeño para las tarjetas de stats
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default DashboardEvento;