import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventoById } from "../../services/EventService";
import axios from "axios";
import {
  Users,
  Calendar,
  Share2,
  Edit3,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowLeft,
  AlertCircle,
  CreditCard,
  MapPin,
  Download, // 📥 Importamos el ícono de descarga
} from "lucide-react";

// 📄 Importamos las librerías para el PDF
import { jsPDF } from "jspdf";
import autoTable, { applyPlugin } from "jspdf-autotable";

applyPlugin(jsPDF);
// Usamos la IP fija para que el celu resuelva bien las imágenes estáticas del backend
const API_URL = "http://192.168.1.5:5000";

function DashboardEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dataRaw = await getEventoById(id);

        const esPagado =
          dataRaw.pagado === true ||
          dataRaw.pagado === 1 ||
          dataRaw.pagado === "1";

        const eventoProcesado = {
          ...dataRaw,
          pagado: esPagado,
        };

        setEvento(eventoProcesado);

        if (esPagado) {
          const token = localStorage.getItem("token");
          // Levantamos todas las confirmaciones (asistan o no)
          const resStats = await axios.get(
            `${API_URL}/api/admin/eventos/${eventoProcesado.slug}/confirmaciones`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setStats(resStats.data);
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 📥 FUNCIÓN PARA GENERAR Y DESCARGAR EL PDF
  const descargarPDFInvitados = () => {
    // Seguridad: si no está pagado o no hay datos, no hace nada
    if (
      !evento?.pagado ||
      !stats?.confirmaciones ||
      stats.confirmaciones.length === 0
    ) {
      alert(
        "No hay invitados confirmados para exportar o el evento no está activo.",
      );
      return;
    }

    // 1. Crear el documento (Portrait)
    const doc = new jsPDF();

    // 2. Encabezado del PDF (estilo prolijo)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Lista de Invitados (Confirmados)", 14, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Evento: ${evento.nombre.toUpperCase()}`, 14, 30);
    doc.text(
      `Fecha del evento: ${evento.fecha ? new Date(evento.fecha).toLocaleDateString("es-AR") : "Sin fecha"}`,
      14,
      35,
    );
    doc.text(`Total Confirmados: ${stats.total_confirmados || 0}`, 14, 40);
    doc.text(
      `Generado el: ${new Date().toLocaleDateString("es-AR")} a las ${new Date().toLocaleTimeString("es-AR")}`,
      14,
      45,
    );

    // 3. Filtrar y preparar los datos de la tabla (solo los que ASISTEN)
    const invitadosQueAsisten = stats.confirmaciones.filter(
      (conf) => conf.asiste,
    );

    if (invitadosQueAsisten.length === 0) {
      alert("No hay invitados que hayan confirmado asistencia todavía.");
      return;
    }

    // Definimos columnas y filas para jspdf-autotable
    const tablaColumnas = [
      "Nombre / Familia",
      "Lugares",
      "Mensaje / Observación",
    ];

    const tablaFilas = invitadosQueAsisten.map((conf) => [
      conf.nombre,
      conf.cantidad || 1, // Si no tiene cantidad, asumimos 1
      conf.mensaje || "-",
    ]);

    // 4. Generar la tabla automática
    // Reemplazá doc.autoTable({ ... }) por esto:
    autoTable(doc, {
      startY: 52,
      head: [tablaColumnas],
      body: tablaFilas,
      theme: "striped",
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { halign: "center", cellWidth: 20 },
        2: { cellWidth: 90 },
      },
    });

    // 5. Guardar el archivo con el nombre del evento
    const nombreArchivo = `invitados-${evento.slug || "evento"}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(nombreArchivo);
  };

  const copyLink = () => {
    if (!evento?.pagado) return;
    const url = `${window.location.origin}/invitacion/${evento.slug}`;
    navigator.clipboard.writeText(url);
    alert("¡Link de invitación copiado!");
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 font-medium">
        Cargando datos del evento...
      </div>
    );
  if (!evento)
    return (
      <div className="p-10 text-center text-red-500">
        No se pudo cargar el evento.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 🖼️ HERO BANNER SECTION */}
      <div className="h-[380px] w-full relative overflow-hidden">
        {evento.imagen_portada ? (
          <img
            src={`${API_URL}${evento.imagen_portada}`}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            alt="Portada"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-start">
            <Link
              to="/dashboard"
              className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 text-sm font-bold border border-white/10"
            >
              <ArrowLeft size={18} /> Volver
            </Link>

            <div className="flex gap-2">
              <Link
                to={`/editor-detalle/${evento.id}`}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm font-bold shadow-xl"
              >
                <Edit3 size={18} /> Editar Invitación
              </Link>
            </div>
          </div>

          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              {evento.pagado ? (
                <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-green-900/20">
                  <CheckCircle size={12} /> Invitación Activa
                </span>
              ) : (
                <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-amber-900/20">
                  <AlertCircle size={12} /> Requiere Activación
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase italic drop-shadow-2xl">
              {evento.nombre}
            </h1>

            <div className="flex flex-wrap gap-6 text-white/90 font-bold text-sm md:text-base">
              <div className="flex items-center gap-2 drop-shadow-md">
                <Calendar className="text-indigo-300" size={20} />
                {evento.fecha
                  ? new Date(evento.fecha).toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                    })
                  : "Fecha no definida"}
              </div>
              <div className="flex items-center gap-2 drop-shadow-md">
                <MapPin className="text-indigo-300" size={20} />
                {evento.lugar || "Lugar no definido"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 CONTENIDO DE GESTIÓN */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        {/* Banner de Pago */}
        {!evento.pagado && (
          <div className="mb-8 bg-white border-l-8 border-amber-500 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-amber-100 p-4 rounded-full text-amber-600 animate-pulse">
                <CreditCard size={32} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 uppercase text-sm tracking-widest">
                  Activa tu Tarjeta
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  Para que tus invitados puedan confirmar asistencia, debés
                  completar el pago.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/checkout/${evento.id}`)}
              className="w-full md:w-auto bg-amber-600 text-white px-10 py-4 rounded-2xl hover:bg-amber-700 transition-all font-black text-sm shadow-xl shadow-amber-200 uppercase tracking-widest"
            >
              Pagar ahora
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Card de Link */}
          <div className="md:order-last bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">
                Link Público
              </p>
              {evento.pagado ? (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 break-all text-[11px] font-mono text-indigo-600 mb-6 font-bold select-all">
                  {`${window.location.origin}/invitacion/${evento.slug}`}
                </div>
              ) : (
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-dashed border-amber-200 text-center text-[11px] font-bold text-amber-700 mb-6 flex items-center justify-center gap-2">
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>El enlace estará disponible luego del pago.</span>
                </div>
              )}
            </div>
            <button
              onClick={copyLink}
              disabled={!evento.pagado}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all ${
                evento.pagado
                  ? "bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              }`}
            >
              <Share2 size={16} />{" "}
              {evento.pagado ? "Copiar Invitación" : "Link Bloqueado"}
            </button>
          </div>

          {/* Stats Grid */}
          <div
            className={`md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all ${!evento.pagado ? "opacity-50 grayscale" : "opacity-100"}`}
          >
            <StatCard
              icon={<Users className="text-blue-500" />}
              label="Invitados"
              value={stats?.total_personas || 0}
            />
            <StatCard
              icon={<CheckCircle className="text-green-500" />}
              label="Confirmados"
              value={stats?.total_confirmados || 0}
            />
            <StatCard
              icon={<XCircle className="text-red-400" />}
              label="No Asisten"
              value={stats?.total_no_asisten || 0}
            />
            <StatCard
              icon={<MessageSquare className="text-purple-500" />}
              label="Mensajes"
              value={
                stats?.confirmaciones?.filter((c) => c.mensaje).length || 0
              }
            />
          </div>
        </div>

        {/* Tabla de Confirmaciones */}
        <div
          className={`bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden transition-all ${!evento.pagado ? "opacity-30 blur-[2px] pointer-events-none" : ""}`}
        >
          <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 italic uppercase">
              <Users className="text-indigo-600" /> Lista de Invitados
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* 📥 BOTÓN DE DESCARGA PDF */}
              <button
                onClick={descargarPDFInvitados}
                disabled={
                  !evento.pagado ||
                  !stats?.confirmaciones ||
                  stats.confirmaciones.length === 0
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none shrink-0"
              >
                <Download size={16} /> Descargar Lista (PDF)
              </button>

              {!evento.pagado && (
                <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shrink-0">
                  Bloqueado
                </span>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-8 py-5">Nombre / Familia</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5 text-center">Lugares</th>
                  <th className="px-8 py-5">Mensaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.confirmaciones?.map((conf) => (
                  <tr
                    key={conf.id}
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-8 py-5 font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {conf.nombre}
                    </td>
                    <td className="px-8 py-5">
                      {conf.asiste ? (
                        <span className="text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-green-100">
                          Asiste
                        </span>
                      ) : (
                        <span className="text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-[10px] font-black uppercase border border-red-100">
                          No asiste
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-center font-black text-gray-700">
                      {conf.cantidad}
                    </td>
                    <td
                      className="px-8 py-5 text-gray-400 italic text-sm max-w-xs truncate"
                      title={conf.mensaje}
                    >
                      {conf.mensaje || "-"}
                    </td>
                  </tr>
                ))}
                {(!stats?.confirmaciones ||
                  stats.confirmaciones.length === 0) && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-8 py-20 text-center text-gray-300 font-medium"
                    >
                      Aún no hay respuestas de invitados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div className="p-3 bg-gray-50 rounded-2xl w-fit mb-4">{icon}</div>
      <div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default DashboardEvento;
